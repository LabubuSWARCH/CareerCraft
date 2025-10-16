export type ContactField = "email" | "phone" | "location" | "website";

type CSSProperties = Record<string, string>;
export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
  details?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary?: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  showProjects: boolean;
}

export interface TemplateLayout {
  rootStyle: CSSProperties;
  paddingStyle: CSSProperties;
  header: {
    containerStyle: CSSProperties;
    nameStyle: CSSProperties;
    titleStyle: CSSProperties;
  };
  body: {
    containerStyle: CSSProperties;
    columns: TemplateColumn[];
  };
}

export interface TemplateColumn {
  id: string;
  span: number;
  containerStyle: CSSProperties;
  sections: string[];
}

export type TemplateSection =
  | ContactSection
  | SkillsSection
  | SummarySection
  | ExperienceSection
  | EducationSection
  | ProjectsSection;

interface SectionBase<Type extends string> {
  id: string;
  type: Type;
  title: string;
  containerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
}

export interface ContactSection extends SectionBase<"contact"> {
  fields: ContactField[];
  contentStyle: CSSProperties;
  itemStyle?: CSSProperties;
}

export interface SkillsSection extends SectionBase<"skills"> {
  contentStyle: CSSProperties;
  pillStyle: CSSProperties;
}

export interface SummarySection extends SectionBase<"summary"> {
  contentStyle: CSSProperties;
}

export interface ExperienceSection extends SectionBase<"experience"> {
  containerStyle: CSSProperties;
  itemStyle: CSSProperties;
  headerStyle: CSSProperties;
  roleStyle: CSSProperties;
  companyStyle: CSSProperties;
  dateStyle: CSSProperties;
  listStyle: CSSProperties;
}

export interface EducationSection extends SectionBase<"education"> {
  containerStyle: CSSProperties;
  headerStyle: CSSProperties;
  schoolStyle: CSSProperties;
  dateStyle: CSSProperties;
  detailsStyle?: CSSProperties;
}

export interface ProjectsSection extends SectionBase<"projects"> {
  containerStyle: CSSProperties;
  nameStyle: CSSProperties;
  linkStyle: CSSProperties;
  descriptionStyle: CSSProperties;
  toggleField?: keyof ResumeData;
}

export interface TemplateSchema {
  componentId: string;
  layout: TemplateLayout;
  sections: TemplateSection[];
}

export interface TemplateHints {
  [key: string]: unknown;
}

export interface TemplateDefinition {
  templateId: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  tags?: string[];
  previewUrl?: string;
  schemaJson: TemplateSchema;
  hintJson?: TemplateHints;
}

export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "";
  if (start && !end) return `${formatDate(start)} – Present`;
  if (!start && end) return end;
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
