import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../db/prisma";
import { HttpError } from "../utils/httpError";

export async function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing Authorization Bearer token");
    }
    const token = header.slice("Bearer ".length);

    const payload = verifyAccessToken(token);
    const userId = payload.sub;
    const sessionId = payload.sid;

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) {
      throw new HttpError(401, "Invalid session");
    }
    if (session.revokedAt) {
      throw new HttpError(401, "Session revoked");
    }

    req.auth = { userId, sessionId, role: payload.role };
    next();
  } catch (err) {
    next(err);
  }
}