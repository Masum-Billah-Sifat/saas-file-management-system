import { TokenType } from "@prisma/client";
import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";
import { created, ok } from "../../utils/response";
import { authRepo } from "./auth.repo";
import { hashPassword, verifyPassword } from "../../utils/password";
import { generateRawToken, hashToken } from "../../utils/token";
import { signAccessToken } from "../../utils/jwt";

function buildLink(path: string) {
  return `${env.APP_BASE_URL}${path}`;
}

export const authService = {
  async register(
    input: { name: string; email: string; password: string },
    meta: { userAgent?: string; ip?: string },
  ) {
    const existing = await authRepo.findUserByEmail(input.email);
    if (existing) throw new HttpError(409, "Email already registered");

    const passwordHash = await hashPassword(input.password);
    const user = await authRepo.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const session = await authRepo.createSession({
      userId: user.id,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });

    // after user creation give him a free package 
    const freePkg = await authRepo.getFreePackage();
    if (!freePkg) throw new HttpError(500, "Free package not seeded");

    await authRepo.createSubscription({
      userId: user.id,
      packageId: freePkg.id,
    });
    // this part is added later 

    // create email verify token (mock link)
    const raw = generateRawToken();
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await authRepo.createToken({
      userId: user.id,
      type: TokenType.EMAIL_VERIFY,
      tokenHash,
      expiresAt,
    });

    const accessToken = signAccessToken({
      sub: user.id,
      sid: session.id,
      role: user.role,
    });

    const verificationLink = buildLink(`/auth/verify-email?token=${raw}`);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      verificationLink, // mock
    };
  },

  async login(
    input: { email: string; password: string },
    meta: { userAgent?: string; ip?: string },
  ) {
    const user = await authRepo.findUserByEmail(input.email);
    if (!user) throw new HttpError(401, "Invalid credentials");
    if (user.isArchived) throw new HttpError(403, "Account disabled");

    const okPass = await verifyPassword(input.password, user.passwordHash);
    if (!okPass) throw new HttpError(401, "Invalid credentials");

    const session = await authRepo.createSession({
      userId: user.id,
      userAgent: meta.userAgent,
      ip: meta.ip,
    });
    const accessToken = signAccessToken({
      sub: user.id,
      sid: session.id,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
    };
  },

  async me(userId: string, sessionId: string) {
    const user = await authRepo.findUserById(userId);
    if (!user || user.isArchived) throw new HttpError(401, "Unauthorized");

    await authRepo.touchSession(sessionId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  },

  async logout(sessionId: string) {
    await authRepo.revokeSession(sessionId);
    return { ok: true };
  },

  async requestEmailVerification(userId: string) {
    const user = await authRepo.findUserById(userId);
    if (!user) throw new HttpError(401, "Unauthorized");
    if (user.isEmailVerified) return { alreadyVerified: true };

    const raw = generateRawToken();
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await authRepo.createToken({
      userId: user.id,
      type: TokenType.EMAIL_VERIFY,
      tokenHash,
      expiresAt,
    });

    const verificationLink = buildLink(`/auth/verify-email?token=${raw}`);
    return { verificationLink };
  },

  async verifyEmail(rawToken: string) {
    const tokenHash = hashToken(rawToken);
    const tokenRow = await authRepo.findValidToken({
      tokenHash,
      type: TokenType.EMAIL_VERIFY,
    });
    if (!tokenRow)
      throw new HttpError(400, "Invalid or expired verification token");

    await authRepo.markUserEmailVerified(tokenRow.userId);
    await authRepo.markTokenUsed(tokenRow.id);

    return { ok: true };
  },

  async forgotPassword(email: string) {
    // Always return ok. Do not leak account existence.
    const user = await authRepo.findUserByEmail(email);
    if (!user || user.isArchived || user.role === "ADMIN") {
      return { ok: true };
    }

    const raw = generateRawToken();
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await authRepo.createToken({
      userId: user.id,
      type: TokenType.PASSWORD_RESET,
      tokenHash,
      expiresAt,
    });

    const resetLink = buildLink(`/auth/reset-password?token=${raw}`);
    return { ok: true, resetLink }; // mock
  },

  async resetPassword(rawToken: string, newPassword: string) {
    const tokenHash = hashToken(rawToken);
    const tokenRow = await authRepo.findValidToken({
      tokenHash,
      type: TokenType.PASSWORD_RESET,
    });
    if (!tokenRow) throw new HttpError(400, "Invalid or expired reset token");

    const user = await authRepo.findUserById(tokenRow.userId);
    if (!user || user.isArchived)
      throw new HttpError(400, "Invalid reset request");
    if (user.role === "ADMIN")
      throw new HttpError(403, "Admin password reset disabled");

    const passwordHash = await hashPassword(newPassword);

    // Security: reset password + invalidate sessions
    await authRepo.updatePassword(user.id, passwordHash);
    await authRepo.markTokenUsed(tokenRow.id);
    await authRepo.revokeAllSessionsForUser(user.id);

    return { ok: true };
  },
};
