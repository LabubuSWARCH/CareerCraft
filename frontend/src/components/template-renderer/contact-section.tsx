import { ResumeData, TemplateSection } from "@shared/template-schema";

interface ContactSectionProps {
  section: TemplateSection & { type: "contact" };
  data: ResumeData;
}

export function ContactSection({ section, data }: ContactSectionProps) {
  const contactData: Record<string, string> = {
    email: data.email,
    phone: data.phone,
    location: data.location,
    website: data.website || "",
  };

  return (
    <section style={section.containerStyle}>
      {section.title && <h2 style={section.titleStyle}>{section.title}</h2>}
      <div style={section.contentStyle}>
        {section.fields.map((field) => {
          const value = contactData[field];
          if (!value) return null;
          return (
            <div key={field} style={section.itemStyle}>
              {value}
            </div>
          );
        })}
      </div>
    </section>
  );
}
