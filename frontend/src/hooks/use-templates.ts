import { useQuery } from "@tanstack/react-query";
import { getTemplates, getTemplate } from "@/lib/api/templates";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });
}

export function useTemplate(templateId: string) {
  return useQuery({
    queryKey: ["templates", templateId],
    queryFn: () => getTemplate(templateId),
    enabled: !!templateId,
  });
}
