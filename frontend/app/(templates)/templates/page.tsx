import { TemplatesList } from "./_components/templates-list";

export default function TemplatesPage() {
  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Resume Templates</h1>
        <p className="text-lg text-muted-foreground">
          Choose from our professionally designed templates to create your
          perfect resume.
        </p>
      </div>

      <TemplatesList />
    </main>
  );
}
