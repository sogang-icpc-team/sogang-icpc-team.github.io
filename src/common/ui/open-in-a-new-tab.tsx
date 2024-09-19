import { styled } from "styled-components";

export const OpenInANewTab = styled.a.attrs({
  target: "_blank",
  rel: "noreferrer noopener",
})`
  text-decoration: underline;
`;
