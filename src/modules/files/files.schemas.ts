import { z } from "zod";

export const renameFileSchema = z.object({
  name: z.string().min(1),
});