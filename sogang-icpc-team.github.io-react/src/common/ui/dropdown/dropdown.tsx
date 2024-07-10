import {
  Dropdown as DropdownAntd,
  DropdownProps as DropdownPropsAntd,
} from "antd";
import styled, { createGlobalStyle } from "styled-components";

const DropdownStyles = createGlobalStyle`
  .ant-dropdown-trigger {
    cursor: pointer;
  }
  .ant-dropdown {
    z-index: ${({ theme }) => theme.zIndex.dropdown};
  }
`;
const _Dropdown = (props: DropdownPropsAntd) => {
  return (
    <>
      <DropdownStyles />
      <DropdownAntd {...props} />
    </>
  );
};
export const Dropdown = styled(_Dropdown)``;
