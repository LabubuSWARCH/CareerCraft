import { Button } from "@/components/ui/button";
import { ResumesList } from "./_components/resumes-list";
import Link from "next/link";

export default function ResumesPage() {
  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Resumes</h1>
          <p className="text-lg text-muted-foreground">
            Find and manage your resumes here.
          </p>
        </div>
        <Button asChild>
          <Link href="/resumes/new">Create Resume</Link>
        </Button>
      </div>

      <ResumesList />
    </main>
  );
}
