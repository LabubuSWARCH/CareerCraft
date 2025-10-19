"use client";

import { useResumeForm as useNewResumeForm } from "../../new/_providers/resume-form-provider";
import { useEditResumeForm as useEditResumeFormHook } from "../_providers/edit-resume-form-provider";

export function useResumeFormContext() {
  try {
    return useNewResumeForm();
  } catch {
    return useEditResumeFormHook();
  }
}
