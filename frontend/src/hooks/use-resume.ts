import { useQuery } from "@tanstack/react-query";
import { getResume, getResumes } from "@/lib/api/resumes";

export function useResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
}

export function useResume(resumeId: string) {
  return useQuery({
    queryKey: ["resumes", resumeId],
    queryFn: () => getResume(resumeId),
    enabled: !!resumeId,
  });
}
