"use client";

import * as React from "react";
import {
  ResumeData,
  TemplateSchema,
  TemplateSection,
  ContactSection,
  SkillsSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  formatDateRange,
} from "@shared/template-schema";
import Link from "next/link";

interface TemplateRendererProps {
  schema: TemplateSchema;
  data: ResumeData;
  compact?: boolean;
}

export function TemplateRenderer({
  schema,
  data,
  compact = false,
}: TemplateRendererProps) {
  const sectionById = React.useMemo(() => {
    const map = new Map<string, TemplateSection>();
    for (const section of schema.sections) {
      map.set(section.id, section);
    }
    return map;
  }, [schema.sections]);

  const paddingClass = compact
    ? schema.layout.compactPaddingClass
    : schema.layout.defaultPaddingClass;

  return (
    <div className={combine(schema.layout.frameClasses)}>
      <div className={schema.layout.cardClasses}>
        <div className={combine(schema.layout.rootClasses, paddingClass)}>
          <header className={schema.layout.header.containerClasses}>
            <h1 className={schema.layout.header.nameClasses}>{data.name}</h1>
            {data.title && (
              <p className={schema.layout.header.titleClasses}>{data.title}</p>
            )}
          </header>

          <main className={schema.layout.body.containerClasses}>
            {schema.layout.body.columns.map((column) => (
              <div key={column.id} className={column.containerClasses}>
                {column.sections.map((sectionId) => {
                  const section = sectionById.get(sectionId);
                  if (!section) return null;
                  return (
                    <React.Fragment key={section.id}>
                      {renderSection(section, data)}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

function renderSection(section: TemplateSection, data: ResumeData) {
  switch (section.type) {
    case "contact":
      return renderContactSection(section, data);
    case "skills":
      return renderSkillsSection(section, data);
    case "summary":
      return renderSummarySection(section, data);
    case "experience":
      return renderExperienceSection(section, data);
    case "education":
      return renderEducationSection(section, data);
    case "projects":
      return renderProjectsSection(section, data);
    default:
      return null;
  }
}

function renderContactSection(section: ContactSection, data: ResumeData) {
  const values = section.fields
    .map((field) => ({ field, value: data[field] }))
    .filter((entry) => Boolean(entry.value));

  if (values.length === 0) return null;

  return (
    <section className={section.containerClasses}>
      <h3 className={section.titleClasses}>{section.title}</h3>
      <div className={section.contentClasses}>
        {values.map(({ field, value }) => (
          <div key={field} className={section.itemClasses}>
            {field === "website" && typeof value === "string" ? (
              <Link
                href={value}
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                {value}
              </Link>
            ) : (
              (value as React.ReactNode)
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderSkillsSection(section: SkillsSection, data: ResumeData) {
  if (!data.skills.length) return null;
  return (
    <section className={section.containerClasses}>
      <h3 className={section.titleClasses}>{section.title}</h3>
      <div className={section.contentClasses}>
        {data.skills.map((skill, index) => (
          <span key={`${skill}-${index}`} className={section.pillClasses}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function renderSummarySection(section: SummarySection, data: ResumeData) {
  if (!data.summary) return null;
  return (
    <section className={section.containerClasses}>
      <h3 className={section.titleClasses}>{section.title}</h3>
      <p className={section.contentClasses}>{data.summary}</p>
    </section>
  );
}

function renderExperienceSection(section: ExperienceSection, data: ResumeData) {
  if (!data.experience.length) return null;

  return (
    <section className={section.containerClasses}>
      <h3 className={section.titleClasses}>{section.title}</h3>
      <div className={section.itemClasses}>
        {data.experience.map((item) => (
          <div key={item.id}>
            <div className={section.headerClasses}>
              <div>
                <span className={section.roleClasses}>{item.role}</span>
                {" • "}
                <span className={section.companyClasses}>{item.company}</span>
              </div>
              <span className={section.dateClasses}>
                {formatDateRange(item.start, item.end)}
              </span>
            </div>
            {!!item.bullets.length && (
              <ul className={section.listClasses}>
                {item.bullets.map((bullet, idx) => (
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

function renderEducationSection(section: EducationSection, data: ResumeData) {
  if (!data.education.length) return null;

  return (
    <section className={section.containerClasses}>
      <h3 className={section.titleClasses}>{section.title}</h3>
      <div>
        {data.education.map((entry) => (
          <div key={entry.id}>
            <div className={section.headerClasses}>
              <span className={section.schoolClasses}>
                {entry.degree} • {entry.school}
              </span>
              <span className={section.dateClasses}>
                {formatDateRange(entry.start, entry.end)}
              </span>
            </div>
            {entry.details && (
              <div className={section.detailsClasses}>{entry.details}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderProjectsSection(section: ProjectsSection, data: ResumeData) {
  if (section.toggleField && !data[section.toggleField]) return null;
  if (!data.projects.length) return null;

  return (
    <section className={section.containerClasses}>
      <h3 className={section.titleClasses}>{section.title}</h3>
      <div>
        {data.projects.map((project) => (
          <div key={project.id}>
            <div className={section.nameClasses}>
              {project.link ? (
                <Link
                  href={project.link}
                  className={section.linkClasses}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </Link>
              ) : (
                project.name
              )}
            </div>
            <div className={section.descriptionClasses}>
              {project.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function combine(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}
