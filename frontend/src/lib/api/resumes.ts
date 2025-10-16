import { ResumeData } from "@shared/template-schema";

export async function getResumes(): Promise<ResumeData[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_RESUME_API_URL}/resumes`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch resumes: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

export async function getResume(resumeId: string): Promise<ResumeData> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_RESUME_API_URL}/resumes/${resumeId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch resume ${resumeId}: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
