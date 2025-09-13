"use client";
import React, { createContext, useState } from "react";

export type dataContextType = {
  data: any,
  setData: React.Dispatch<React.SetStateAction<any>>,
}

export const dataContext = createContext<dataContextType>({
  data: null,
  setData: () => {},
});

export function DataContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  return (
    <dataContext.Provider value={{ data, setData }}>
      {children}
    </dataContext.Provider>
  );
} 
