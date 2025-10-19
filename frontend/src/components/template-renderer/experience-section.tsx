import { ResumeData, TemplateSection } from "@shared/template-schema";

interface ExperienceSectionProps {
  section: TemplateSection & { type: "experience" };
  data: ResumeData;
}

export function ExperienceSection({ section, data }: ExperienceSectionProps) {
  if (!data.experience?.length) return null;

  return (
    <section style={section.containerStyle}>
      <h2 style={section.titleStyle}>{section.title}</h2>
      <div style={section.containerStyle}>
        {data.experience.map((exp) => (
          <div key={exp.id} style={section.itemStyle}>
            <div style={section.headerStyle}>
              <div>
                <div style={section.roleStyle}>{exp.role}</div>
                <div style={section.companyStyle}>{exp.company}</div>
              </div>
              <div style={section.dateStyle}>
                {exp.start} - {exp.end}
              </div>
            </div>
            {exp.bullets && exp.bullets.length > 0 && (
              <ul style={section.listStyle}>
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
