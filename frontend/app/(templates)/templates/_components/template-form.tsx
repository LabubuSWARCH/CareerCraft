"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { TemplateDefinition } from "@shared/template-schema";
import { createTemplate, updateTemplate } from "@/lib/api/templates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form schema with validation
const formSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
  name: z.string().min(1, "Name is required"),
  version: z.string().min(1, "Version is required"),
  description: z.string().optional(),
  author: z.string().optional(),
  tags: z.string().optional(),
  previewUrl: z.string().optional(),
  schemaJson: z
    .string()
    .min(1, "Schema JSON is required")
    .refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid JSON format" }
    ),
  hintJson: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid JSON format" }
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface TemplateFormProps {
  template?: TemplateDefinition;
  mode: "create" | "edit";
}

export function TemplateForm({ template, mode }: TemplateFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: template?.templateId || "",
      name: template?.name || "",
      version: template?.version || "1.0.0",
      description: template?.description || "",
      author: template?.author || "",
      tags: template?.tags?.join(", ") || "",
      previewUrl: template?.previewUrl || "",
      schemaJson: template?.schemaJson
        ? JSON.stringify(template.schemaJson, null, 2)
        : "",
      hintJson: template?.hintJson
        ? JSON.stringify(template.hintJson, null, 2)
        : "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      router.push("/templates");
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to create template");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TemplateDefinition) =>
      updateTemplate(template!.templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({
        queryKey: ["templates", template!.templateId],
      });
      router.push(`/templates/${template!.templateId}`);
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to update template");
    },
  });

  const onSubmit = (data: FormValues) => {
    const templateData: TemplateDefinition = {
      templateId: data.templateId,
      name: data.name,
      version: data.version,
      description: data.description || undefined,
      author: data.author || undefined,
      tags: data.tags
        ? data.tags.split(",").map((tag: string) => tag.trim())
        : undefined,
      previewUrl: data.previewUrl || undefined,
      schemaJson: JSON.parse(data.schemaJson),
      hintJson: data.hintJson ? JSON.parse(data.hintJson) : undefined,
    };

    if (mode === "create") {
      createMutation.mutate(templateData);
    } else {
      updateMutation.mutate(templateData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" type="button">
            <Link
              href={
                mode === "edit"
                  ? `/templates/${template?.templateId}`
                  : "/templates"
              }
            >
              <ArrowLeft className="size-full" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Create New Template" : "Edit Template"}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for the template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Template ID <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., classic, modern, creative"
                      disabled={mode === "edit"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic Resume" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Version <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1.0.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the template"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CareerCraft" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., resume, classic, professional (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previewUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preview URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="URL to template preview image"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schema Configuration</CardTitle>
            <CardDescription>
              Define the template schema in JSON format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="schemaJson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Schema JSON <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"componentId": "template", ...}'
                      rows={15}
                      className="font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hints Configuration</CardTitle>
            <CardDescription>
              Define template hints in JSON format (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hintJson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hint JSON</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"summary": "Lead with a strong career narrative...", ...}'
                      rows={10}
                      className="font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="size-4" />
            {isLoading
              ? "Saving..."
              : mode === "create"
              ? "Create Template"
              : "Update Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
