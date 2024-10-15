import { styled } from "styled-components";

import LoaderSvg from "./assets/loader.svg";

export const Loader = styled.img.attrs({
  src: LoaderSvg,
  alt: "loader",
})`
  width: 4rem;

  position: absolute;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
`;
