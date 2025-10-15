import { fetchTemplate, fetchTemplates } from "@/lib/templates";
import type { TemplateDefinition } from "@shared/template-schema";
import { notFound } from "next/navigation";
import { sampleResume } from "@/data/sampleResume";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { TemplatePreview } from "app/(templates)/_components/template-preview-screen";

interface TemplatePageProps {
  params: {
    templateId: string;
  };
}

async function loadTemplate(
  templateId: string
): Promise<TemplateDefinition | null> {
  try {
    const template = await fetchTemplate(templateId);
    return template;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = await loadTemplate(params.templateId);

  if (!template) {
    notFound();
  }

  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
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

      <div className="max-w-4xl mx-auto w-full">
        <TemplatePreview
          template={template}
          data={sampleResume}
          compact={false}
        />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const templates = await fetchTemplates();
    return templates.map((template) => ({
      templateId: template.templateId,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}
