import React, { createContext, useContext, useState } from "react";

export interface PersonalInfo {
  name: string;
  desiredPosition: string;
  experienceYears: string;
  detailedExperience: string;
}

interface PersonalInfoContextValue {
  personalInfo: PersonalInfo;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfo>>;
}

const defaultPersonalInfo: PersonalInfo = {
  name: "",
  desiredPosition: "",
  experienceYears: "",
  detailedExperience: "",
};

const PersonalInfoContext = createContext<PersonalInfoContextValue | null>(null);

interface PersonalInfoProviderProps {
  children: React.ReactNode;
  initialPersonalInfo?: PersonalInfo;
}

export const PersonalInfoProvider: React.FC<PersonalInfoProviderProps> = ({
  children,
  initialPersonalInfo,
}) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
    initialPersonalInfo ?? defaultPersonalInfo
  );

  return (
    <PersonalInfoContext.Provider value={{ personalInfo, setPersonalInfo }}>
      {children}
    </PersonalInfoContext.Provider>
  );
};

export function usePersonalInfo() {
  const ctx = useContext(PersonalInfoContext);
  if (!ctx) throw new Error("usePersonalInfo must be used within PersonalInfoProvider");
  return ctx;
}

export default PersonalInfoContext;
