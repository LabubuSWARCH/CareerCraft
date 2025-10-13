import { ResumeData } from '@shared/template-schema';
import { ResumeModel, Resume } from '../model';

export interface CreateResumeInput {
  title: string;
  templateId: string;
  data: ResumeData;
}

export interface UpdateResumeInput {
  title?: string;
  templateId?: string;
  data?: ResumeData;
}

type RawResume = {
  _id?: { toString(): string };
  id?: string;
  userId: string;
  title: string;
  templateId: string;
  data: ResumeData;
  createdAt?: Date;
  updatedAt?: Date;
};

function normalizeResume(doc: RawResume): Resume {
  const id = doc._id?.toString() ?? doc.id;
  if (!id) {
    throw new Error('Resume record is missing an id');
  }

  return {
    id,
    userId: doc.userId,
    title: doc.title,
    templateId: doc.templateId,
    data: doc.data,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listResumes(userId: string): Promise<Resume[]> {
  const docs = await ResumeModel.find({ userId }).sort({ updatedAt: -1 }).lean();
  return docs.map((doc) => normalizeResume(doc as RawResume));
}

export async function getResumeById(userId: string, resumeId: string): Promise<Resume | null> {
  const doc = await ResumeModel.findOne({ _id: resumeId, userId }).lean();
  return doc ? normalizeResume(doc as RawResume) : null;
}

export async function createResume(userId: string, input: CreateResumeInput): Promise<Resume> {
  const doc = await ResumeModel.create({
    userId,
    title: input.title,
    templateId: input.templateId,
    data: input.data,
  });

  return normalizeResume(doc.toObject() as RawResume);
}

export async function updateResume(
  userId: string,
  resumeId: string,
  input: UpdateResumeInput,
): Promise<Resume | null> {
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) updates.title = input.title;
  if (input.templateId !== undefined) updates.templateId = input.templateId;
  if (input.data !== undefined) updates.data = input.data;

  const doc = Object.keys(updates).length
    ? await ResumeModel.findOneAndUpdate(
        { _id: resumeId, userId },
        { $set: updates },
        { new: true, lean: true },
      )
    : await ResumeModel.findOne({ _id: resumeId, userId }).lean();

  return doc ? normalizeResume(doc as RawResume) : null;
}

export async function deleteResume(userId: string, resumeId: string): Promise<boolean> {
  const result = await ResumeModel.deleteOne({ _id: resumeId, userId });
  return result.deletedCount === 1;
}
