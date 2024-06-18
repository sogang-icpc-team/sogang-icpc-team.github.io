import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { OrganizerDataContextProvider } from "./contexts/organizer-data-context";
import { buildRoutesArray, routes } from "./routes/routes";
import { theme } from "./common/themes/theme";

import "./common/themes/global.scss";
import { HistoryDataContextProvider } from "./contexts/history-data-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <HistoryDataContextProvider>
    <OrganizerDataContextProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            {buildRoutesArray(routes).map(({ path, component }) => (
              <Route key={path} path={path} element={component} />
            ))}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </OrganizerDataContextProvider>
  </HistoryDataContextProvider>,
);
