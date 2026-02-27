import express from "express";
import cors from "cors";
import { healthRouter } from "./modules/health/health.routes";
import { storageRouter } from "./modules/storage/storage.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { packagesRouter } from "./modules/packages/packages.routes";
import { subscriptionsRouter } from "./modules/subscriptions/subscriptions.routes";
import { foldersRouter } from "./modules/folders/folders.routes";
import { filesRouter } from "./modules/files/files.routes";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(healthRouter);
  app.use(storageRouter);
  app.use(authRouter);

  app.use(packagesRouter);
  app.use(subscriptionsRouter);
  app.use(foldersRouter);
  app.use(filesRouter);

  app.use(errorHandler);
  return app;
}
