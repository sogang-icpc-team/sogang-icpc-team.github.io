import styled from "styled-components";

const Children = styled.div``;
const _Page = ({
  className,
  showNavigationBar,
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
      {showNavigationBar && <></>}
      <Children>{children}</Children>
      {showFooter && <></>}
    </div>
  );
};

export const Page = styled(_Page)``;
