
import {z} from 'zod';

// i need title,company,source,date,status,interview_stage

const Status = ['Applied', 'Interview', 'Rejected', 'Ghosted', 'Offer', 'Recruiter_screen'] as const


export const applicationSchema = z.object({
    title:z.string().trim().min(8).max(50),
    company:z.string().trim().min(3).max(100),
    source:z.string().url(),
    date:z.coerce.date(),
    status:z.enum(Status),
    interview_stage:z.string().trim().min(3).max(28).optional()
})


export type JobApplication = z.infer<typeof applicationSchema>