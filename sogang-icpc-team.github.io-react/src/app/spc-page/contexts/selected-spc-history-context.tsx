import React, { createContext, useContext, useEffect, useState } from "react";
import {
  TSpcData,
  useSpcDataContext,
} from "../../../contexts/spc-data-context";

export type TSelectedSpcHistoryContext = {
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  data: TSpcData["all"][number];
};
const SelectedSpcHistoryContext = createContext<TSelectedSpcHistoryContext>(
  null as any,
);

export const useSelectedSpcHistoryContext = () =>
  useContext(SelectedSpcHistoryContext);

export const SelectedSpcHistoryContextProvider = ({
  initialValue,
  children,
}: {
  initialValue: Pick<TSelectedSpcHistoryContext, "year">;
  children: React.ReactNode;
}) => {
  const { all: spcDataset } = useSpcDataContext();

  const [year, setYear] = useState(initialValue.year);
  const [data, setData] = useState(spcDataset.find((d) => d.year === year));

  useEffect(() => {
    setData(spcDataset.find((d) => d.year === year));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  if (!data) {
    throw new Error(
      `[ERROR] History data for the year(${year}) does not exist.`,
    );
  }

  return (
    <SelectedSpcHistoryContext.Provider
      value={{ year, setYear, data }}
      children={children}
    />
  );
};
