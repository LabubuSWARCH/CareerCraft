import { ResumeData, TemplateSection } from "@shared/template-schema";
import Link from "next/link";

interface ProjectsSectionProps {
  section: TemplateSection & { type: "projects" };
  data: ResumeData;
  clickable: boolean;
}

export function ProjectsSection({
  section,
  data,
  clickable,
}: ProjectsSectionProps) {
  if (section.toggleField && !data[section.toggleField]) return null;
  if (!data.projects?.length) return null;

  const Comp = clickable ? Link : "p";

  return (
    <section style={section.containerStyle}>
      <h2 style={section.titleStyle}>{section.title}</h2>
      <div style={section.containerStyle}>
        {data.projects.map((project) => (
          <div key={project.id}>
            <div style={section.nameStyle}>
              {project.link ? (
                <Comp
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={section.linkStyle}
                >
                  {project.name}
                </Comp>
              ) : (
                project.name
              )}
            </div>
            {project.description && (
              <div style={section.descriptionStyle}>{project.description}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
