import { ResumesList } from "./_components/ResumesList";

export default function ResumesPage() {
  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Your resumes</h1>
      </div>

      <ResumesList />
    </main>
  );
}
