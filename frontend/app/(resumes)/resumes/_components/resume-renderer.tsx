"use client";

import { useQuery } from "@tanstack/react-query";
import { getTemplate } from "@/lib/api/templates";
import { TemplateRenderer } from "@/components/template-renderer";
import { ResumeData } from "@shared/template-schema";

interface ResumeRendererProps {
  templateId: string;
  data: ResumeData;
  clickable?: boolean;
}

export function ResumeRenderer({
  templateId,
  data,
  clickable = false,
}: ResumeRendererProps) {
  const { data: template, isLoading } = useQuery({
    queryKey: ["template", templateId],
    queryFn: () => getTemplate(templateId),
  });

  if (isLoading || !template) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <TemplateRenderer
      schema={template.schemaJson}
      data={data}
      clickable={clickable}
    />
  );
}
