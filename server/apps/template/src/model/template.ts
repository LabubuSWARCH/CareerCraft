import { Schema, model, Document } from 'mongoose';

export interface Template {
  templateId: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  tags?: string[];
  previewUrl?: string;
  schemaJson: Record<string, unknown>;
  hintJson?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateDocument extends Template, Document {}

const templateSchema = new Schema<TemplateDocument>(
  {
    templateId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    version: { type: String, default: '1.0.0' },
    description: { type: String },
    author: { type: String },
    tags: { type: [String], default: [] },
    previewUrl: { type: String },
    schemaJson: { type: Schema.Types.Mixed, required: true },
    hintJson: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const TemplateModel = model<TemplateDocument>('Template', templateSchema);
