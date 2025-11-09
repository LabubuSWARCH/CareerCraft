"use client";

import { useUser } from "@/providers/user-provider";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CreateTemplateButton() {
  const { profile } = useUser();
  const isAdmin = profile.data?.role === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <Button asChild>
      <Link href="/templates/new">
        <Plus className="size-4" />
        Create New Template
      </Link>
    </Button>
  );
}
