import { Request, Response, NextFunction } from "express";
import { ok, created } from "../../utils/response";
import { filesService } from "./files.service";
import { paramId } from "../../utils/params";


export const filesController = {
  async listInFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
      const folderId = paramId(req.params.id);

      return ok(res, await filesService.list(userId, folderId));
    } catch (e) { next(e); }
  },

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
      const folderId = req.body.folderId;
      const file = (req as any).file as Express.Multer.File | undefined;
      if (!file) return ok(res, null, "No file uploaded");

      const result = await filesService.upload(userId, folderId, file);
      return created(res, result, "File uploaded");
    } catch (e) { next(e); }
  },

  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
            const folderId = paramId(req.params.id);

      const { url } = await filesService.download(userId, folderId);
      return res.redirect(url);
    } catch (e) { next(e); }
  },

  async rename(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
            const folderId = paramId(req.params.id);

      return ok(res, await filesService.rename(userId, folderId, req.body.name), "File renamed");
    } catch (e) { next(e); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth!.userId;
            const folderId = paramId(req.params.id);

      return ok(res, await filesService.archive(userId, folderId), "File archived");
    } catch (e) { next(e); }
  },
};