import React, { createContext, useContext, useState, useEffect } from "react";
import { usePersonalInfo } from "./PersonalInfoContext";
import { useCompanies } from "./CompaniesContext";

export interface DashboardStats {
  personalInfo: {
    completed: boolean;
    progress: number;
  };
  resume: {
    completed: boolean;
    progress: number;
  };
  companies: {
    count: number;
  };
  interviews: {
    answered: number;
    total: number;
    progress: number;
  };
}

interface DashboardContextValue {
  stats: DashboardStats;
  updateStats: () => void;
  setInterviews: (interviews: DashboardStats['interviews']) => void;
  setResume: (resume: DashboardStats['resume']) => void;
}

const defaultStats: DashboardStats = {
  personalInfo: {
    completed: false,
    progress: 0
  },
  resume: {
    completed: false,
    progress: 0
  },
  companies: {
    count: 0
  },
  interviews: {
    answered: 0,
    total: 0,
    progress: 0
  }
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const { personalInfo } = usePersonalInfo();
  const { companies } = useCompanies();

  const updateStats = () => {
    setStats(prev => ({
      ...prev,
      personalInfo: {
        completed: Boolean(personalInfo.name && personalInfo.desiredPosition),
        progress: calculatePersonalInfoProgress(personalInfo)
      },
      companies: {
        count: companies.length
      }
    }));
  };

  const setInterviews = (interviews: DashboardStats['interviews']) => {
    setStats(prev => ({
      ...prev,
      interviews
    }));
  };

  const setResume = (resume: DashboardStats['resume']) => {
    setStats(prev => ({
      ...prev,
      resume
    }));
  };

  useEffect(() => {
    updateStats();
  }, [personalInfo, companies]);

  return (
    <DashboardContext.Provider value={{ stats, updateStats, setInterviews, setResume }}>
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

function calculatePersonalInfoProgress(personalInfo: any): number {
  let progress = 0;
  if (personalInfo.name) progress += 25;
  if (personalInfo.desiredPosition) progress += 25;
  if (personalInfo.experienceYears) progress += 25;
  if (personalInfo.detailedExperience) progress += 25;
  return progress;
}

export default DashboardContext;

