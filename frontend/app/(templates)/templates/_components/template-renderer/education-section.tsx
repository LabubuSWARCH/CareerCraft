import { ResumeData, TemplateSection } from "@shared/template-schema";

interface EducationSectionProps {
  section: TemplateSection & { type: "education" };
  data: ResumeData;
}

export function EducationSection({ section, data }: EducationSectionProps) {
  if (!data.education?.length) return null;

  return (
    <section style={section.containerStyle}>
      <h2 style={section.titleStyle}>{section.title}</h2>
      <div style={section.containerStyle}>
        {data.education.map((edu) => (
          <div key={edu.id}>
            <div style={section.headerStyle}>
              <div style={section.schoolStyle}>{edu.school}</div>
              <div style={section.dateStyle}>
                {edu.start} - {edu.end}
              </div>
            </div>
            <div style={section.detailsStyle}>{edu.degree}</div>
            {edu.details && (
              <div style={section.detailsStyle}>{edu.details}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
