import { TemplateDefinition } from "@shared/template-schema";

export async function getTemplates(): Promise<TemplateDefinition[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TEMPLATE_API}/templates`
  );
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TEMPLATE_API}/templates/${templateId}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch template ${templateId}: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
