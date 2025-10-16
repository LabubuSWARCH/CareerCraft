import { ResumesList } from "./_components/ResumesList";

export default function ResumesPage() {
  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Resumes</h1>
        <p className="text-lg text-muted-foreground">
          Find and manage your resumes here.
        </p>
      </div>

      <ResumesList />
    </main>
  );
}
