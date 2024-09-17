import { styled } from "styled-components";

import { type THTMLButtonElementAttributes } from "../../types/html-element-types";

export type TButtonProps = THTMLButtonElementAttributes;
export const Button = styled.button`
  display: inline-flex;
  align-items: center;

  height: 36px;
  line-height: 36px;
  padding: 0 12px;

  border: 1px solid #b60005;
  border-radius: 12px;

  background-color: #fff;
  color: #b60005;

  text-decoration: none;
  cursor: pointer;

  transition: filter 0.1s ease;

  &:hover {
    filter: contrast(0.9);
  }
`;
