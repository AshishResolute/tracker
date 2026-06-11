import { z } from "zod";

// i need title,company,source,date,status,interview_stage

const Status = [
  "Applied",
  "Interview",
  "Rejected",
  "Ghosted",
  "Offer",
  "Recruiter_screen",
] as const;

export const applicationSchema = z.object({
  title: z.string().trim().min(8).max(50),
  company: z.string().trim().min(3).max(100),
  source: z.string().url(),
  date: z.coerce.date(),
  status: z.enum(Status),
  interview_stage: z.string().trim().min(3).max(28).optional(),
});

export type JobApplication = z.infer<typeof applicationSchema>;

export const updateApplicationSchema = z.object({
  title: z
    .string("Invalid title,enter a string")
    .trim()
    .min(3, "title must be atleast 3 characters long")
    .max(50, "title cannot be more than 50 characters")
    .optional(),
  company: z
    .string("Invalid Input,company name must be a string")
    .trim()
    .min(3, "company name must be atleast 3 characters long")
    .max(100, "company name cannot be more than 100 characters")
    .optional(),
  source: z
    .string("Invalid Input,Url must be a string")
    .trim()
    .url("Invalid URL")
    .optional(),
  date: z.coerce.date("Invalid date Provided").optional(),
  status: z.enum(Status).optional(),
  interview_stage: z
    .string("Invalid input must be string")
    .trim()
    .min(3)
    .max(28)
    .optional(),
}).refine((data)=>Object.keys(data).length>0,{
    message:`Query Must contain atleast 1 field to be updated`
})


export const applicationIdSchema = z.object({
    id:z.string()
})
export type IdParam = z.infer<typeof applicationIdSchema>
export type UpdateApplication = z.infer<typeof updateApplicationSchema>