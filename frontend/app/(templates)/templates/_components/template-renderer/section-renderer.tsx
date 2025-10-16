import { ResumeData, TemplateSection } from "@shared/template-schema";
import { ContactSection } from "./contact-section";
import { SummarySection } from "./summary-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { ProjectsSection } from "./projects-section";
import { SkillsSection } from "./skills-section";

interface SectionRendererProps {
  section: TemplateSection;
  data: ResumeData;
  clickable: boolean;
}

export function SectionRenderer({
  section,
  data,
  clickable,
}: SectionRendererProps) {
  switch (section.type) {
    case "contact":
      return <ContactSection section={section} data={data} />;
    case "summary":
      return <SummarySection section={section} data={data} />;
    case "experience":
      return <ExperienceSection section={section} data={data} />;
    case "education":
      return <EducationSection section={section} data={data} />;
    case "projects":
      return (
        <ProjectsSection section={section} data={data} clickable={clickable} />
      );
    case "skills":
      return <SkillsSection section={section} data={data} />;
    default:
      return null;
  }
}
