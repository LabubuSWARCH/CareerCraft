import { TemplateDetail } from "app/(templates)/templates/_components/template-detail";
import { getTemplates } from "@/lib/api/templates";

interface TemplatePageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { templateId } = await params;

  return (
    <main className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12 flex flex-col gap-6 md:gap-8">
      <TemplateDetail templateId={templateId} clickable={true} />
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const templates = await getTemplates();
    return templates.map((template) => ({
      templateId: template.templateId,
    }));
  } catch (err) {
    return [];
  }
}
