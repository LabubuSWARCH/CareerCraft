import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ResumeFormData, ResumeFormDataSchema } from "../_schema";

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
  const form = useForm<ResumeFormData>({
    resolver: zodResolver(ResumeFormDataSchema),
    defaultValues: {
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

  const onSubmit: SubmitHandler<ResumeFormData> = (data) => {
    console.log(data);
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
