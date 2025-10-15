"use client";

import { useTemplates } from "@/hooks/use-templates";
import { TemplateCard } from "app/(templates)/_components/template-card";
import { Spinner } from "@/components/ui/spinner";

export function TemplatesList() {
  const { data: templates, isLoading, error } = useTemplates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">
          Failed to load templates. Please try again later.
        </p>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No templates available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.templateId} template={template} />
      ))}
    </div>
  );
}
