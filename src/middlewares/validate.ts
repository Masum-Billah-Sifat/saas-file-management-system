import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

export function validateBody(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new HttpError(400, "Validation error", result.error.flatten()));
    }
    req.body = result.data;
    next();
  };
}