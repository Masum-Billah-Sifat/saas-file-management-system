import { z } from "zod";

export const packageCreateSchema = z.object({
  name: z.string().min(2),
  maxFolders: z.number().int().min(0),
  maxNestingLevel: z.number().int().min(1),
  allowedTypes: z.array(z.enum(["IMAGE", "VIDEO", "PDF", "AUDIO"])).min(1),
  maxFileSizeMB: z.number().int().min(1),
  totalFileLimit: z.number().int().min(0),
  filesPerFolder: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

export const packageUpdateSchema = packageCreateSchema.partial();