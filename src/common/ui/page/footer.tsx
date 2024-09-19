import { styled } from "styled-components";
import {
  ChatBubbleOvalLeftIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

import { FlexRow } from "@ui/flex/flex";
import { IconButton } from "@ui/button/icon-button";

// Is it better to place the logo on footer?
// import LogoSilver from "./assets/logo-silver.svg";
import constants from "../../../contexts/assets/constants";

const Sitename = styled.div`
  font-weight: 600;
  font-size: 16px;
`;
const CopyRight = styled.div`
  font-weight: 500;
`;
const Address = styled.div`
  font-weight: 500;
  word-break: keep-all;
  margin-top: 8px;
`;

const UpperSection = styled(FlexRow)`
  margin-bottom: 8px;
`;
const LowerSection = styled(FlexRow).attrs({
  justifyContent: "space-between",
  alignItems: "center",
})`
  padding: 16px 0 32px 0;

  /* For mobile */
  flex-wrap: wrap;
  row-gap: 12px;
`;
const _Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={className}>
      <UpperSection>
        <div>
          <FlexRow alignItems="center" gap="10px">
            {/* <img src={LogoSilver} alt="logo" style={{ width: 20 }} /> */}
            <Sitename>Sogang ICPC Team</Sitename>
          </FlexRow>
          <Address>{constants.fullAddress}</Address>
        </div>
      </UpperSection>
      <LowerSection>
        <CopyRight>
          © {new Date().getFullYear()} Sogang ICPC Team. All rights reserved
        </CopyRight>
        <FlexRow gap="24px">
          <IconButton
            icon={<EnvelopeIcon color="#7f7f7f" width={20} />}
            onClick={() => {
              window.open(`mailto:${constants.emailAddress}`);
            }}
          />
          <IconButton
            icon={<ChatBubbleOvalLeftIcon color="#7f7f7f" width={20} />}
            onClick={() => {
              window.open(constants.kakaoPfUrl);
            }}
          />
        </FlexRow>
      </LowerSection>
    </footer>
  );
};

export const Footer = styled(_Footer)`
  padding-top: 40px !important;

  font-size: 14px;

  color: #7f7f7f;

  padding: ${({ theme }) => theme.page.padding.default};

  ${({ theme }) => theme.breakpoints.mobile} {
    padding: ${({ theme }) => theme.page.padding.mobile};
  }
`;
