import { prisma } from "../../db/prisma";

export const filesRepo = {
  listInFolder: (userId: string, folderId: string) =>
    prisma.file.findMany({
      where: { userId, folderId, isArchived: false },
      orderBy: { createdAt: "desc" },
    }),

  findById: (userId: string, id: string) =>
    prisma.file.findFirst({ where: { id, userId, isArchived: false } }),

  create: (data: any) => prisma.file.create({ data }),

  rename: (userId: string, id: string, name: string) =>
    prisma.file.update({ where: { id }, data: { name } }),

  archive: (userId: string, id: string) =>
    prisma.file.update({ where: { id }, data: { isArchived: true, archivedAt: new Date() } }),
};