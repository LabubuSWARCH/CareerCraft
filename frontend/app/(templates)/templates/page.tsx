import { fetchTemplates } from "@/lib/templates";
import type { TemplateDefinition } from "@shared/template-schema";
import { TemplateCard } from "app/(templates)/_components/template-card";

async function loadTemplates(): Promise<TemplateDefinition[]> {
  try {
    return await fetchTemplates();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function TemplatesPage() {
  const templates = await loadTemplates();

  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Resume Templates</h1>
        <p className="text-lg text-muted-foreground">
          Choose from our professionally designed templates to create your
          perfect resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard key={template.templateId} template={template} />
        ))}
      </div>
    </main>
  );
}
