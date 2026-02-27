import { Router } from "express";
import multer from "multer";
import { authRequired } from "../../middlewares/authRequired";
import { validateBody } from "../../middlewares/validate";
import { renameFileSchema } from "./files.schemas";
import { filesController } from "./files.controller";

export const filesRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

filesRouter.get("/folders/:id/files", authRequired, filesController.listInFolder);
filesRouter.post("/files/upload", authRequired, upload.single("file"), filesController.upload);

filesRouter.get("/files/:id/download", authRequired, filesController.download);
filesRouter.put("/files/:id", authRequired, validateBody(renameFileSchema), filesController.rename);
filesRouter.delete("/files/:id", authRequired, filesController.remove);