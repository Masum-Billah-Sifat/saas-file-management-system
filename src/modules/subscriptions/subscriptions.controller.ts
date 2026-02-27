import { Request, Response, NextFunction } from "express";
import { ok } from "../../utils/response";
import { subscriptionsService } from "./subscriptions.service";

export const subscriptionsController = {
  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
      const result = await subscriptionsService.activate(userId, req.body.packageId);
      return ok(res, result, "Subscription updated");
    } catch (e) { next(e); }
  },

  async history(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
      const result = await subscriptionsService.history(userId);
      return ok(res, result);
    } catch (e) { next(e); }
  },
};