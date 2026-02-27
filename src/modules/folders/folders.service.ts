import { HttpError } from "../../utils/httpError";
import { foldersRepo } from "./folders.repo";
import { prisma } from "../../db/prisma";
import { assertCanCreateFolder } from "../enforcement/policy.service";

export const foldersService = {
  async list(userId: string) {
    return foldersRepo.list(userId);
  },

  async create(userId: string, input: { name: string; parentId?: string }) {
    let depth = 1;
    let parentId: string | null = null;

    if (input.parentId) {
      const parent = await foldersRepo.findById(userId, input.parentId);
      if (!parent) throw new HttpError(404, "Parent folder not found");
      depth = parent.depth + 1;
      parentId = parent.id;
    }

    await assertCanCreateFolder(userId, depth);

    return foldersRepo.create({
      userId,
      name: input.name,
      parentId,
      depth,
    });
  },

  async rename(userId: string, folderId: string, name: string) {
    const folder = await foldersRepo.findById(userId, folderId);
    if (!folder) throw new HttpError(404, "Folder not found");
    return foldersRepo.rename(userId, folderId, name);
  },

  async archiveSubtree(userId: string, folderId: string) {
    const root = await foldersRepo.findById(userId, folderId);
    if (!root) throw new HttpError(404, "Folder not found");

    const all = await foldersRepo.getAllForUserFlat(userId);

    // build adjacency list
    const childrenMap = new Map<string, string[]>();
    for (const f of all) {
      if (!f.parentId) continue;
      const arr = childrenMap.get(f.parentId) || [];
      arr.push(f.id);
      childrenMap.set(f.parentId, arr);
    }

    // BFS descendants
    const stack = [root.id];
    const ids: string[] = [];
    while (stack.length) {
      const cur = stack.pop()!;
      ids.push(cur);
      const kids = childrenMap.get(cur) || [];
      for (const k of kids) stack.push(k);
    }

    // archive folders + files in those folders
    await prisma.$transaction(async (tx) => {
      await tx.file.updateMany({
        where: { folderId: { in: ids }, isArchived: false },
        data: { isArchived: true, archivedAt: new Date() },
      });
      await tx.folder.updateMany({
        where: { id: { in: ids }, isArchived: false },
        data: { isArchived: true, archivedAt: new Date() },
      });
    });

    return { archivedFolderIds: ids.length };
  },
};