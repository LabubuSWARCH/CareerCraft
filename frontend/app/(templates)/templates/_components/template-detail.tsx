"use client";

import { useTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { MOCK_RESUME } from "@/data/mock-resume";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { notFound } from "next/navigation";
import { TemplateRenderer } from "./template-renderer";

interface TemplateDetailProps {
  templateId: string;
  clickable: boolean;
}

export function TemplateDetail({ templateId, clickable }: TemplateDetailProps) {
  const { data: template, isLoading, error } = useTemplate(templateId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !template) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between md:flex-row flex-col gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/templates">
              <ArrowLeft className="size-full" />
            </Link>
          </Button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg md:text-xl font-bold">{template.name}</h1>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="w-full md:w-auto">
          <Link href="/resumes">
            <FileText className="size-4 mr-2" />
            Use This Template
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {template.tags?.map((tag) => (
          <Badge key={tag} className="capitalize" variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[210mm] aspect-[210/297] overflow-hidden">
          <TemplateRenderer
            schema={template.schemaJson}
            data={MOCK_RESUME}
            clickable={clickable}
          />
        </div>
      </div>
    </>
  );
}
