import React, { createContext, useContext, useState } from "react";

export interface Company {
  id: string;
  name: string;
  position: string;
  keywords: string[];
}

interface CompaniesContextValue {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
}

const defaultCompanies: Company[] = [
  {
    id: "1",
    name: "네이버",
    position: "프론트엔드 개발자",
    keywords: ["React", "TypeScript", "사용자 경험", "팀워크", "성장"]
  },
  {
    id: "2",
    name: "카카오",
    position: "풀스택 개발자",
    keywords: ["Vue.js", "Node.js", "혁신", "도전정신", "커뮤니케이션"]
  }
];

const CompaniesContext = createContext<CompaniesContextValue | null>(null);

interface CompaniesProviderProps {
  children: React.ReactNode;
  initialCompanies?: Company[];
}

export const CompaniesProvider: React.FC<CompaniesProviderProps> = ({ children, initialCompanies }) => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies ?? defaultCompanies);
  return (
    <CompaniesContext.Provider value={{ companies, setCompanies }}>
      {children}
    </CompaniesContext.Provider>
  );
};

export function useCompanies() {
  const ctx = useContext(CompaniesContext);
  if (!ctx) throw new Error("useCompanies must be used within CompaniesProvider");
  return ctx;
}

export default CompaniesContext;
