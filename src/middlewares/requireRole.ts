import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

export function requireRole(role: "ADMIN" | "USER") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return next(new HttpError(401, "Unauthorized"));
    if (req.auth.role !== role) return next(new HttpError(403, "Forbidden"));
    return next();
  };
}