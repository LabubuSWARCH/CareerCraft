import { z } from "zod";

export const ResumeExperienceFormSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});
export type ResumeExperienceForm = z.infer<typeof ResumeExperienceFormSchema>;

export const ResumeEducationFormSchema = z.object({
  id: z.string(),
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().optional(),
  details: z.string().optional(),
});
export type ResumeEducationForm = z.infer<typeof ResumeEducationFormSchema>;

export const ResumeProjectFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  link: z.url("Invalid URL").optional(),
});
export type ResumeProjectForm = z.infer<typeof ResumeProjectFormSchema>;

export const ResumeFormDataSchema = z.object({
  resumeTitle: z.string().min(1, "Resume title is required"),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(ResumeExperienceFormSchema),
  education: z.array(ResumeEducationFormSchema),
  projects: z.array(ResumeProjectFormSchema),
  showProjects: z.boolean(),
});
export type ResumeFormData = z.infer<typeof ResumeFormDataSchema>;
