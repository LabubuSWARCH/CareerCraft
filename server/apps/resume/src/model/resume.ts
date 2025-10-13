import { Schema, model, Document } from 'mongoose';
import { ResumeData } from '@shared/template-schema';

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  data: ResumeData;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResumeDocument extends Document {
  userId: string;
  title: string;
  templateId: string;
  data: ResumeData;
  createdAt?: Date;
  updatedAt?: Date;
}

const resumeSchema = new Schema<ResumeDocument>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    templateId: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

resumeSchema.index({ userId: 1, updatedAt: -1 });

export const ResumeModel = model<ResumeDocument>('Resume', resumeSchema);
