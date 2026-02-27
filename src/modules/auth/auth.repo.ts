import { prisma } from "../../db/prisma";
import { Role, TokenType } from "@prisma/client";

export const authRepo = {
  findUserByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findUserById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  createUser: (data: { name: string; email: string; passwordHash: string }) =>
    prisma.user.create({
      data: { ...data, role: Role.USER, isEmailVerified: false, isArchived: false },
    }),

  createSession: (data: { userId: string; userAgent?: string; ip?: string }) =>
    prisma.session.create({
      data: {
        userId: data.userId,
        userAgent: data.userAgent,
        ip: data.ip,
      },
    }),

  revokeSession: (sessionId: string) =>
    prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } }),

  touchSession: (sessionId: string) =>
    prisma.session.update({ where: { id: sessionId }, data: { lastSeenAt: new Date() } }),

  createToken: (data: { userId: string; type: TokenType; tokenHash: string; expiresAt: Date }) =>
    prisma.token.create({ data }),

  findValidToken: (data: { tokenHash: string; type: TokenType }) =>
    prisma.token.findFirst({
      where: {
        tokenHash: data.tokenHash,
        type: data.type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    }),

  markTokenUsed: (id: string) =>
    prisma.token.update({ where: { id }, data: { usedAt: new Date() } }),

  markUserEmailVerified: (userId: string) =>
    prisma.user.update({ where: { id: userId }, data: { isEmailVerified: true } }),

  updatePassword: (userId: string, passwordHash: string) =>
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),

  revokeAllSessionsForUser: (userId: string) =>
    prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
};