import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { buildRoutesArray, routes } from "./routes/routes";
import { theme } from "./common/themes/theme";
import { OrganizerDataContextProvider } from "./contexts/organizer-data-context";
import { HistoryDataContextProvider } from "./contexts/history-data-context";
import { SpcDataContextProvider } from "./contexts/spc-data-context";

import "./common/themes/global.scss";

const router = createBrowserRouter(
  buildRoutesArray(routes).map(({ path, component }) => ({
    path,
    element: component,
  })),
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <SpcDataContextProvider>
    <HistoryDataContextProvider>
      <OrganizerDataContextProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </OrganizerDataContextProvider>
    </HistoryDataContextProvider>
    ,
  </SpcDataContextProvider>,
);
