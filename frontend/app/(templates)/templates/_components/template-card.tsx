"use client";

import Link from "next/link";
import type { TemplateDefinition } from "@shared/template-schema";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/card";
import { MOCK_RESUME } from "@/data/mock-resume";
import { TemplateRenderer } from "./template-renderer";
import { Badge } from "@/components/ui/badge";

interface TemplateCardProps {
  template: TemplateDefinition;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.templateId}`} className="group block">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="relative overflow-hidden border-b h-56">
          <div className="absolute scale-50 origin-top-left -top-4 left-1/2 -translate-x-1/4">
            <TemplateRenderer
              schema={template.schemaJson}
              data={MOCK_RESUME}
              clickable={false}
            />
          </div>
        </div>
        <CardHeader>
          <CardTitle>{template.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {template.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-2">
          {template.tags?.map((tag) => (
            <Badge key={tag} className="capitalize" variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
