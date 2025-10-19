import { ResumeData } from "@shared/template-schema";
export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  data: ResumeData;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getResumes(): Promise<Resume[]> {
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

export async function createResume(
  resumeData: ResumeData
): Promise<ResumeData> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_RESUME_API_URL}/resumes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to create resume: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
