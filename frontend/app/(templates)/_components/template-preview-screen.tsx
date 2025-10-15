"use client";

import { useEffect, useState } from "react";
import { TemplateRenderer } from "./template-renderer";
import type { TemplateDefinition, ResumeData } from "@shared/template-schema";

interface TemplatePreviewProps {
  template: TemplateDefinition;
  data: ResumeData;
  compact?: boolean;
}

export function TemplatePreview({
  template,
  data,
  compact = false,
}: TemplatePreviewProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      console.log("Window width:", width);
      if (width < 640) {
        setScale(0.5);
      } else if (width < 768) {
        setScale(0.65);
      } else if (width < 1024) {
        setScale(0.8);
      } else if (width < 1280) {
        setScale(0.9);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="w-full"
      style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
    >
      <TemplateRenderer
        schema={template.schemaJson}
        data={data}
        compact={compact}
      />
    </div>
  );
}
