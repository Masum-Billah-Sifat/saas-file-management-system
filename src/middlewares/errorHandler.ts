// import { Request, Response, NextFunction } from "express";
// import { HttpError } from "../utils/httpError";

// export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
//   if (err instanceof HttpError) {
//     return res.status(err.status).json({ success: false, message: err.message, details: err.details });
//   }
//   console.error("Unhandled error:", err);
//   return res.status(500).json({ success: false, message: "Internal Server Error" });
// }

import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Internal Server Error" });
}