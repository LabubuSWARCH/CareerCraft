import { promises as fs } from 'fs';
import path from 'path';
import { connectMongo } from '../infra/db/mongo';
import { TemplateModel } from '../model/template';
import type { TemplateDefinition } from '@shared/template-schema';

async function readTemplateFiles(): Promise<TemplateDefinition[]> {
  const dir = path.resolve(__dirname, '../../templates');
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    throw new Error(`Unable to read templates directory at ${dir}: ${(err as Error).message}`);
  }

  const templates: TemplateDefinition[] = [];

  for (const file of entries) {
    if (!file.endsWith('.json')) continue;
    const filePath = path.join(dir, file);
    const raw = await fs.readFile(filePath, 'utf-8');
    const definition = JSON.parse(raw) as TemplateDefinition;
    templates.push(definition);
  }

  return templates;
}

async function seed() {
  await connectMongo();
  const templates = await readTemplateFiles();

  for (const tpl of templates) {
    await TemplateModel.findOneAndUpdate(
      { templateId: tpl.templateId },
      {
        $set: {
          name: tpl.name,
          version: tpl.version,
          description: tpl.description,
          author: tpl.author,
          tags: tpl.tags,
          previewUrl: tpl.previewUrl,
          schemaJson: tpl.schemaJson,
          hintJson: tpl.hintJson,
        },
      },
      { upsert: true, new: true },
    );
  }

  console.log(`Seeded ${templates.length} templates`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed templates', err);
    process.exit(1);
  });
