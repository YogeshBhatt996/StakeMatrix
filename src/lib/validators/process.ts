import { z } from "zod";

export const processSchema = z.object({
  name: z.string().min(1, "Process name is required").max(200),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateProcessSchema = processSchema.partial();

export type ProcessInput = z.infer<typeof processSchema>;
