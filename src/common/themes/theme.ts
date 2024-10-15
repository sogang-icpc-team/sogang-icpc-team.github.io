import { css } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends TSgIcpcTheme {}
}

export const theme = {
  fontWeight: {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },
  gray: {
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  color: {
    black: "var(--black)",
    primary: "#b60005",
  },
  zIndex: {
    navigationBar: 2_000,
    dropdown: 2_001,
  },
  page: {
    backgroundColor: "#ffffff",
    padding: {
      default: "0 64px",
      mobile: "0 32px",
    },
  },
  navigationBar: {
    height: "72px",
  },
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
