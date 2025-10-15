"use client";

import React from "react";
import { TemplateRendererProps } from "./types";
import { SectionRenderer } from "./section-renderer";

export function TemplateRenderer({
  schema,
  data,
  clickable,
}: TemplateRendererProps) {
  const sectionById = React.useMemo(() => {
    const map = new Map();
    for (const section of schema.sections) {
      map.set(section.id, section);
    }
    return map;
  }, [schema.sections]);

  const paddingStyle = schema.layout.defaultPaddingStyle;

  return (
    <div style={schema.layout.frameStyle}>
      <div style={schema.layout.cardStyle}>
        <div style={{ ...schema.layout.rootStyle, ...paddingStyle }}>
          <header style={schema.layout.header.containerStyle}>
            <h1 style={schema.layout.header.nameStyle}>{data.name}</h1>
            {data.title && (
              <p style={schema.layout.header.titleStyle}>{data.title}</p>
            )}
          </header>

          <main style={schema.layout.body.containerStyle}>
            {schema.layout.body.columns.map((column) => (
              <div key={column.id} style={column.containerStyle}>
                {column.sections.map((sectionId) => {
                  const section = sectionById.get(sectionId);
                  if (!section) return null;
                  return (
                    <React.Fragment key={section.id}>
                      <SectionRenderer
                        section={section}
                        data={data}
                        clickable={clickable}
                      />
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
