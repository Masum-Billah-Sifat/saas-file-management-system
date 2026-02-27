import { Request, Response } from "express";

export function health(req: Request, res: Response) {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
}