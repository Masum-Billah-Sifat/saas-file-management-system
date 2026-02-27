import { prisma } from "../../db/prisma";
import { HttpError } from "../../utils/httpError";
import { FileKind } from "@prisma/client";

export async function getActivePackage(userId: string) {
  const sub = await prisma.userSubscription.findFirst({
    where: { userId, endAt: null },
    include: { pkg: true },
  });
  if (!sub) throw new HttpError(400, "No active subscription");
  return sub.pkg;
}

export async function assertCanCreateFolder(userId: string, newDepth: number) {
  const pkg = await getActivePackage(userId);

  const folderCount = await prisma.folder.count({
    where: { userId, isArchived: false },
  });
  if (folderCount >= pkg.maxFolders) throw new HttpError(403, "Max folders limit reached");

  if (newDepth > pkg.maxNestingLevel) throw new HttpError(403, "Max nesting level exceeded");

  return pkg;
}

export async function assertCanUploadFile(userId: string, folderId: string, kind: FileKind, sizeBytes: number) {
  const pkg = await getActivePackage(userId);

  if (!pkg.allowedTypes.includes(kind)) throw new HttpError(403, "File type not allowed");
  if (sizeBytes > pkg.maxFileSizeMB * 1024 * 1024) throw new HttpError(403, "File too large");

  const totalFiles = await prisma.file.count({ where: { userId, isArchived: false } });
  if (totalFiles >= pkg.totalFileLimit) throw new HttpError(403, "Total file limit reached");

  const folderFiles = await prisma.file.count({ where: { folderId, isArchived: false } });
  if (folderFiles >= pkg.filesPerFolder) throw new HttpError(403, "Files per folder limit reached");

  return pkg;
}