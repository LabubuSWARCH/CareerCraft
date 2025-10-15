import { ResumeData, TemplateSection } from "@shared/template-schema";

interface SkillsSectionProps {
  section: TemplateSection & { type: "skills" };
  data: ResumeData;
}

export function SkillsSection({ section, data }: SkillsSectionProps) {
  if (!data.skills?.length) return null;

  return (
    <section style={section.containerStyle}>
      <h2 style={section.titleStyle}>{section.title}</h2>
      <div style={section.contentStyle}>
        {data.skills.map((skill, idx) => (
          <span key={idx} style={section.pillStyle}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
