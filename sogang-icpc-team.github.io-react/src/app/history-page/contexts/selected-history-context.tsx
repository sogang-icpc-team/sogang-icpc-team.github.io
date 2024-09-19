import React, { createContext, useContext, useEffect, useState } from "react";

import {
  useHistoryDataContext,
  type THistoryData,
} from "../../../contexts/history-data-context";

export type TSelectedHistoryContext = {
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  data: THistoryData["all"][number];
};
const SelectedHistoryContext = createContext<TSelectedHistoryContext>(
  null as any,
);

export const useSelectedHistoryContext = () =>
  useContext(SelectedHistoryContext);

export const SelectedHistoryContextProvider = ({
  initialValue,
  children,
}: {
  initialValue: Pick<TSelectedHistoryContext, "year">;
  children: React.ReactNode;
}) => {
  const { all: historyDataset } = useHistoryDataContext();

  const [year, setYear] = useState(initialValue.year);
  const [data, setData] = useState(historyDataset.find((d) => d.year === year));

  useEffect(() => {
    setData(historyDataset.find((d) => d.year === year));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  if (!data) {
    throw new Error(
      `[ERROR] History data for the year(${year}) does not exist.`,
    );
  }

  return (
    <SelectedHistoryContext.Provider
      value={{ year, setYear, data }}
      children={children}
    />
  );
};
