import { TemplateDetail } from "app/(templates)/_components/template-detail";
import { getTemplates } from "@/lib/api/templates";

interface TemplatePageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { templateId } = await params;

  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <TemplateDetail templateId={templateId} />
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
    console.error(err);
    return [];
  }
}
