"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  isDemoMode,
  getDemoPersona,
  setDemoPersona as saveDemoPersona,
  clearDemoPersona,
  getDemoUser,
  getPersonaDashboard,
  type PersonaType,
} from "@/lib/demo-mode";

interface DemoContextType {
  isDemo: boolean;
  persona: PersonaType | null;
  user: ReturnType<typeof getDemoUser> | null;
  setPersona: (persona: PersonaType) => void;
  clearPersona: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo] = useState(isDemoMode());
  const [persona, setPersonaState] = useState<PersonaType | null>(null);
  const [user, setUser] = useState<ReturnType<typeof getDemoUser> | null>(null);
  const router = useRouter();

  // Load persona from localStorage on mount
  useEffect(() => {
    if (isDemo) {
      const savedPersona = getDemoPersona();
      if (savedPersona) {
        setPersonaState(savedPersona);
        setUser(getDemoUser(savedPersona));
      }
    }
  }, [isDemo]);

  const setPersona = (newPersona: PersonaType) => {
    saveDemoPersona(newPersona);
    setPersonaState(newPersona);
    setUser(getDemoUser(newPersona));

    // Navigate to persona's dashboard
    const dashboard = getPersonaDashboard(newPersona);
    router.push(dashboard);
  };

  const clearPersona = () => {
    clearDemoPersona();
    setPersonaState(null);
    setUser(null);
    router.push("/");
  };

  return (
    <DemoContext.Provider value={{ isDemo, persona, user, setPersona, clearPersona }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
