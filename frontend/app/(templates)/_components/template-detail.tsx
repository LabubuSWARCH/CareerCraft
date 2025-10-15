"use client";

import { useTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { TemplatePreview } from "app/(templates)/_components/template-preview";
import { MOCK_RESUME } from "@/data/mock-resume";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { notFound } from "next/navigation";

interface TemplateDetailProps {
  templateId: string;
}

export function TemplateDetail({ templateId }: TemplateDetailProps) {
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
      <div className="flex items-center justify-between md:flex-row flex-col">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/templates">
              <ArrowLeft className="size-full" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{template.name}</h1>
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/resumes">
            <FileText className="size-full" />
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

      <TemplatePreview schema={template.schemaJson} data={MOCK_RESUME} />
    </>
  );
}
