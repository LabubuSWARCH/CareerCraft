"use client";

import { useTemplates } from "@/hooks/use-templates";
import { TemplateCard } from "app/(templates)/templates/_components/template-card";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export function TemplatesList() {
  const { data: templates, isPending, error } = useTemplates();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <X />
          </EmptyMedia>
          <EmptyTitle>Failed to load templates</EmptyTitle>
          <EmptyDescription>
            There was an error loading the templates. Please try again later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <X />
          </EmptyMedia>
          <EmptyTitle>No Templates Available</EmptyTitle>
          <EmptyDescription>
            There are currently no resume templates available. Please check back
            later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.templateId} template={template} />
      ))}
    </div>
  );
}
