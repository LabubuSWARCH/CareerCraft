"use client";

import React from "react";
import { TemplateForm } from "../../_components/template-form";
import { useUser } from "@/providers/user-provider";
import { useTemplate } from "@/hooks/use-templates";
import { redirect, notFound } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface EditTemplatePageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const unwrappedParams = React.use(params);
  const { templateId } = unwrappedParams;
  const { profile } = useUser();
  const {
    data: template,
    isLoading: templateLoading,
    error,
  } = useTemplate(templateId);

  if (profile.isLoading || templateLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (profile.data?.role !== "admin") {
    redirect(`/templates/${templateId}`);
  }

  if (error || !template) {
    notFound();
  }

  return (
    <main className="container mx-auto px-8 py-12">
      <TemplateForm mode="edit" template={template} />
    </main>
  );
}
