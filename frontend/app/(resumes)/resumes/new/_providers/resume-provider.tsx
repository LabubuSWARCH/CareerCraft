import { createContext, useContext } from "react";

interface ResumeContextType {
  name: string;
}

const ResumeContext = createContext<ResumeContextType>({
  name: "Default Resume",
});

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ResumeContext.Provider value={{ name: "My Resume" }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
