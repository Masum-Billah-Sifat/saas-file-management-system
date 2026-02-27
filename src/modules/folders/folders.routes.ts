import { Router } from "express";
import { foldersController } from "./folders.controller";
import { authRequired } from "../../middlewares/authRequired";
import { validateBody } from "../../middlewares/validate";
import { createFolderSchema, renameFolderSchema } from "./folders.schemas";

export const foldersRouter = Router();

foldersRouter.get("/folders", authRequired, foldersController.list);
foldersRouter.post("/folders", authRequired, validateBody(createFolderSchema), foldersController.create);
foldersRouter.put("/folders/:id", authRequired, validateBody(renameFolderSchema), foldersController.rename);
foldersRouter.delete("/folders/:id", authRequired, foldersController.remove);