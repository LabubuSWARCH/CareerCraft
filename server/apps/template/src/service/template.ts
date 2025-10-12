import { TemplateSchema, TemplateHints } from '@shared/template-schema';
import { TemplateModel, Template } from '../model';

export interface CreateTemplateInput {
  templateId: string;
  name: string;
  version?: string;
  description?: string;
  author?: string;
  tags?: string[];
  previewUrl?: string;
  schemaJson: TemplateSchema;
  hintJson?: TemplateHints;
}

export type UpdateTemplateInput = Partial<Omit<CreateTemplateInput, 'templateId'>>;

export async function listTemplates(): Promise<Template[]> {
  const docs = await TemplateModel.find().lean();
  return docs.map(normalizeTemplate);
}

export async function getTemplateById(templateId: string): Promise<Template | null> {
  const doc = await TemplateModel.findOne({ templateId }).lean();
  return doc ? normalizeTemplate(doc) : null;
}

export async function createTemplate(data: CreateTemplateInput): Promise<Template> {
  const doc = await TemplateModel.create({
    templateId: data.templateId,
    name: data.name,
    version: data.version ?? '1.0.0',
    description: data.description,
    author: data.author,
    tags: data.tags ?? [],
    previewUrl: data.previewUrl,
    schemaJson: data.schemaJson,
    hintJson: data.hintJson,
  });

  return normalizeTemplate(doc.toObject());
}

export async function updateTemplate(
  templateId: string,
  data: UpdateTemplateInput,
): Promise<Template | null> {
  const doc = await TemplateModel.findOneAndUpdate(
    { templateId },
    {
      $set: {
        ...(data.name && { name: data.name }),
        ...(data.version && { version: data.version }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.previewUrl !== undefined && { previewUrl: data.previewUrl }),
        ...(data.schemaJson !== undefined && { schemaJson: data.schemaJson }),
        ...(data.hintJson !== undefined && { hintJson: data.hintJson }),
      },
    },
    { new: true, lean: true },
  );

  return doc ? normalizeTemplate(doc) : null;
}

export async function deleteTemplate(templateId: string): Promise<boolean> {
  const res = await TemplateModel.deleteOne({ templateId });
  return res.deletedCount === 1;
}

function normalizeTemplate(doc: any): Template {
  return {
    templateId: doc.templateId,
    name: doc.name,
    version: doc.version,
    description: doc.description,
    author: doc.author,
    tags: doc.tags,
    previewUrl: doc.previewUrl,
    schemaJson: doc.schemaJson,
    hintJson: doc.hintJson,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
