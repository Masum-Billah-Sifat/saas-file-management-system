import { prisma } from "../../db/prisma";

export const filesRepo = {
  // listInFolder: (userId: string, folderId: string) =>
  //   prisma.file.findMany({
  //     where: { userId, folderId, isArchived: false },
  //     orderBy: { createdAt: "desc" },
  //   }),

  // findById: (userId: string, id: string) =>
  //   prisma.file.findFirst({ where: { id, userId, isArchived: false } }),

  listInFolder: (userId: string, folderId: string) =>
    prisma.file.findMany({
      where: { userId, folderId, isArchived: false },
      orderBy: { createdAt: "desc" },
      // IMPORTANT: ensure publicUrl is included
      select: {
        id: true,
        userId: true,
        folderId: true,
        name: true,
        kind: true,
        sizeBytes: true,
        publicUrl: true,
        mimeType: true,
        createdAt: true,
      },
    }),

  findById: (userId: string, id: string) =>
    prisma.file.findFirst({
      where: { id, userId, isArchived: false },
      // IMPORTANT: include publicUrl here too
      select: {
        id: true,
        userId: true,
        folderId: true,
        name: true,
        kind: true,
        sizeBytes: true,
        publicUrl: true,
        mimeType: true,
        storagePath: true,
        createdAt: true,
      },
    }),

  create: (data: any) => prisma.file.create({ data }),

  rename: (userId: string, id: string, name: string) =>
    prisma.file.update({ where: { id }, data: { name } }),

  archive: (userId: string, id: string) =>
    prisma.file.update({
      where: { id },
      data: { isArchived: true, archivedAt: new Date() },
    }),
};
