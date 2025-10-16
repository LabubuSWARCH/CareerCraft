interface ResumePageProps {
  params: Promise<{
    resumeId: string;
  }>;
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { resumeId } = await params;

  return (
    <main className="container mx-auto px-8 py-12 flex flex-col gap-8"></main>
  );
}
