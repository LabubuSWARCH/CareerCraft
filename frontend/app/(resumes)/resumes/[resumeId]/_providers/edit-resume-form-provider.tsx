"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ResumeFormData, ResumeFormDataSchema } from "../../new/_schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ResumeData } from "@shared/template-schema";
import { Resume } from "@/lib/api/resumes";

interface EditResumeFormContextType {
  form: ReturnType<typeof useForm<ResumeFormData>>;
  onSubmit: SubmitHandler<ResumeFormData>;
  isLoading: boolean;
  templateId: string;
}

const EditResumeFormContext = createContext<
  EditResumeFormContextType | undefined
>(undefined);

async function fetchResume(resumeId: string): Promise<Resume> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_RESUME_API_URL}/resumes/${resumeId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch resume");
  }
  return response.json();
}

export function EditResumeFormProvider({
  children,
  resumeId,
}: {
  children: React.ReactNode;
  resumeId: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: () => fetchResume(resumeId),
  });

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(ResumeFormDataSchema),
    defaultValues: {
      resumeTitle: "",
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      showProjects: true,
    },
  });

  useEffect(() => {
    if (resume && !form.formState.isDirty) {
      form.reset({
        resumeTitle: resume.title || "",
        name: resume.data.name || "",
        title: resume.data.title || "",
        email: resume.data.email || "",
        phone: resume.data.phone || "",
        location: resume.data.location || "",
        website: resume.data.website || "",
        summary: resume.data.summary || "",
        skills: resume.data.skills || [],
        experience: resume.data.experience || [],
        education: resume.data.education || [],
        projects: resume.data.projects || [],
        showProjects: resume.data.showProjects ?? true,
      });
    }
  }, [resume, form]);

  const updateResume = useMutation({
    mutationFn: async (data: {
      title: string;
      templateId: string;
      data: ResumeData;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RESUME_API_URL}/resumes/${resumeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update resume");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resume", resumeId] });
    },
  });

  const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
    const { resumeTitle, ...resumeData } = data;
    await updateResume.mutateAsync({
      title: resumeTitle,
      templateId: resume?.templateId || "classic",
      data: resumeData,
    });
  };

  return (
    <EditResumeFormContext.Provider
      value={{
        form,
        onSubmit,
        isLoading,
        templateId: resume?.templateId || "classic",
      }}
    >
      {children}
    </EditResumeFormContext.Provider>
  );
}

export function useEditResumeForm() {
  const context = useContext(EditResumeFormContext);
  if (!context) {
    throw new Error(
      "useEditResumeForm must be used within an EditResumeFormProvider"
    );
  }
  return context;
}
