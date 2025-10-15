import { TemplateDefinition } from "@shared/template-schema";

const DEFAULT_API_BASE = "http://localhost:8081/templates";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_TEMPLATE_API ?? DEFAULT_API_BASE;
}

export async function getTemplates(): Promise<TemplateDefinition[]> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/templates`, {
    next: { revalidate: 0 },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch templates: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

export async function getTemplate(
  templateId: string
): Promise<TemplateDefinition> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/templates/${templateId}`, {
    next: { revalidate: 0 },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch template ${templateId}: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
