"use client";

import { TemplateForm } from "../_components/template-form";
import { useUser } from "@/providers/user-provider";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function NewTemplatePage() {
  const { profile } = useUser();

  if (profile.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (profile.data?.role !== "admin") {
    redirect("/templates");
  }

  return (
    <main className="container mx-auto px-8 py-12">
      <TemplateForm mode="create" />
    </main>
  );
}
