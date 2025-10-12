'use client';

import * as React from 'react';
import { TemplateRenderer } from './TemplateRenderer';
import type { TemplateDefinition } from '@shared/template-schema';
import { sampleResume } from '@/data/sampleResume';

interface TemplatePreviewScreenProps {
  templates: TemplateDefinition[];
}

export function TemplatePreviewScreen({ templates }: TemplatePreviewScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string>(templates[0]?.templateId ?? '');
  const [compact, setCompact] = React.useState<boolean>(false);

  const selectedTemplate = React.useMemo(
    () => templates.find((tpl) => tpl.templateId === selectedId) ?? templates[0],
    [templates, selectedId],
  );

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="rounded-lg bg-white px-6 py-4 shadow">
          <p className="text-sm text-slate-600">
            Templates are not available. Ensure the Template service is running and seeded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.templateId}
              type="button"
              onClick={() => setSelectedId(tpl.templateId)}
              className={`rounded-full border px-4 py-1 text-sm transition ${
                tpl.templateId === selectedTemplate.templateId
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {tpl.name}
            </button>
          ))}
          <span className="h-6 w-px bg-slate-300" aria-hidden />
          <button
            type="button"
            onClick={() => setCompact((prev) => !prev)}
            className={`rounded border px-4 py-1 text-sm transition ${
              compact ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {compact ? 'Compact: On' : 'Compact: Off'}
          </button>
        </div>
        <div className="w-full">
          <TemplateRenderer schema={selectedTemplate.schemaJson} data={sampleResume} compact={compact} />
        </div>
      </div>
    </div>
  );
}
