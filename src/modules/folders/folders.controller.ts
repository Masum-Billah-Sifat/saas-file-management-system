import { Request, Response, NextFunction } from "express";
import { ok, created } from "../../utils/response";
import { foldersService } from "./folders.service";
import { paramId } from "../../utils/params";

export const foldersController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
      return ok(res, await foldersService.list(userId));
    } catch (e) { next(e); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
      return created(res, await foldersService.create(userId, req.body), "Folder created");
    } catch (e) { next(e); }
  },

  async rename(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
const folderId = paramId(req.params.id);

      return ok(res, await foldersService.rename(userId, folderId, req.body.name), "Folder renamed");
    } catch (e) { next(e); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
const folderId = paramId(req.params.id);

      return ok(res, await foldersService.archiveSubtree(userId, folderId), "Folder archived");
    } catch (e) { next(e); }
  },
};