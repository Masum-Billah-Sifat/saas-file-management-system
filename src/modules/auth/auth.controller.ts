import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { created, ok } from "../../utils/response";

function getMeta(req: Request) {
  const userAgent = req.headers["user-agent"]?.toString();
  const ip = (req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip || "").trim();
  return { userAgent, ip };
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body, getMeta(req));
      return created(res, result, "Registered");
    } catch (e) {
      next(e);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body, getMeta(req));
      return ok(res, result, "Logged in");
    } catch (e) {
      next(e);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, sessionId } = req.auth!;
      const result = await authService.me(userId, sessionId);
      return ok(res, result);
    } catch (e) {
      next(e);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.auth!;
      const result = await authService.logout(sessionId);
      return ok(res, result, "Logged out");
    } catch (e) {
      next(e);
    }
  },

  async requestEmailVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.auth!;
      const result = await authService.requestEmailVerification(userId);
      return ok(res, result);
    } catch (e) {
      next(e);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = (req.body?.token || req.query?.token)?.toString();
      const result = await authService.verifyEmail(token);
      return ok(res, result, "Email verified");
    } catch (e) {
      next(e);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      return ok(res, result);
    } catch (e) {
      next(e);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body.token, req.body.newPassword);
      return ok(res, result, "Password updated");
    } catch (e) {
      next(e);
    }
  },
};