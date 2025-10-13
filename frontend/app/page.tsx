import { TemplatePreviewScreen } from '@/components/TemplatePreviewScreen';
import { fetchTemplates } from '@/lib/templates';
import type { TemplateDefinition } from '@shared/template-schema';

async function loadTemplates(): Promise<TemplateDefinition[]> {
  try {
    return await fetchTemplates();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function HomePage() {
  const templates = await loadTemplates();

  return <TemplatePreviewScreen templates={templates} />;
}
