import express from "express";
import cors from "cors";
import { healthRouter } from "./modules/health/health.routes";
import { storageRouter } from "./modules/storage/storage.routes";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(healthRouter);
  app.use(storageRouter);

  app.use(errorHandler);
  return app;
}