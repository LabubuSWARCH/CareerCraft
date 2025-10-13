import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  createResume,
  deleteResume,
  getResumeById,
  listResumes,
  updateResume,
} from '../../../service/resume';
import { AuthedRequest, requireAuth } from '../middleware/auth';

const router = Router();

function getUserId(req: AuthedRequest): string | undefined {
  return req.user?.id;
}

router.use(requireAuth);

router.get('/', async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const resumes = await listResumes(userId);
  res.json(resumes);
});

router.post('/', async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const { title, templateId, data } = req.body;

  if (!title || !templateId || !data) {
    return res.status(400).json({ error: 'title, templateId, and data are required' });
  }

  if (typeof title !== 'string' || typeof templateId !== 'string') {
    return res.status(400).json({ error: 'title and templateId must be strings' });
  }

  if (typeof data !== 'object' || data === null) {
    return res.status(400).json({ error: 'data must be an object' });
  }

  try {
    const resume = await createResume(userId, { title, templateId, data });
    res.status(201).json(resume);
  } catch (err: unknown) {
    console.error('Failed to create resume', err);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

router.get('/:resumeId', async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const { resumeId } = req.params;
  if (!isValidObjectId(resumeId)) {
    return res.status(400).json({ error: 'Invalid resume id' });
  }

  const resume = await getResumeById(userId, resumeId);
  if (!resume) return res.status(404).json({ error: 'Resume not found' });

  res.json(resume);
});

router.put('/:resumeId', async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const { resumeId } = req.params;
  if (!isValidObjectId(resumeId)) {
    return res.status(400).json({ error: 'Invalid resume id' });
  }

  try {
    const { title, templateId, data } = req.body;

    if (title !== undefined && typeof title !== 'string') {
      return res.status(400).json({ error: 'title must be a string' });
    }

    if (templateId !== undefined && typeof templateId !== 'string') {
      return res.status(400).json({ error: 'templateId must be a string' });
    }

    if (data !== undefined && (typeof data !== 'object' || data === null)) {
      return res.status(400).json({ error: 'data must be an object' });
    }
    const resume = await updateResume(userId, resumeId, {
      ...(title !== undefined && { title }),
      ...(templateId !== undefined && { templateId }),
      ...(data !== undefined && { data }),
    });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err: unknown) {
    console.error('Failed to update resume', err);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

router.delete('/:resumeId', async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const { resumeId } = req.params;
  if (!isValidObjectId(resumeId)) {
    return res.status(400).json({ error: 'Invalid resume id' });
  }

  const ok = await deleteResume(userId, resumeId);
  if (!ok) return res.status(404).json({ error: 'Resume not found' });

  res.status(204).send();
});

export default router;
