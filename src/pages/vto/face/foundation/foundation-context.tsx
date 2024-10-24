import React, { createContext, useState, useContext } from "react";

interface FoundationContextType {
  colorFamily: string | null;
  setColorFamily: (color: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}

// Create the context
const FoundationContext = createContext<FoundationContextType | undefined>(undefined);

// Create a provider component
export function FoundationProvider({ children }: { children: React.ReactNode }) {
  const [colorFamily, setColorFamily] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <FoundationContext.Provider
      value={{
        colorFamily,
        setColorFamily,
        selectedColor,
        setSelectedColor,
      }}
    >
      {children}
    </FoundationContext.Provider>
  );
}

// Custom hook to use the context
export function useFoundationContext() {
  const context = useContext(FoundationContext);
  if (context === undefined) {
    throw new Error("useFoundationContext must be used within a FoundationProvider");
  }
  return context;
}