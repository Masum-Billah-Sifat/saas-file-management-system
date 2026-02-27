import { Router } from "express";
import { subscriptionsController } from "./subscriptions.controller";
import { authRequired } from "../../middlewares/authRequired";
import { validateBody } from "../../middlewares/validate";
import { activateSchema } from "./subscriptions.schemas";

export const subscriptionsRouter = Router();

subscriptionsRouter.post("/subscriptions/activate", authRequired, validateBody(activateSchema), subscriptionsController.activate);
subscriptionsRouter.get("/subscriptions/history", authRequired, subscriptionsController.history);