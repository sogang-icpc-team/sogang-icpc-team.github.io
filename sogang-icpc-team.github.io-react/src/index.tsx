import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { routes } from "./routes/routes";
import { theme } from "./common/themes/theme";

import "./common/themes/global.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, component }) => (
          <Route path={path} element={component} />
        ))}
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
);
