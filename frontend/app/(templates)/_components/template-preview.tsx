"use client";

import { useEffect, useState } from "react";
import { TemplateRenderer } from "./template-renderer";
import type { ResumeData, TemplateSchema } from "@shared/template-schema";

interface TemplatePreviewProps {
  schema: TemplateSchema;
  data: ResumeData;
}

export function TemplatePreview({ data, schema }: TemplatePreviewProps) {
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
      <TemplateRenderer schema={schema} data={data} clickable={false} />
    </div>
  );
}
