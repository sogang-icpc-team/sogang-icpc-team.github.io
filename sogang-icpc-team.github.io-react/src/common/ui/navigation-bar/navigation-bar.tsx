import { useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { FlexRow } from "@ui/flex/flex";
import { Dropdown } from "@ui/dropdown/dropdown";
import { EmptyLink } from "@ui/button/empty-link";

import LogoSvg from "../assets/logo-crimson.svg";
import { routes } from "../../../routes/routes";

const RoutesWrapper = styled.div`
  ul {
    display: flex;
    gap: 18px;
  }
`;
const RouteItem = styled.li`
  font-weight: bold;
  font-size: 1rem;
`;
const Logo = styled.img.attrs({
  src: LogoSvg,
  alt: "Sogang ICPC Team Logo",
})`
  width: 36px;
  height: 36px;

  ${({ theme }) => theme.nonSelectableStyle};
`;
const ContestDropdownTriggerButton = styled(FlexRow).attrs({
  alignItems: "center",
  gap: "4px",
})``;
const TriangleDownIcon = styled.span`
  font-size: 12px;
`;
const _NavigationBar = ({ className }: { className?: string }) => {
  const navRoutes = useMemo(
    () => [
      { to: routes.introduction.path(), label: "소개" },
      { to: routes.history.path(), label: "기록" },
      {
        label: (
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            menu={{
              items: [
                {
                  value: "spc",
                  label: <RouteItem>SPC</RouteItem>,
                  to: routes.spc.path(),
                },
                {
                  value: "clean-water-cup",
                  label: <RouteItem>청정수컵</RouteItem>,
                  to: routes.cleanWaterCup.path(),
                },
              ].map((item) => ({
                key: item.value,
                // onClick: item.onClick,
                label: item.to ? (
                  <EmptyLink to={item.to}>{item.label}</EmptyLink>
                ) : (
                  item.label
                ),
              })),
            }}
            children={
              <ContestDropdownTriggerButton
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <span>대회</span>
                <TriangleDownIcon>▼</TriangleDownIcon>
              </ContestDropdownTriggerButton>
            }
          />
        ),
      },
      { to: routes.contact.path(), label: "가입 및 문의" },
    ],
    [],
  );

  return (
    <header className={className}>
      <Link to={routes["/"].path()}>
        <Logo />
      </Link>
      <RoutesWrapper>
        <ul>
          {navRoutes.map(({ to, label }) => {
            if (to) {
              return (
                <RouteItem key={to}>
                  <Link to={to}>{label}</Link>
                </RouteItem>
              );
            }
            return (
              <RouteItem key={to}>
                <div>{label}</div>
              </RouteItem>
            );
          })}
        </ul>
      </RoutesWrapper>
    </header>
  );
};

export const NavigationBar = styled(_NavigationBar)`
  position: sticky;
  top: 0;
  left: 0;

  width: 100%;
  height: ${({ theme }) => theme.navigationBar.height};

  padding: ${({ theme }) => theme.page.padding.default};

  ${({ theme }) => theme.breakpoints.mobile} {
    padding: ${({ theme }) => theme.page.padding.mobile};
  }

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  z-index: ${({ theme }) => theme.zIndex.navigationBar};
`;
