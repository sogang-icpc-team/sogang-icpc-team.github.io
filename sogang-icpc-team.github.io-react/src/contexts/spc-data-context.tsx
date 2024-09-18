import { createContext, useContext } from "react";

import allSpcDataset from "./assets/spc-data/all";

export type TSpcData = {
  years: number[];
  latest: (typeof allSpcDataset)[number];
  all: typeof allSpcDataset;
};
export const SpcDataContext = createContext<TSpcData>(null as any);

export const useSpcDataContext = () => useContext(SpcDataContext);

export const SpcDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SpcDataContext.Provider
      value={{
        years: allSpcDataset.map((h) => h.year),
        latest: allSpcDataset[0],
        all: allSpcDataset,
      }}
    >
      {children}
    </SpcDataContext.Provider>
  );
};
