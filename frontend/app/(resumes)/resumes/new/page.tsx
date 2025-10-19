"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TemplatePreview } from "./_components/template-preview";
import { ResumeForm } from "./_components/resume-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  ChevronsUpDown as ChevronsUpDownIcon,
  Check as CheckIcon,
  Eye,
  EyeClosed,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useTemplates } from "@/hooks/use-templates";
import { Label } from "@/components/ui/label";
import { ResumeFormProvider } from "./_providers/resume-form-provider";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";

const DEFAULT_TEMPLATE_ID = "classic";
const DESKTOP_BREAKPOINT = "(min-width: 1024px)";

function NewResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") ?? DEFAULT_TEMPLATE_ID;
  const { data: templates } = useTemplates();

  const [openTemplateSelection, setOpenTemplateSelection] = useState(false);
  const [viewMode, setViewMode] = useState<"form" | "preview">("form");
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleTemplateSelect = (newTemplateId: string) => {
    router.push(`/resumes/new?${createQueryString("template", newTemplateId)}`);
    setOpenTemplateSelection(false);
  };

  const renderTemplateSelector = () => (
    <div className="flex items-center">
      <Label className="mr-4 font-semibold">Template</Label>
      <Popover
        open={openTemplateSelection}
        onOpenChange={setOpenTemplateSelection}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openTemplateSelection}
            className="w-[200px] justify-between"
          >
            {templateId
              ? templates?.find((t) => t.templateId === templateId)?.name
              : "Select template..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search template..." />
            <CommandList>
              <CommandEmpty>No template found.</CommandEmpty>
              <CommandGroup>
                {templates?.map((template) => (
                  <CommandItem
                    key={template.templateId}
                    value={template.templateId}
                    onSelect={handleTemplateSelect}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        templateId === template.templateId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {template.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  const renderPreviewToggle = () => (
    <div className="mb-4 flex items-center gap-2">
      <Label className="font-semibold">
        {viewMode === "preview" ? (
          <Eye className="inline-block mr-1" />
        ) : (
          <EyeClosed className="inline-block mr-1" />
        )}
        Preview mode
      </Label>
      <Switch
        checked={viewMode === "preview"}
        onCheckedChange={(checked) => setViewMode(checked ? "preview" : "form")}
      />
    </div>
  );

  const renderContent = () => {
    if (isDesktop) {
      return (
        <div className="grid grid-cols-2 gap-8">
          <ResumeForm />
          <TemplatePreview templateId={templateId} />
        </div>
      );
    }

    return viewMode === "form" ? (
      <ResumeForm />
    ) : (
      <TemplatePreview templateId={templateId} />
    );
  };

  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Create resume</h1>
      </div>

      {renderTemplateSelector()}

      <ResumeFormProvider>
        <div className="flex flex-col">
          {!isDesktop && renderPreviewToggle()}
          {renderContent()}
        </div>
      </ResumeFormProvider>
    </main>
  );
}

export default function NewResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewResumePageContent />
    </Suspense>
  );
}
