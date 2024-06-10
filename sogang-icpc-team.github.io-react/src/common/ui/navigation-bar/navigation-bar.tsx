import { useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import LogoSvg from "../assets/logo-crimson.svg";
import { routes } from "../../../routes/routes";

const RoutesWrapper = styled.div`
  ul {
    display: flex;
    gap: 18px;

    li {
      font-weight: bold;
      font-size: 0.9rem;
    }
  }
`;
const Logo = styled.img.attrs({
  src: LogoSvg,
  alt: "Sogang ICPC Team Logo",
})`
  width: 36px;
  height: 36px;

  ${({ theme }) => theme.nonSelectableStyle};
`;
const _NavigationBar = ({ className }: { className?: string }) => {
  const navRoutes = useMemo(
    () => [
      { to: routes.introduction.path(), label: "소개" },
      { to: routes.history.path(), label: "기록" },
      { to: routes.spc.path(), label: "SPC" },
      { to: routes.applyK512.path(), label: "K512컵" },
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
          {navRoutes.map(({ to, label }) => (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
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

  padding: 0 64px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  z-index: ${({ theme }) => theme.zIndex.navigationBar};
`;
