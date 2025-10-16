import { ResumeData, TemplateSchema } from "@shared/template-schema";

export interface TemplateRendererProps {
  schema: TemplateSchema;
  data: ResumeData;
  clickable: boolean;
}
