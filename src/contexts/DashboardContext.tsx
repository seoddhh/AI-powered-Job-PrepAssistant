import React, { createContext, useContext, useState } from "react";

export interface ResumeStats {
  completed: boolean;
  progress: number;
}

export interface InterviewStats {
  answered: number;
  total: number;
  progress: number;
}

interface DashboardContextValue {
  resume: ResumeStats;
  setResume: React.Dispatch<React.SetStateAction<ResumeStats>>;
  interviews: InterviewStats;
  setInterviews: React.Dispatch<React.SetStateAction<InterviewStats>>;
}

const defaultResume: ResumeStats = { completed: false, progress: 0 };
const defaultInterviews: InterviewStats = { answered: 0, total: 0, progress: 0 };

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resume, setResume] = useState<ResumeStats>(defaultResume);
  const [interviews, setInterviews] = useState<InterviewStats>(defaultInterviews);

  return (
    <DashboardContext.Provider value={{ resume, setResume, interviews, setInterviews }}>
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

