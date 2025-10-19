import { useTemplate } from "@/hooks/use-templates";
import { TemplateRenderer } from "@/components/template-renderer";
import { useResumeForm as useNewResumeForm } from "../_providers/resume-form-provider";

interface TemplatePreviewProps {
  templateId: string;
}

function useResumeFormHook() {
  try {
    return useNewResumeForm();
  } catch {
    const {
      useEditResumeForm,
    } = require("../../[resumeId]/_providers/edit-resume-form-provider");
    return useEditResumeForm();
  }
}

export function TemplatePreview({ templateId }: TemplatePreviewProps) {
  const template = useTemplate(templateId);
  const { form } = useResumeFormHook();

  const formData = form.watch();

  if (template.isLoading) {
    return <div>Loading...</div>;
  }

  if (template.error) {
    return <div>Error loading template.</div>;
  }

  if (!template.data) {
    return <div>No template found.</div>;
  }

  const { resumeTitle, ...resumeData } = formData;

  const preparedData = {
    ...resumeData,
    experience: resumeData.experience ?? [],
    education: resumeData.education ?? [],
    projects: resumeData.projects ?? [],
    skills: resumeData.skills ?? [],
  };

  return (
    <div className="max-w-fit mx-auto w-full">
      <TemplateRenderer
        schema={template.data.schemaJson}
        data={preparedData}
        clickable={true}
      />
    </div>
  );
}
