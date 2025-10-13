import { TemplateDefinition } from '@shared/template-schema';

const DEFAULT_API_BASE = 'http://localhost:8081/templates';

export async function fetchTemplates(): Promise<TemplateDefinition[]> {
  const baseUrl = process.env.NEXT_PUBLIC_TEMPLATE_API ?? DEFAULT_API_BASE;
  const response = await fetch(baseUrl, { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTemplate(templateId: string): Promise<TemplateDefinition> {
  const baseUrl = process.env.NEXT_PUBLIC_TEMPLATE_API ?? DEFAULT_API_BASE;
  const response = await fetch(`${baseUrl}/${templateId}`, { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch template ${templateId}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
