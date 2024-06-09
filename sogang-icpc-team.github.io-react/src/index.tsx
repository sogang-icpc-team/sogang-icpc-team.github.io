import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { routes } from "./routes/routes";
import { theme } from "./common/theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <ThemeProvider theme={theme}>
    <Routes>
      {routes.map(({ path, component }) => (
        <Route path={path} element={component} />
      ))}
    </Routes>
  </ThemeProvider>,
);
