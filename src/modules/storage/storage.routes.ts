import { Router } from "express";
import multer from "multer";
import { dbPing, testUpload } from "./storage.controller";

export const storageRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

storageRouter.get("/db/ping", dbPing);
storageRouter.post("/storage/test-upload", upload.single("file"), testUpload);