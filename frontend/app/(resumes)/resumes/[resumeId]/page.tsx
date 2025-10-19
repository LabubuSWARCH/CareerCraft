"use client";

import { Suspense } from "react";
import { TemplatePreview } from "../new/_components/template-preview";
import { ResumeForm } from "../new/_components/resume-form";
import { Label } from "@/components/ui/label";
import {
  EditResumeFormProvider,
  useEditResumeForm,
} from "./_providers/edit-resume-form-provider";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

const DESKTOP_BREAKPOINT = "(min-width: 1024px)";

function EditResumePageContent() {
  const params = useParams();
  const resumeId = params.resumeId as string;
  const [viewMode, setViewMode] = useState<"form" | "preview">("form");
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  const renderPreviewToggle = () => (
    <div className="mb-4 flex items-center gap-2">
      <Label className="font-semibold">
        {viewMode === "preview" ? (
          <Eye className="inline-block mr-1" />
        ) : (
          <EyeClosed className="inline-block mr-1" />
        )}
        Preview mode
      </Label>
      <Switch
        checked={viewMode === "preview"}
        onCheckedChange={(checked) => setViewMode(checked ? "preview" : "form")}
      />
    </div>
  );

  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Edit resume</h1>
      </div>

      <EditResumeFormProvider resumeId={resumeId}>
        <EditResumeContent
          isDesktop={isDesktop}
          viewMode={viewMode}
          renderPreviewToggle={renderPreviewToggle}
        />
      </EditResumeFormProvider>
    </main>
  );
}

function EditResumeContent({
  isDesktop,
  viewMode,
  renderPreviewToggle,
}: {
  isDesktop: boolean;
  viewMode: "form" | "preview";
  renderPreviewToggle: () => React.ReactElement;
}) {
  const { isLoading, templateId } = useEditResumeForm();

  if (isLoading) {
    return <div>Loading resume...</div>;
  }

  const renderContent = () => {
    if (isDesktop) {
      return (
        <div className="grid grid-cols-2 gap-8">
          <ResumeForm />
          <TemplatePreview templateId={templateId} />
        </div>
      );
    }

    return viewMode === "form" ? (
      <ResumeForm />
    ) : (
      <TemplatePreview templateId={templateId} />
    );
  };

  return (
    <div className="flex flex-col">
      {!isDesktop && renderPreviewToggle()}
      {renderContent()}
    </div>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditResumePageContent />
    </Suspense>
  );
}
