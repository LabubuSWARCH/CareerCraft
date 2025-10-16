import { z } from "zod";

export const ContactFieldEnum = z.enum([
  "email",
  "phone",
  "location",
  "website",
]);
export type ContactFieldEnum = z.infer<typeof ContactFieldEnum>;

export type ContactField = z.infer<typeof ContactFieldEnum>;

export const ResumeExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});
export type ResumeExperience = z.infer<typeof ResumeExperienceSchema>;

export const ResumeEducationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().optional(),
  details: z.string().optional(),
});
export type ResumeEducation = z.infer<typeof ResumeEducationSchema>;

export const ResumeProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  link: z.url("Invalid URL").optional(),
});
export type ResumeProject = z.infer<typeof ResumeProjectSchema>;

export const ResumeDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  website: z.url("Invalid URL").optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.array(ResumeExperienceSchema).optional(),
  education: z.array(ResumeEducationSchema).optional(),
  projects: z.array(ResumeProjectSchema).optional(),
  showProjects: z.boolean().optional(),
});
export type ResumeData = z.infer<typeof ResumeDataSchema>;
