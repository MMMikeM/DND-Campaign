"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CrossReferenceContextType = {
  navigateToFile: (filename: string) => void;
  navigateToSection: (path: string) => void;
  registerSectionRef: (path: string, ref: HTMLElement) => void;
};

const CrossReferenceContext = createContext<
  CrossReferenceContextType | undefined
>(undefined);

type SectionRefs = {
  [path: string]: HTMLElement;
};

type CrossReferenceProviderProps = {
  children: ReactNode;
  onFileChange: (filename: string) => void;
};

export function CrossReferenceProvider({
  children,
  onFileChange,
}: CrossReferenceProviderProps) {
  const [sectionRefs, setSectionRefs] = useState<SectionRefs>({});

  const navigateToFile = (filename: string) => {
    // If the filename ends with .yaml or .yml, navigate to that file
    if (filename.endsWith(".yaml") || filename.endsWith(".yml")) {
      onFileChange(filename);
    }
  };

  const navigateToSection = (path: string) => {
    const sectionRef = sectionRefs[path];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: "smooth", block: "start" });

      // Highlight the section briefly
      sectionRef.classList.add("bg-yellow-100", "dark:bg-yellow-900/30");
      setTimeout(() => {
        sectionRef.classList.remove("bg-yellow-100", "dark:bg-yellow-900/30");
      }, 1500);
    }
  };

  const registerSectionRef = (path: string, ref: HTMLElement) => {
    setSectionRefs((prev) => {
      // Only update if the ref has changed to prevent infinite loops
      if (prev[path] === ref) {
        return prev;
      }
      return {
        ...prev,
        [path]: ref,
      };
    });
  };

  return (
    <CrossReferenceContext.Provider
      value={{ navigateToFile, navigateToSection, registerSectionRef }}
    >
      {children}
    </CrossReferenceContext.Provider>
  );
}

export function useCrossReference() {
  const context = useContext(CrossReferenceContext);
  if (context === undefined) {
    throw new Error(
      "useCrossReference must be used within a CrossReferenceProvider"
    );
  }
  return context;
}
