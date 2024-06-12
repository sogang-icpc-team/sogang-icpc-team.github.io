import { styled } from "styled-components";

import { Page } from "@ui/page/page";
import { Section } from "@ui/section/section";
import { OpenInANewTab } from "@ui/open-in-a-new-tab";
import { LinkButton } from "@ui/button/link-button";
import { OpenInANewTabButton } from "@ui/button/open-in-a-new-tab-button";
import { ButtonWrapper } from "@ui/button/button-wrapper";

import { routes } from "../../routes/routes";
import ICPC2019RedshiftImage from "./assets/icpc2019-redshift.jpg";
import AcmSolvingImage from "./assets/acm-solving.jpg";

const HeroImage = styled.img`
  width: 100%;
  margin: 32px 0;
`;
const _IntroductionPage = ({ className }: { className?: string }) => {
  return (
    <Page className={className}>
      <Page.Title description="우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다.">
        소개
      </Page.Title>
      <Page.Body>
        <HeroImage src={ICPC2019RedshiftImage} alt="ICPC 2019 Redshift" />
        <Section>
          <Section.Title>이곳은</Section.Title>
          <Section.Body>
            컴퓨터과학과 소프트웨어 공학의 근간이 되는, 알고리즘을 공부하는
            서강대학교 컴퓨터공학과 학회입니다. 2005년에 이한승, 심재은, 김영욱
            동문께서 주축이 되어 ICPC 출전을 준비하기 위해 Sogang ACM-ICPC
            Team으로 시작해서, 지금은 ICPC 뿐만 아니라 Google Code Jam, SCPC,
            Kakao Code Festival 등 여러 대회에 참가하고 있습니다. 또한 교내
            대회인 Sogang Programming Contest를 주관하고 있습니다.
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>ICPC 참가</Section.Title>
          <Section.Body>
            <p>
              <OpenInANewTab href="https://icpckorea.org">ICPC</OpenInANewTab>
              (International Collegiate Programming Contest)는 국제 대학생
              프로그래밍 경시대회로, 가장 긴 역사를 가지고 있는 권위 있는
              프로그래밍 대회입니다. 학부생 3명이 한 팀을 구성해 참가해 제한된
              시간 내에 주어진 문제들을 프로그래밍으로 해결해야 합니다. 학회의
              이름에서 보이듯이 매년 이 대회에 참가하는 것이 학회 활동의 주 목적
              중 하나이기도 합니다.
            </p>
            <p>
              Sogang ICPC Team이 생긴 2007년부터 지금까지 매년 한국 지역 본선에
              꾸준히 참가해 왔고, 우수한 성적을 거두고 있습니다.
            </p>
            <ButtonWrapper>
              <LinkButton to={routes.history.path()}>참여 기록</LinkButton>
            </ButtonWrapper>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>프로그래밍 대회 참가</Section.Title>
          <Section.Body>
            <p>
              Google{" "}
              <OpenInANewTab href="https://codingcompetitions.withgoogle.com/codejam">
                Code Jam
              </OpenInANewTab>
              , 삼성
              <OpenInANewTab href="https://www.codeground.org">
                대학생 프로그래밍 경진대회
              </OpenInANewTab>
              (SCPC), Kakao
              <OpenInANewTab href="https://www.kakaocode.com">
                Code Festival
              </OpenInANewTab>{" "}
              등 여러 기업 주최 오프라인 대회에도 참가하고 있습니다.
            </p>
            <p>
              또한 전국 대학생 프로그래밍 대회 동아리 연합 (전대프연)
              <OpenInANewTab href="https://ucpc.me">
                프로그래밍 대회
              </OpenInANewTab>
              (UCPC) 등의 대회에도 참가하고 있습니다.
            </p>
            <ButtonWrapper>
              <LinkButton to={routes.history.path()}>참여 기록</LinkButton>
            </ButtonWrapper>
          </Section.Body>
        </Section>
        <HeroImage src={AcmSolvingImage} alt="acm solving" />
        <Section>
          <Section.Title>알고리즘 스터디</Section.Title>
          <Section.Body>
            <p>
              학회에 같이 모여서 알고리즘 공부를 합니다. 학회원들의 문제 해결
              능력을 업그레이드하기 위해 매 학기 알고리즘 스터디를 진행합니다.
            </p>
            <p>
              스터디는 수준에 따라 초급, 중급으로 나뉘어져 있고, 주로
              <OpenInANewTab>백준 온라인 저지</OpenInANewTab>
              에서 문제를 푸는 방식으로 진행됩니다. 학회원 누구나 자유롭게
              참여할 수 있습니다. 계절학기에도 쉬지 않고 진행합니다!
            </p>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>문제 해결</Section.Title>
          <Section.Body>
            <p>
              <OpenInANewTab href="https://www.acmicpc.net">
                백준 온라인 저지
              </OpenInANewTab>{" "}
              등의 온라인 저지에 있는 많은 문제들을 해결해 나갑니다. 또한{" "}
              <OpenInANewTab href="https://codeforces.com">
                Codeforces
              </OpenInANewTab>
              , <OpenInANewTab href="https://atcoder.jp">AtCoder</OpenInANewTab>{" "}
              등에서 주기적으로 열리는 많은 온라인 대회에도 꾸준히 참가하면서
              알고리즘 실력을 함께 키워나갑니다.
            </p>
            <ButtonWrapper>
              <OpenInANewTabButton href="https://www.acmicpc.net/school/ranklist/292">
                BOJ 랭킹
              </OpenInANewTabButton>
              <OpenInANewTabButton href="https://codeforces.com/ratings/organization/1637">
                Codeforces 랭킹
              </OpenInANewTabButton>
            </ButtonWrapper>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>SPC 주관</Section.Title>
          <Section.Body>
            <p>
              ICPC 한국 지역 본선 1, 2위 수상팀은 매년 열리는 교내 프로그래밍
              대회 Sogang Programming Contest를 주관합니다. 대회 전반을
              준비하고, 문제도 출제합니다.
            </p>
            <p>
              Sogang Programming Contest는 서강대학교 학부생이라면 누구나 참가할
              수 있습니다.
            </p>
            <ButtonWrapper>
              <LinkButton to="/spc">대회 정보</LinkButton>
            </ButtonWrapper>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>랩실 안내</Section.Title>
          <Section.Body>
            김대건관 컴퓨터공학과 실습실 K512를 이용, 관리하고 있습니다. <br />
            <ButtonWrapper>
              <LinkButton to="/contact">랩실 위치 안내</LinkButton>
            </ButtonWrapper>
          </Section.Body>
        </Section>
      </Page.Body>
    </Page>
  );
};
export const IntroductionPage = styled(_IntroductionPage)``;
