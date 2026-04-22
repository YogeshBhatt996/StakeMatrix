import { z } from "zod";
import { StakeholderCategory, InfluenceLevel } from "@prisma/client";

export const stakeholderSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  jobTitle: z.string().min(1, "Job title is required").max(200),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone is required").max(50),
  organization: z.string().max(200).optional().default(""),
  category: z.nativeEnum(StakeholderCategory),
  availableOnTeams: z.boolean(),
  influenceLevel: z.nativeEnum(InfluenceLevel),
});

export const updateStakeholderSchema = stakeholderSchema.partial();

export type StakeholderInput = z.infer<typeof stakeholderSchema>;
export type UpdateStakeholderInput = z.infer<typeof updateStakeholderSchema>;
