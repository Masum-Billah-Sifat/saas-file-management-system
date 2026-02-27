import { prisma } from "../../db/prisma";

export const foldersRepo = {
  list: (userId: string) =>
    prisma.folder.findMany({
      where: { userId, isArchived: false },
      select: { id: true, name: true, parentId: true, depth: true, createdAt: true, updatedAt: true },
      orderBy: [{ depth: "asc" }, { createdAt: "asc" }],
    }),

  findById: (userId: string, id: string) =>
    prisma.folder.findFirst({ where: { id, userId, isArchived: false } }),

  create: (data: any) => prisma.folder.create({ data }),

  rename: (userId: string, id: string, name: string) =>
    prisma.folder.update({ where: { id }, data: { name } }),

  archiveMany: (ids: string[]) =>
    prisma.folder.updateMany({
      where: { id: { in: ids } },
      data: { isArchived: true, archivedAt: new Date() },
    }),

  getAllForUserFlat: (userId: string) =>
    prisma.folder.findMany({
      where: { userId, isArchived: false },
      select: { id: true, parentId: true },
    }),
};