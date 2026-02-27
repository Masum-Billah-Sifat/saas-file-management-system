import { Router } from "express";
import { packagesController } from "./packages.controller";
import { validateBody } from "../../middlewares/validate";
import { packageCreateSchema, packageUpdateSchema } from "./packages.schemas";
import { authRequired } from "../../middlewares/authRequired";
import { requireRole } from "../../middlewares/requireRole";

export const packagesRouter = Router();

// Public homepage: active only
packagesRouter.get("/public/packages", packagesController.listActive);

// Logged-in user: active only
packagesRouter.get("/packages", authRequired, packagesController.listActive);

// Admin: CRUD
packagesRouter.post("/admin/packages", authRequired, requireRole("ADMIN"), validateBody(packageCreateSchema), packagesController.create);
packagesRouter.get("/admin/packages", authRequired, requireRole("ADMIN"), packagesController.listAdmin);
packagesRouter.put("/admin/packages/:id", authRequired, requireRole("ADMIN"), validateBody(packageUpdateSchema), packagesController.update);
packagesRouter.delete("/admin/packages/:id", authRequired, requireRole("ADMIN"), packagesController.remove);