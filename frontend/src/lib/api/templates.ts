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

export async function createTemplate(
  template: TemplateDefinition
): Promise<TemplateDefinition> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TEMPLATE_API}/templates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to create template: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

export async function updateTemplate(
  templateId: string,
  template: TemplateDefinition
): Promise<TemplateDefinition> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TEMPLATE_API}/templates/${templateId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to update template: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

export async function deleteTemplate(templateId: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TEMPLATE_API}/templates/${templateId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to delete template: ${response.status} ${response.statusText}`
    );
  }
}
