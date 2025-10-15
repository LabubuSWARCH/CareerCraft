"use client";

import Link from "next/link";
import type { TemplateDefinition } from "@shared/template-schema";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { TemplateRenderer } from "./template-renderer";
import { sampleResume } from "@/data/sampleResume";

interface TemplateCardProps {
  template: TemplateDefinition;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.templateId}`} className="group block">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        <div
          className="relative bg-slate-100 overflow-hidden border-b"
          style={{ height: "14rem", aspectRatio: "1/1.414" }}
        >
          <div className="absolute inset-0 scale-[0.28] origin-top-left pointer-events-none">
            <TemplateRenderer
              schema={template.schemaJson}
              data={sampleResume}
              compact={true}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">
            {template.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {template.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
