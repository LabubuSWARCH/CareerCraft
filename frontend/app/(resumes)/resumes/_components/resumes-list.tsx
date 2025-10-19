"use client";

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
import { File, X } from "lucide-react";
import Link from "next/link";
import { useResumes } from "@/hooks/use-resume";
import { ResumeCard } from "./resume-card";

export function ResumesList() {
  const { data: resumes, isPending, error } = useResumes();

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
          <EmptyTitle>Failed to load resumes</EmptyTitle>
          <EmptyDescription>
            There was an error loading the resumes. Please try again later.
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

  if (!resumes || resumes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <File />
          </EmptyMedia>
          <EmptyTitle>No Resumes Available</EmptyTitle>
          <EmptyDescription>
            You haven't created any resumes yet. Get started by creating a new
            resume.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col gap-2">
            <Button asChild size="lg">
              <Link href="/resumes/new">Create Resume</Link>
            </Button>
            <p>Or</p>
            <Button variant="outline" asChild size="lg">
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  );
}
