import { Request, Response, NextFunction } from "express";
import { created, ok } from "../../utils/response";
import { packagesService } from "./packages.service";
import { paramId } from "../../utils/params";


export const packagesController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const pkg = await packagesService.create(req.body);
      return created(res, pkg, "Package created");
    } catch (e) {
      next(e);
    }
  },

  async listAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await packagesService.listAdmin();
      return ok(res, list);
    } catch (e) {
      next(e);
    }
  },

  async listActive(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await packagesService.listActive();
      return ok(res, list);
    } catch (e) {
      next(e);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const folderId = paramId(req.params.id);

      const pkg = await packagesService.update(folderId, req.body);
      return ok(res, pkg, "Package updated");
    } catch (e) {
      next(e);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const folderId = paramId(req.params.id);

      const pkg = await packagesService.delete(folderId);
      return ok(res, pkg, "Package deactivated");
    } catch (e) {
      next(e);
    }
  },
};
