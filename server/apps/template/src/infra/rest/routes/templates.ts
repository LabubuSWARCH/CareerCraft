import { Router } from 'express';
import {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../../../service/template';

const router = Router();

router.get('/', async (_req, res) => {
  const templates = await listTemplates();
  res.json(templates);
});

router.get('/:templateId', async (req, res) => {
  const template = await getTemplateById(req.params.templateId);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

router.post('/', async (req, res) => {
  const { templateId, name, version, description, author, tags, previewUrl, schemaJson, hintJson } =
    req.body;

  if (!templateId || !name || !schemaJson) {
    return res.status(400).json({ error: 'templateId, name, and schemaJson are required' });
  }

  try {
    const template = await createTemplate({
      templateId,
      name,
      version,
      description,
      author,
      tags,
      previewUrl,
      schemaJson,
      hintJson,
    });

    res.status(201).json(template);
  } catch (err: unknown) {
    const message =
      err instanceof Error && 'message' in err ? err.message : 'Failed to create template';

    if (err instanceof Error && 'name' in err && err.name === 'MongoServerError') {
      return res.status(409).json({ error: 'Template with this templateId already exists' });
    }

    res.status(500).json({ error: message });
  }
});

router.put('/:templateId', async (req, res) => {
  try {
    const template = await updateTemplate(req.params.templateId, req.body);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err: unknown) {
    const message =
      err instanceof Error && 'message' in err ? err.message : 'Failed to update template';
    res.status(500).json({ error: message });
  }
});

router.delete('/:templateId', async (req, res) => {
  const ok = await deleteTemplate(req.params.templateId);
  if (!ok) return res.status(404).json({ error: 'Template not found' });
  res.status(204).send();
});

export default router;
