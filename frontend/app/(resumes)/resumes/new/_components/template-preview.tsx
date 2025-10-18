import { useTemplate } from "@/hooks/use-templates";
import { TemplateRenderer } from "@/components/template-renderer";
import { useResumeForm } from "../_providers/resume-form-provider";

interface TemplatePreviewProps {
  templateId: string;
}

export function TemplatePreview({ templateId }: TemplatePreviewProps) {
  const template = useTemplate(templateId);
  const { form } = useResumeForm();

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

  const resumeData = {
    ...formData,
    experience: formData.experience ?? [],
    education: formData.education ?? [],
    projects: formData.projects ?? [],
    skills: formData.skills ?? [],
  };

  return (
    <div className="max-w-fit mx-auto w-full">
      <TemplateRenderer
        schema={template.data.schemaJson}
        data={resumeData}
        clickable={true}
      />
    </div>
  );
}
