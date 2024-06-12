import styled from "styled-components";

import { NavigationBar } from "@ui/navigation-bar/navigation-bar";

const Title = styled.div`
  color: ${({ theme }) => theme.color.primary};
  font-size: 32px;
  font-weight: bold;

  padding-bottom: 12px;
`;
const Description = styled.div`
  font-size: 20px;
`;
const _PageTitle = styled(
  ({
    className,
    description,
    children,
  }: {
    className?: string;
    description?: React.ReactNode;
    children: React.ReactNode;
  }) => {
    return (
      <div className={className}>
        <Title>{children}</Title>
        <Description>{description}</Description>
      </div>
    );
  },
)``;
export const PageTitle = styled(_PageTitle)`
  padding: ${({ theme }) => theme.page.padding.default};
  padding-top: 32px !important;
  padding-bottom: 8px !important;

  ${({ theme }) => theme.breakpoints.mobile} {
    padding: ${({ theme }) => theme.page.padding.mobile};
  }
`;

const _PageBody = styled.div`
  padding: ${({ theme }) => theme.page.padding.default};

  ${({ theme }) => theme.breakpoints.mobile} {
    padding: ${({ theme }) => theme.page.padding.mobile};
  }
`;
export const PageBody = styled(_PageBody)``;

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
` as unknown as typeof _Page & {
  Title: typeof PageTitle;
  Body: typeof PageBody;
};
Page.Title = PageTitle;
Page.Body = PageBody;
