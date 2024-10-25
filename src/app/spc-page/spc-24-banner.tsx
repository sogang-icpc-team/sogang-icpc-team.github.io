import styled from "styled-components";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { FlexCol, FlexRow } from "@ui/flex/flex";
import { EmptyLink } from "@ui/button/empty-link";
import { EmptyButton } from "@ui/button/empty-button";

import Spc24HeroNoAniSvg from "./assets/spc24-hero__no-ani.svg";
import { routes } from "../../routes/routes";

const SubTitle = styled.span`
  font-family: "sogang";
  font-size: 1.2rem;
`;
const Title = styled.span`
  font-family: "sogang";
  font-size: 2.4rem;

  word-break: keep-all;
  text-align: center;
`;
const Logo = styled.img`
  height: 5.6rem;
`;
const LogoTitleWrapper = styled(FlexRow)`
  align-items: center;
  gap: 2rem;

  height: 100%;

  @media (max-width: 1240px) {
    flex-direction: column;
  }
`;
const TitleWrapper = styled(FlexCol)`
  align-items: flex-start;
  row-gap: 0.2rem;

  @media (max-width: 1240px) {
    align-items: center;
  }
`;

const Sup = styled.div`
  vertical-align: super;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const ApplyButton = styled(EmptyButton)`
  display: inline-flex;
  align-items: center;
  column-gap: 0.4rem;

  border-radius: 12px;
  padding: 4px 12px;

  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  border: 2px solid #9a0a0a;
  color: #9a0a0a;

  text-align: center;

  &:hover {
    background-color: #5656560f;
    /* background: black; */
  }
`;

const DateLocationWrapper = styled(FlexRow)`
  flex-direction: column;

  row-gap: 0.4rem;
`;
const InfoLabel = styled.span`
  font-family: "Pretendard";
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  vertical-align: super;
  font-size: 0.9rem;

  color: rgb(156, 133, 119);
`;
const InfoValue = styled.span`
  font-family: "Pretendard";
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: 1.2rem;
`;

const _Spc24Banner = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <LogoTitleWrapper>
        <Logo src={Spc24HeroNoAniSvg} />
        <TitleWrapper>
          <SubTitle>2024 · 제 20회</SubTitle>
          <Title>서강대학교 프로그래밍 대회</Title>
        </TitleWrapper>
      </LogoTitleWrapper>
      <DateLocationWrapper>
        <FlexRow columnGap="0.4rem">
          <InfoLabel>일시</InfoLabel>
          <InfoValue>11월 9일 토요일 오후 2-6시</InfoValue>
        </FlexRow>
        <FlexRow columnGap="0.4rem">
          <InfoLabel>장소</InfoLabel>
          <InfoValue>다산관 D104/105</InfoValue>
        </FlexRow>
      </DateLocationWrapper>
      <EmptyLink to={routes.spc24Apply.path()}>
        <ApplyButton>
          참가신청
          <Sup>~11/3(일)까지</Sup>
          <ArrowRightIcon width={24} />
        </ApplyButton>
      </EmptyLink>
    </div>
  );
};
export const Spc24Banner = styled(_Spc24Banner)`
  position: relative;

  color: black;
  background-color: #f1f1f1;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: ${({ theme }) => theme.page.padding.default};
  padding-top: 20px;
  padding-bottom: 20px;

  @media (max-width: 1240px) {
    flex-direction: column;
    row-gap: 1.4rem;

    padding: ${({ theme }) => theme.page.padding.mobile};
    padding-top: 40px;
    padding-bottom: 40px;
  }
`;
