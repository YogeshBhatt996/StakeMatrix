import { z } from "zod";
import { Shift, MeetingFrequency } from "@prisma/client";

export const createProjectSchema = z
  .object({
    name: z.string().min(1, "Project name is required").max(200),
    signedFTECount: z.number().int().min(0, "Must be 0 or greater"),
    deployedFTECount: z.number().int().min(0, "Must be 0 or greater"),
    initiationDate: z.string().datetime({ message: "Valid ISO date required" }),
    isNXProject: z.boolean(),
    orgNumber: z.string().max(50).optional().nullable(),
    shift: z.nativeEnum(Shift),
    meetingFrequency: z.nativeEnum(MeetingFrequency),
  })
  .refine(
    (data) => {
      if (data.isNXProject && (!data.orgNumber || data.orgNumber.trim() === "")) {
        return false;
      }
      return true;
    },
    { message: "Org Number is required for NX Projects", path: ["orgNumber"] }
  );

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
