import { HttpError } from "../../utils/httpError";
import { prisma } from "../../db/prisma";
import { supabase } from "../storage/storage.supabase";
import { env } from "../../config/env";
import { detectFileKind } from "../../utils/fileKind";
import { assertCanUploadFile } from "../enforcement/policy.service";
import { filesRepo } from "./files.repo";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export const filesService = {
  async list(userId: string, folderId: string) {
    const folder = await prisma.folder.findFirst({ where: { id: folderId, userId, isArchived: false } });
    if (!folder) throw new HttpError(404, "Folder not found");
    return filesRepo.listInFolder(userId, folderId);
  },

  async upload(userId: string, folderId: string, file: Express.Multer.File) {
    const folder = await prisma.folder.findFirst({ where: { id: folderId, userId, isArchived: false } });
    if (!folder) throw new HttpError(404, "Folder not found");

    const kind = detectFileKind(file.mimetype, file.originalname);
    await assertCanUploadFile(userId, folderId, kind, file.size);

    const fileId = `f_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const path = `users/${userId}/folders/${folderId}/${fileId}_${safeName(file.originalname)}`;

    const { error } = await supabase.storage
      .from(env.SUPABASE_BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

    if (error) throw new HttpError(500, "Supabase upload failed", error.message);

    const { data } = supabase.storage.from(env.SUPABASE_BUCKET).getPublicUrl(path);

    return filesRepo.create({
      userId,
      folderId,
      name: file.originalname,
      kind,
      sizeBytes: file.size,
      storagePath: path,
      publicUrl: data.publicUrl,
      mimeType: file.mimetype,
    });
  },

  async download(userId: string, fileId: string) {
    const f = await filesRepo.findById(userId, fileId);
    if (!f) throw new HttpError(404, "File not found");
    if (!f.publicUrl) throw new HttpError(400, "File URL not available");
    return { url: f.publicUrl };
  },

  async rename(userId: string, fileId: string, name: string) {
    const f = await filesRepo.findById(userId, fileId);
    if (!f) throw new HttpError(404, "File not found");
    return filesRepo.rename(userId, fileId, name);
  },

  async archive(userId: string, fileId: string) {
    const f = await filesRepo.findById(userId, fileId);
    if (!f) throw new HttpError(404, "File not found");
    return filesRepo.archive(userId, fileId);
  },
};