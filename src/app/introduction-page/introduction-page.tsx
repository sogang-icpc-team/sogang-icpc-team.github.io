import _ from "lodash";
import { Fragment } from "react";
import { styled } from "styled-components";

import { Page } from "@ui/page/page";
import { Section } from "@ui/section/section";
import { OpenInANewTab } from "@ui/open-in-a-new-tab";
import { LinkButton } from "@ui/button/link-button";
import { OpenInANewTabButton } from "@ui/button/open-in-a-new-tab-button";
import { ButtonWrapper } from "@ui/button/button-wrapper";
import { Table } from "@ui/table/table";

import { routes } from "../../routes/routes";
import { useOrganizerDataContext } from "../../contexts/organizer-data-context";
import ICPC2019RedshiftImage from "./assets/icpc2019-redshift.jpg";
import AcmSolvingImage from "./assets/acm-solving.jpg";
import { Join } from "@ui/join";

const EmailLinkCell = styled(Table.Cell)`
  white-space: break-spaces;
`;
const OrganizersTable = styled(Table)`
  th,
  td {
    vertical-align: middle;
  }
`;
const YearTableCell = styled(Table.Cell)`
  font-weight: bold;
  vertical-align: middle;
`;
const HeroImage = styled.img`
  width: 100%;
  margin: 32px 0;
`;
const _IntroductionPage = ({ className }: { className?: string }) => {
  const { all: organizerDatas } = useOrganizerDataContext();
  return (
    <Page className={className}>
      <Page.Title description="우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다.">
        소개
      </Page.Title>
      <HeroImage src={ICPC2019RedshiftImage} alt="ICPC 2019 Redshift" />
      <Page.Body>
        <Section>
          <Section.Title>이곳은</Section.Title>
          <Section.Body>
            <p>
              Sogang ICPC Team은 컴퓨터과학과 소프트웨어 공학의 근간이 되는
              알고리즘을 공부하는 학회입니다.
              <br />
              2005년 이한승, 심재은, 김영욱 동문께서 ICPC 출전을 준비하기 위해
              활동을 시작하여, 현재는 ICPC뿐만 아니라 Google Code Jam, SCPC,
              Kakao Code Festival 등 다양한 대회에 참가하고 있습니다.
              <br />
              또한 교내 프로그래밍 대회인 Sogang Programming Contest를 주관하고
              있습니다.
            </p>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>ICPC 참가</Section.Title>
          <Section.Body>
            <p>
              <OpenInANewTab href="https://icpckorea.org">ICPC</OpenInANewTab>
              (International Collegiate Programming Contest)는 국제 대학생
              프로그래밍 경시대회로, 가장 긴 역사를 가지고 있는 권위 있는
              프로그래밍 대회입니다.
              <br />
              학부생 3명이 한 팀을 구성하여 대회에 참가하며, 제한된 시간 내에
              주어진 문제들을 빠르고 정확하게 해결해야 합니다.
            </p>
            <br />
            <p>
              매년 이 대회에 참가하여 수상하는 것이 본 학회의 목표 중 하나이며,
              활동이 시작된 2005년부터 지금까지 매년 한국 지역 본선에 꾸준히
              참가하여 우수한 성적을 거두고 있습니다.
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
              <OpenInANewTab href="https://codingcompetitionsonair.withgoogle.com/#code-jam">
                Google Code Jam
              </OpenInANewTab>
              ,{" "}
              <OpenInANewTab href="https://research.samsung.com/scpc">
                삼성 대학생 프로그래밍 경진대회
              </OpenInANewTab>
              (SCPC),{" "}
              <OpenInANewTab href="https://www.kakaocode.com">
                Kakao Code Festival
              </OpenInANewTab>{" "}
              등 여러 기업 주최 오프라인 대회에도 참가하고 있습니다.
            </p>
            <p>
              또한{" "}
              <OpenInANewTab href="https://icpc-sinchon.io/suapc">
                신촌지역 대학교 프로그래밍 동아리 연합 대회
              </OpenInANewTab>
              (SUAPC) ,{" "}
              <OpenInANewTab href="https://ucpc.me">
                전국 대학생 프로그래밍 대회 동아리 연합(전대프연) 프로그래밍
                대회
              </OpenInANewTab>
              (UCPC) 등의 다양한 대학교 연합 대회에도 참가하고 있습니다.
            </p>
            <ButtonWrapper>
              <LinkButton to={routes.history.path()}>참여 기록</LinkButton>
            </ButtonWrapper>
          </Section.Body>
        </Section>
      </Page.Body>
      <HeroImage src={AcmSolvingImage} alt="acm solving" />
      <Page.Body>
        <Section>
          <Section.Title>알고리즘 스터디</Section.Title>
          <Section.Body>
            <p>
              학회에 같이 모여서 알고리즘 공부를 합니다. 학회원들의 문제 해결
              능력을 업그레이드하기 위해 매 학기 알고리즘 스터디를 진행합니다.
            </p>
            <p>
              스터디는 수준에 따라 초급, 중급으로 나뉘어져 있고, 주로{" "}
              <OpenInANewTab href="https://acmicpc.net">
                백준 온라인 저지
              </OpenInANewTab>
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
              </OpenInANewTab>
              를 비롯한 다양한 온라인 저지에서 문제를 해결하며 알고리즘
              문제해결능력을 향상시킵니다.
              <br />
              또한{" "}
              <OpenInANewTab href="https://codeforces.com">
                Codeforces
              </OpenInANewTab>
              , <OpenInANewTab href="https://atcoder.jp">AtCoder</OpenInANewTab>{" "}
              등의 국제 온라인 저지 플랫폼에서 정기적으로 열리는 온라인 대회에도
              꾸준히 참가하여 우수한 성적을 거두고 있습니다.
            </p>
            <ButtonWrapper>
              <OpenInANewTabButton href="https://www.acmicpc.net/school/ranklist/292">
                서강대학교 BOJ 랭킹
              </OpenInANewTabButton>
              <OpenInANewTabButton href="https://codeforces.com/ratings/organization/1637">
                서강대학교 Codeforces 랭킹
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
        <Section>
          <Section.Title>역대 운영진</Section.Title>
          <Section.Body>
            <Table.Wrapper>
              <OrganizersTable>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>연도</Table.Head>
                    <Table.Head>이름</Table.Head>
                    <Table.Head>직책</Table.Head>
                    <Table.Head>BOJ 핸들</Table.Head>
                    <Table.Head>비고</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {organizerDatas.map(({ year, president, vicePresident }) => {
                    const rowSpan = president && vicePresident ? 2 : 1;
                    return (
                      <Fragment key={year}>
                        <Table.Row>
                          <YearTableCell rowSpan={rowSpan}>
                            {year}
                          </YearTableCell>
                          <Table.Cell>{president.name}</Table.Cell>
                          <Table.Cell>학회장</Table.Cell>
                          <Table.Cell>
                            <OpenInANewTab
                              href={`https://www.acmicpc.net/user/${president.boj}`}
                            >
                              {president.boj}
                            </OpenInANewTab>
                          </Table.Cell>
                          <EmailLinkCell>
                            <Join
                              items={_.compact([
                                president.email ? (
                                  <OpenInANewTab
                                    href={`mailto:${president.email}`}
                                  >
                                    {president.email}
                                  </OpenInANewTab>
                                ) : null,
                                president.link ? (
                                  <OpenInANewTab href={president.link}>
                                    {president.link}
                                  </OpenInANewTab>
                                ) : null,
                              ])}
                              separator={<br />}
                            />
                          </EmailLinkCell>
                        </Table.Row>
                        {vicePresident ? (
                          <Table.Row>
                            <Table.Cell>{vicePresident.name}</Table.Cell>
                            <Table.Cell>부학회장</Table.Cell>
                            <Table.Cell>
                              <OpenInANewTab
                                href={`https://www.acmicpc.net/user/${vicePresident.boj}`}
                              >
                                {vicePresident.boj}
                              </OpenInANewTab>
                            </Table.Cell>
                            <EmailLinkCell>
                              <Join
                                items={_.compact([
                                  vicePresident.email ? (
                                    <OpenInANewTab
                                      href={`mailto:${vicePresident.email}`}
                                    >
                                      {vicePresident.email}
                                    </OpenInANewTab>
                                  ) : null,
                                  vicePresident.link ? (
                                    <OpenInANewTab href={vicePresident.link}>
                                      {vicePresident.link}
                                    </OpenInANewTab>
                                  ) : null,
                                ])}
                                separator={<br />}
                              />
                            </EmailLinkCell>
                          </Table.Row>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </Table.Body>
              </OrganizersTable>
            </Table.Wrapper>
          </Section.Body>
        </Section>
      </Page.Body>
    </Page>
  );
};
export const IntroductionPage = styled(_IntroductionPage)``;
