import { createContext, useContext } from "react";

import organizerDataset from "./assets/organizer.json";

type TOrganizerData = {
  latest: typeof organizerDataset[number];
  all: typeof organizerDataset;
};
export const OrganizerDataContext = createContext<TOrganizerData>(null as any);

export const useOrganizerDataContext = () => useContext(OrganizerDataContext);

export const OrganizerDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <OrganizerDataContext.Provider
      value={{
        latest: organizerDataset[0],
        all: organizerDataset,
      }}
    >
      {children}
    </OrganizerDataContext.Provider>
  );
};
