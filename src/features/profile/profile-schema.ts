import { z } from "zod";

export const personalInfoSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters."),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, "Last name must be at least 2 characters."),
    birth_date: z.string().optional(),
    profile_description: z.string().optional(),
    location: z.string().optional(),
    profile_picture: z.string().optional(),
});

export const degreeDetailsSchema = z.object({
    degree_id: z.number().min(1, "Select a valid degree."),
    year_batch: z.number().min(1900, "Enter a valid year.").max(new Date().getFullYear(), "Year cannot be in the future."),
    year_graduation: z.number().min(1900, "Enter a valid year.").max(new Date().getFullYear(), "Year cannot be in the future."),
});

export const employmentHistorySchema = z.object({
    company_name: z.string().min(2, "Company name must be at least 2 characters."),
    position: z.string().min(2, "Position must be at least 2 characters."),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type DegreeDetailsValues = z.infer<typeof degreeDetailsSchema>;
export type EmploymentHistoryValues = z.infer<typeof employmentHistorySchema>;