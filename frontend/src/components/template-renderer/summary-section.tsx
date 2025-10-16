import { ResumeData, TemplateSection } from "@shared/template-schema";

interface SummarySectionProps {
  section: TemplateSection & { type: "summary" };
  data: ResumeData;
}

export function SummarySection({ section, data }: SummarySectionProps) {
  if (!data.summary) return null;

  return (
    <section style={section.containerStyle}>
      <h2 style={section.titleStyle}>{section.title}</h2>
      <p style={section.contentStyle}>{data.summary}</p>
    </section>
  );
}
