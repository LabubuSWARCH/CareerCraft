import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ResumeFormData, ResumeFormDataSchema } from "../_schema";
import { useUser } from "@/providers/user-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ResumeData } from "@shared/template-schema";

interface ResumeFormContextType {
  form: ReturnType<typeof useForm<ResumeFormData>>;
  onSubmit: SubmitHandler<ResumeFormData>;
}

const ResumeFormContext = createContext<ResumeFormContextType | undefined>(
  undefined
);

export function ResumeFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

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
      website: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      showProjects: true,
    },
  });

  useEffect(() => {
    if (profile.data && !form.formState.isDirty) {
      form.reset({
        ...form.getValues(),
        name: profile.data.full_name || "",
        email: profile.data.email || "",
        phone: profile.data.phone || "",
        location: profile.data.address || "",
      });
    }
  }, [profile.data, form]);

  const createResume = useMutation({
    mutationFn: async (data: {
      title: string;
      templateId: string;
      data: ResumeData;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RESUME_API_URL}/resumes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create resume");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      form.reset();
      router.push(`/resumes/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<ResumeFormData> = async (data) => {
    const { resumeTitle, ...resumeData } = data;
    await createResume.mutateAsync({
      title: resumeTitle,
      templateId: searchParams.get("template") || "classic",
      data: resumeData,
    });
  };

  return (
    <ResumeFormContext.Provider value={{ form, onSubmit }}>
      {children}
    </ResumeFormContext.Provider>
  );
}

export function useResumeForm() {
  const context = useContext(ResumeFormContext);
  if (!context) {
    throw new Error("useResumeForm must be used within a ResumeFormProvider");
  }
  return context;
}
