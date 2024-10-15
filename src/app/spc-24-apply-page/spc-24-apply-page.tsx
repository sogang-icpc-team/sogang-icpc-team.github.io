import styled, { createGlobalStyle, css } from "styled-components";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";

import { EmptyLink } from "@ui/button/empty-link";
import { FlexCol, FlexRow } from "@ui/flex/flex";
import { OpenInANewTab } from "@ui/open-in-a-new-tab";

import { routes } from "../../routes/routes";
import { HeroImage } from "./hero-image";
import { Loader } from "./loader";

import MinistryOfScienceAndIctPng from "./assets/sponser-logos/ministry-of-science-and-ict.png";
import IITPPng from "./assets/sponser-logos/iitp.png";
import SamsungSoftwareMembershipPng from "./assets/sponser-logos/samsung-software-membership.png";
import HyundaiMobisPng from "./assets/sponser-logos/hyundai-mobis.png";
import HanbitMediaPng from "./assets/sponser-logos/hanbit-media.png";
import SolvedAcPng from "./assets/sponser-logos/solved-ac.png";
import StartlinkPng from "./assets/sponser-logos/startlink.png";
import SogangPng from "./assets/sponser-logos/sogang.png";
import SogangSwPng from "./assets/sponser-logos/sogang-sw.png";

const admissionUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSd98rqUwUR1FVs1JJm8VkI0DaMAeP22SVmed_vVK6cRE3Rodw/viewform?embedded=true";

const BodyStyles = createGlobalStyle`
  body {
    max-width: unset;
  }

  @media (max-width: 1000px) {
    html {
      font-size: 85%;
    }
  }

  @media (max-width: 800px) {
    html {
      font-size: 60%;
    }
  }
`;

const _LogoImg = ({
  className,
  src,
  alt,
}: {
  height?: string;
  className?: string;
  src: string;
  alt: string;
}) => {
  return (
    <div className={className}>
      <img src={src} alt={alt} />
    </div>
  );
};
const LogoImg = styled(_LogoImg).withConfig({
  shouldForwardProp: (prop) => !["height"].includes(prop),
})`
  ${({ height }) => css`
    height: ${height ?? "2.5rem"};
  `}

  img {
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`;

const GoBackIcon = styled(EmptyLink)`
  z-index: 1000;

  position: absolute;
  top: 2rem;
  left: 2.4rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;

  span {
    font-size: 1rem;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 0.3rem;
  }
`;

const SubTitle = styled.span`
  font-family: "sogang";
  font-size: 2rem;
`;
const Title = styled.span`
  font-family: "sogang";
  font-size: 4.4rem;

  word-break: keep-all;
  text-align: center;
`;
const TitleWrapper = styled(FlexCol)`
  align-items: center;
  margin-top: 2.4rem;
`;

const DateLocationWrapper = styled(FlexRow)`
  margin-top: 1.6rem;

  column-gap: 4rem;

  @media (max-width: 390px) {
    flex-direction: column;
    row-gap: 0.4rem;
  }
`;

const InfoLabel = styled.span`
  font-family: "Pretendard";
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  vertical-align: super;

  color: rgb(156, 133, 119);
`;
const InfoValue = styled.span`
  font-family: "Pretendard";
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: 1.4rem;
`;
const Label = styled.span`
  font-size: 1.4rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  text-align: center;
  margin-top: 4.4rem;
  margin-bottom: 1.2rem;

  @media (max-width: 800px) {
    font-size: 1.6rem;
  }
`;
const Sup = styled.span`
  vertical-align: super;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;
const LogoWrapper = styled(FlexRow).attrs({
  justifyContent: "center",
  alignItems: "center",
  columnGap: "4.2rem",
})``;
const OpenFormInNewTab = styled(OpenInANewTab)`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: gray;

  @media (max-width: 800px) {
    font-size: 1.2rem;
  }
`;
const IFrame = styled.iframe`
  display: block;

  margin: 0 auto;

  width: 740px;
  max-width: 100%;
`;
const _Spc24ApplyPage = ({ className }: { className?: string }) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const isMobile = useMediaQuery({
    query: "(max-width: 1100px)",
  });

  useEffect(() => {
    let animationId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      if (startTime) {
        const currentTime = timestamp - startTime;
        if (currentTime > 500) {
          startTime = timestamp;

          confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(() => {
      // Do not show confetti on mobile
      if (!isMobile) {
        animationId = requestAnimationFrame(animate);
      }
    }, 1_000);

    setTimeout(() => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        // @ts-expect-error
        canvas.style = "position:absolute; left:0; top:0;";
      }
    }, 2_000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  return (
    <div className={className}>
      <BodyStyles />
      <GoBackIcon to={routes.spc.path()}>
        <ArrowLeftIcon width={17} />
        <span>이전으로 돌아가기</span>
      </GoBackIcon>
      <HeroImage />
      <TitleWrapper>
        <SubTitle>2024 · 제 20회</SubTitle>
        <Title>서강대학교 프로그래밍 대회</Title>
      </TitleWrapper>
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
      <FlexCol>
        <Label>주최</Label>
        <LogoWrapper>
          <LogoImg src={SogangPng} alt="sogang" />
          <LogoImg src={SogangSwPng} alt="sogang-sw" />
        </LogoWrapper>
      </FlexCol>
      <FlexCol alignItems="center">
        <Label>스폰서</Label>
        <LogoWrapper style={{ marginBottom: "2rem" }}>
          <LogoImg
            src={MinistryOfScienceAndIctPng}
            alt="ministy-of-science-and-ict"
          />
          <LogoImg src={IITPPng} alt="iitp" />
        </LogoWrapper>
        {isMobile ? (
          <>
            <LogoWrapper style={{ marginBottom: "2rem" }}>
              <LogoImg
                src={SamsungSoftwareMembershipPng}
                alt="samsung-software-membership"
              />
              <LogoImg src={HyundaiMobisPng} alt="hyundai-mobis" />
              <LogoImg src={HanbitMediaPng} alt="hanbit-media" />
            </LogoWrapper>
            <LogoWrapper>
              <LogoImg src={SolvedAcPng} alt="solved-ac" />
              <LogoImg src={StartlinkPng} alt="startlink" />
            </LogoWrapper>
          </>
        ) : (
          <LogoWrapper>
            <LogoImg
              src={SamsungSoftwareMembershipPng}
              alt="samsung-software-membership"
            />
            <LogoImg src={HyundaiMobisPng} alt="hyundai-mobis" />
            <LogoImg src={HanbitMediaPng} alt="hanbit-media" />
            <LogoImg src={SolvedAcPng} alt="solved-ac" />
            <LogoImg src={StartlinkPng} alt="startlink" />
          </LogoWrapper>
        )}
      </FlexCol>
      <FlexCol style={{ width: "100%" }}>
        <Label>
          참가신청 <Sup>~11/3(일)까지</Sup>
          <br />
          <OpenFormInNewTab href={admissionUrl}>
            폼이 보이지 않나요?{" "}
            <ArrowTopRightOnSquareIcon style={{ width: "1rem" }} width={12} />
          </OpenFormInNewTab>
        </Label>
        <div style={{ position: "relative" }}>
          <AnimatePresence>
            {isIframeLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={["opacity"]}
                transition={{ duration: 0.8 }}
                exit={{
                  opacity: 0,
                }}
              >
                <Loader />
              </motion.div>
            )}
          </AnimatePresence>
          <IFrame
            src={admissionUrl}
            title="2024 SPC 신청"
            height={3327}
            scrolling="no"
            frameBorder={0}
            marginWidth={0}
            marginHeight={0}
            onLoad={() => setIsIframeLoading(false)}
          />
        </div>
      </FlexCol>
    </div>
  );
};

export const Spc24ApplyPage = styled(_Spc24ApplyPage)`
  ${HeroImage} {
    width: 28rem;
    max-width: 75%;
  }

  /* background-color: #e4e8ec; */

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 8rem 3.2rem;
`;
