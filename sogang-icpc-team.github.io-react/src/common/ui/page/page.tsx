import styled from "styled-components";

import { NavigationBar } from "@ui/navigation-bar/navigation-bar";

const Children = styled.div``;
const _Page = ({
  className,
  showNavigationBar = true,
  showFooter,
  children,
}: {
  className?: string;
  showNavigationBar?: boolean;
  showFooter?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className={className}>
      {showNavigationBar && <NavigationBar />}
      <Children>{children}</Children>
      {showFooter && <></>}
    </div>
  );
};

export const Page = styled(_Page)`
  background-color: ${({ theme }) => theme.page.backgroundColor};
`;
