"use client";

import { useTemplate } from "@/hooks/use-templates";
import { useUser } from "@/providers/user-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText, Edit, Trash2 } from "lucide-react";
import { MOCK_RESUME } from "@/data/mock-resume";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { notFound, useRouter } from "next/navigation";
import { TemplateRenderer } from "../../../../src/components/template-renderer";
import { deleteTemplate } from "@/lib/api/templates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TemplateDetailProps {
  templateId: string;
  clickable: boolean;
}

export function TemplateDetail({ templateId, clickable }: TemplateDetailProps) {
  const { data: template, isLoading, error } = useTemplate(templateId);
  const { profile } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAdmin = profile.data?.role === "admin";

  const deleteMutation = useMutation({
    mutationFn: () => deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      router.push("/templates");
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to delete template");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !template) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between md:flex-row flex-col gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/templates">
              <ArrowLeft className="size-full" />
            </Link>
          </Button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg md:text-xl font-bold">{template.name}</h1>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {isAdmin && (
            <>
              <Button asChild variant="outline" size="lg">
                <Link href={`/templates/${template.templateId}/edit`}>
                  <Edit className="size-4" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg">
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Template</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this template? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link href={`/resumes/new?template=${template.templateId}`}>
              <FileText className="size-4" />
              Use This Template
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {template.tags?.map((tag) => (
          <Badge key={tag} className="capitalize" variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="max-w-fit mx-auto w-full">
        <TemplateRenderer
          schema={template.schemaJson}
          data={MOCK_RESUME}
          clickable={clickable}
        />
      </div>
    </>
  );
}
