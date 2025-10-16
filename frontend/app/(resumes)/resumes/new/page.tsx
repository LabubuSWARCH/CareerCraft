"use client";

import { useSearchParams } from "next/navigation";
import { TemplatePreview } from "./_components/template-preview";
import { ResumeForm } from "./_components/resume-form";

export default function NewResumePage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Create resume</h1>
        <p className="text-lg text-muted-foreground">
          Choose a template to start creating your resume.
        </p>
      </div>
      <ResumeForm />
      {templateId ? (
        <TemplatePreview templateId={templateId} />
      ) : (
        <div>Please select a template to create a resume.</div>
      )}
    </main>
  );
}
