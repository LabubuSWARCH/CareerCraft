import { useTemplate } from "@/hooks/use-templates";
import { TemplateRenderer } from "@/components/template-renderer";
import { MOCK_RESUME } from "@/data/mock-resume";

interface TemplatePreviewProps {
  templateId: string;
}

export function TemplatePreview({ templateId }: TemplatePreviewProps) {
  const template = useTemplate(templateId);

  if (template.isLoading) {
    return <div>Loading...</div>;
  }

  if (template.error) {
    return <div>Error loading template.</div>;
  }

  if (!template.data) {
    return <div>No template found.</div>;
  }

  return (
    <div className="max-w-fit mx-auto w-full">
      <TemplateRenderer
        schema={template.data.schemaJson}
        data={MOCK_RESUME}
        clickable={true}
      />
    </div>
  );
}
