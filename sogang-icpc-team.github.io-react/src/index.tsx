import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { OrganizerDataContextProvider } from "./contexts/organizer-data-context";
import { buildRoutesArray, routes } from "./routes/routes";
import { theme } from "./common/themes/theme";
import { HistoryDataContextProvider } from "./contexts/history-data-context";
import { ScrollTopOnRouteChange } from "./routes/scroll-top-on-route-change";

import "./common/themes/global.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <HistoryDataContextProvider>
    <OrganizerDataContextProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ScrollTopOnRouteChange>
            <Routes>
              {buildRoutesArray(routes).map(({ path, component }) => (
                <Route key={path} path={path} element={component} />
              ))}
            </Routes>
          </ScrollTopOnRouteChange>
        </BrowserRouter>
      </ThemeProvider>
    </OrganizerDataContextProvider>
  </HistoryDataContextProvider>,
);
