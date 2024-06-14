import { createContext, useContext } from "react";

import allHistoryDataset from "./assets/data/all";

export type THistoryData = {
  years: number[];
  latest: typeof allHistoryDataset[number];
  all: typeof allHistoryDataset;
};
export const HistoryDataContext = createContext<THistoryData>(null as any);

export const useHistoryDataContext = () => useContext(HistoryDataContext);

export const HistoryDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <HistoryDataContext.Provider
      value={{
        years: allHistoryDataset.map((h) => h.year),
        latest: allHistoryDataset[0],
        all: allHistoryDataset,
      }}
    >
      {children}
    </HistoryDataContext.Provider>
  );
};
