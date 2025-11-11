"use client";

import React, { useEffect, useRef, useState } from "react";
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

  const paddingStyle = schema.layout.paddingStyle;

  const containerRef = useRef<HTMLDivElement>(null);
  const [displayScale, setDisplayScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const a4Width = 793.7007874;

      if (containerWidth < a4Width) {
        const scale = containerWidth / a4Width;
        setDisplayScale(scale);
      } else {
        setDisplayScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          ...schema.layout.rootStyle,
          ...paddingStyle,
          transform: `scale(${displayScale})`,
          transformOrigin: "top left",
          width: "793.7007874px",
          height: `${(793.7007874 * 297) / 210}px`,
        }}
        data-resume-preview
      >
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
  );
}
