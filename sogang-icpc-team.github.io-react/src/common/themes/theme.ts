import { css } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends TSgIcpcTheme {}
}

export const theme = {
  color: {
    primary: "#b60005",
  },
  zIndex: {
    navigationBar: 2_000,
  },
  page: { backgroundColor: "#ffffff" },
  breakpoints: {
    mobile: "@media only screen and (max-width: 768px)",
  },
  nonSelectableStyle: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
} as const;

type TSgIcpcTheme = typeof theme;
