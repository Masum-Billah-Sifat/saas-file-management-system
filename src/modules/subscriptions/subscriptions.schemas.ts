import { z } from "zod";

export const activateSchema = z.object({
  packageId: z.string().min(5),
});