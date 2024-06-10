import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { Page } from "@ui/page/page";

import ICPCWF21Image from "./assets/21-icpc-wf-1.jpg";
import { Section } from "@ui/section/section";

const HeroTitle = styled.div`
  font-size: 4rem;
  font-weight: bold;
  letter-spacing: -0.05ch;
  line-height: 0.9;
  margin-bottom: 32px;
`;
const HeroDescription = styled.div``;
const HeroImage = styled.img`
  width: 100%;
  margin: 32px 0;
`;
const Hr = styled.hr`
  border: unset;
  margin: 32px 64px;
  border-bottom: 1px dashed #ddd !important;

  ${({ theme }) => theme.breakpoints.mobile} {
    margin: 32px 32px;
  }
`;
const P25 = styled.div`
  font-size: 1rem;

  ${({ theme }) => theme.breakpoints.mobile} {
    padding-right: 0;
    margin-bottom: 32px;
  }
`;
const P75 = styled.div`
  font-size: 1rem;
`;
const IconLink = styled(Link)`
  display: inline-flex;
  align-items: center;

  vertical-align: baseline;
`;
const ArrowRight = styled(ArrowRightIcon)`
  width: 1.6rem;

  font-size: inherit;
  line-height: inherit;

  color: ${({ theme }) => theme.color.primary};
`;
const _MainPage = ({ className }: { className?: string }) => {
  return (
    <Page className={className}>
      <Page.Body>
        <Section>
          <HeroTitle>
            Make it.
            <br />
            Solve it.
          </HeroTitle>
          <HeroDescription>
            Sogang ICPC Team —<br />
            서강대학교 컴퓨터공학과 알고리즘 문제해결 학회
            <br />
          </HeroDescription>
        </Section>
        <HeroImage src={ICPCWF21Image} alt="21 ICPC World Finals" />
        <Section>
          <Section.Title>소개</Section.Title>
          <P75>
            <h1>
              우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다.{" "}
              <IconLink to="/introduction">
                <ArrowRight />
              </IconLink>
            </h1>
          </P75>
        </Section>
        <Hr />
        <Section>
          <Section.Title>기록</Section.Title>
          <P75>
            <h1>
              매년 여러 대회에 참가해 우수한 성적을 거두고 있습니다.{" "}
              <IconLink to="/history">
                <ArrowRight />
              </IconLink>
            </h1>
          </P75>
        </Section>
        <Hr />
        <Section>
          <Section.Title>Sogang Programming Contest</Section.Title>
          <P75>
            <h1>
              논리력과 문제 해결 능력을 겨루는 대회입니다.{" "}
              <IconLink to="/spc">
                <ArrowRight />
              </IconLink>
            </h1>
          </P75>
        </Section>
        <Hr />
        <Section>
          <Section.Title>가입 및 문의</Section.Title>
          <P75>
            <h1>
              서강대학교 학부생이라면 누구나 함께할 수 있습니다.{" "}
              <IconLink to="/contact">
                <ArrowRight />
              </IconLink>
            </h1>
          </P75>
        </Section>
      </Page.Body>
    </Page>
  );
};
export const MainPage = styled(_MainPage)`
  h1 {
    font-size: 2rem !important;
    font-weight: bold;
    letter-spacing: -0.07ch;
  }
  h2 {
    font-size: 1.4rem !important;
    font-weight: bold;
    color: ${({ theme }) => theme.color.primary};
  }
`;
