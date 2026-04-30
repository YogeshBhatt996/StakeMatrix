import { z } from "zod";
import { Shift, MeetingFrequency } from "@prisma/client";

const projectBaseSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  signedFTECount: z
    .number()
    .min(0, "Must be 0 or greater")
    .refine((v) => Math.round(v * 100) === v * 100, "Maximum 2 decimal places"),
  deployedFTECount: z
    .number()
    .min(0, "Must be 0 or greater")
    .refine((v) => Math.round(v * 100) === v * 100, "Maximum 2 decimal places"),
  initiationDate: z.string().datetime({ message: "Valid ISO date required" }),
  isNXProject: z.boolean(),
  isALISProject: z.boolean(),
  isOtherProject: z.boolean(),
  orgNumber: z.string().max(50).optional().nullable(),
  shifts: z.array(z.nativeEnum(Shift)).min(1, "Select at least one shift"),
  meetingFrequency: z.nativeEnum(MeetingFrequency),
  additionalInfo: z.string().max(250, "Maximum 250 characters").optional().nullable().default(""),
});

export const createProjectSchema = projectBaseSchema.refine(
  (data) => {
    if (data.isNXProject && (!data.orgNumber || data.orgNumber.trim() === "")) {
      return false;
    }
    return true;
  },
  { message: "Org Number is required for NX Projects", path: ["orgNumber"] }
);

export const updateProjectSchema = projectBaseSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
