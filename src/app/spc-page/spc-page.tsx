import styled from "styled-components";

import { Page } from "@ui/page/page";
import { Section } from "@ui/section/section";
import { OpenInANewTab } from "@ui/open-in-a-new-tab";
import { List } from "@ui/list/list";
import { Table } from "@ui/table/table";
import { YearSelectorDropdown } from "@ui/dropdown/year-selector-dropdown";

import SpcPostersImage from "./assets/spc-posters.jpg";
import Spc2019Image from "./assets/spc2019.jpg";
import {
  SelectedSpcHistoryContextProvider,
  useSelectedSpcHistoryContext,
} from "./contexts/selected-spc-history-context";
import { useSpcDataContext } from "../../contexts/spc-data-context";
import { SpcContestHistoryDisplay } from "./spc-contest-history-display";
import constants from "../../contexts/assets/constants";
import { SpcSummary } from "./spc-summary";
// import { Spc24Banner } from "./spc-24-banner";

const YearDropdown = () => {
  const { year, setYear } = useSelectedSpcHistoryContext();
  const spcData = useSpcDataContext();
  return (
    <YearSelectorDropdown
      year={year}
      setYear={setYear}
      items={spcData.years.reverse().map((y) => ({ label: y, value: y }))}
    />
  );
};

const GrayText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.gray[500]};

  margin-top: 24px;
`;
const CorrectText = styled.span`
  font-weight: bold;
  color: #009874;
`;
const HeroImage = styled.img`
  width: 100%;
  margin: 32px 0;
`;
const AdditionalInfo = styled.p`
  margin-top: 16px;
  color: gray;

  font-size: 0.9rem;
`;
const _SpcPage = ({ className }: { className?: string }) => {
  return (
    <Page className={className}>
      {/* <Spc24Banner /> */}
      <Page.Title description="논리력과 문제 해결 능력을 겨루는 대회입니다.">
        Sogang Programming Contest (SPC)
      </Page.Title>
      <Page.Body>
        <Section>
          <Section.Title>SPC 소개</Section.Title>
          <Section.Body>
            Sogang Programming Contest(SPC)는 서강대학교 학부생을 위한
            프로그래밍 대회입니다. 참가자는 알고리즘 설계 능력과 논리적 사고를
            통해 주어진 문제를 프로그래밍 언어로 해결해야 합니다. 프로그래밍에
            대한 관심 촉구 및 문제 해결 능력과 컴퓨팅 사고력의 향상을 위한
            대회로 2005년부터 개최되었습니다.
          </Section.Body>
        </Section>
      </Page.Body>
      <HeroImage src={Spc2019Image} alt="SPC 2019" />
      <Page.Body>
        <Section>
          <Section.Title>개요</Section.Title>
          <Section.Body>
            <p>
              대회는 3시간 동안 진행되며 난이도에 따라 Master와 Champion
              Division으로 나누어 진행됩니다.
              <br />
              논리적인 사고력과 알고리즘 작성 능력을 평가하는 ICPC 유형의 문제가
              출제되며, 대회 참가자들은 각 Division에서 총 8문제를 풀게 됩니다.
            </p>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>참가</Section.Title>
          <Section.Body>
            대학원생과 휴학생을 제외한 모든 서강대학교 학부생이 참가할 수
            있으며, Champion에는 모든 학생, Master에는 4학기 이하 학생만이
            참가할 수 있습니다.
            <br />
            단, Champion 대상, 금상 수상자는 다음 해부터 참가할 수 없고, Master
            금상 수상자는 다음 해부터 Master에 참가할 수 없습니다.
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>규칙</Section.Title>
          <Section.Body>
            <p>
              대회 중 제출한 소스코드는 채점 서버에 의해 자동으로 채점되며,
              실시간으로 결과를 알 수 있습니다. 코드를 제출하였을 때{" "}
              <CorrectText>맞았습니다!!</CorrectText>를 받으면 문제를 푼 것으로,
              이외의 결과를 받으면 틀린 것으로 간주합니다.
            </p>
            <p>
              문제를 풀 때마다 패널티 점수가 누적됩니다. 패널티 점수는 모든 맞은
              문제에 대해, 대회 시작 시간부터 그 문제를 풀기까지 걸린 시간을{" "}
              <i>t</i>분, 처음으로 문제를 맞기 직전까지 제출한 횟수를
              <i>w</i>번이라고 할 때 (<i>t</i> + 20<i>w</i>)점입니다.
            </p>
            <p>
              순위는 푼 문제가 많은 순서대로, 푼 문제 수가 같을 경우에는 패널티
              점수의 합이 적은 순서대로 결정됩니다.
            </p>
            <br />
            <p>
              대회는{" "}
              <OpenInANewTab href="https://www.acmicpc.net">
                Baekjoon Online Judge
              </OpenInANewTab>{" "}
              플랫폼에서 진행되며, 채점 관련 규칙은 BOJ의{" "}
              <OpenInANewTab href="https://www.acmicpc.net/help/judge">
                채점 도움말
              </OpenInANewTab>
              ,{" "}
              <OpenInANewTab href="https://www.acmicpc.net/help/language">
                언어 도움말
              </OpenInANewTab>
              을 참조합니다.
            </p>
            <p>모든 문제는 출제진이 C++로 정답을 작성했음이 보장됩니다.</p>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>사용 가능 언어</Section.Title>
          <Section.Body>
            <List items={["C", "C++", "Java", "Kotlin", "Python3(Pypy3)"]} />
            <AdditionalInfo>
              *사용 가능 언어 목록은 변경될 수 있습니다.
            </AdditionalInfo>
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>주의사항</Section.Title>
          <Section.Body>
            <List
              items={[
                "대회 중 각 언어의 레퍼런스 페이지를 제외한 인터넷 사용은 금지됩니다.",
                "대회 종료 전에 퇴실할 수 없습니다.",
                "책이나 개인이 준비한 인쇄된 참고자료는 지참할 수 있습니다.",
                "휴대폰 및 전자기기는 사용할 수 없습니다.",
              ]}
            />
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>시상</Section.Title>
          <Section.Body>
            <Table.Wrapper>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Division</Table.Head>
                    <Table.Head>상</Table.Head>
                    <Table.Head>인원</Table.Head>
                    <Table.Head>상금</Table.Head>
                    <Table.Head>총액</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell rowSpan={4} style={{ verticalAlign: "middle" }}>
                      Champion
                    </Table.Cell>
                    <Table.Cell>대상</Table.Cell>
                    <Table.Cell>1명</Table.Cell>
                    <Table.Cell>₩700,000</Table.Cell>
                    <Table.Cell>₩700,000</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>금상</Table.Cell>
                    <Table.Cell>1명</Table.Cell>
                    <Table.Cell>₩500,000</Table.Cell>
                    <Table.Cell>₩500,000</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>은상</Table.Cell>
                    <Table.Cell>2명</Table.Cell>
                    <Table.Cell>₩300,000</Table.Cell>
                    <Table.Cell>₩600,000</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>동상</Table.Cell>
                    <Table.Cell>3명</Table.Cell>
                    <Table.Cell>₩200,000</Table.Cell>
                    <Table.Cell>₩600,000</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell rowSpan={3} style={{ verticalAlign: "middle" }}>
                      Master
                    </Table.Cell>
                    <Table.Cell>금상</Table.Cell>
                    <Table.Cell>1명</Table.Cell>
                    <Table.Cell>₩500,000</Table.Cell>
                    <Table.Cell>₩500,000</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>은상</Table.Cell>
                    <Table.Cell>2명</Table.Cell>
                    <Table.Cell>₩300,000</Table.Cell>
                    <Table.Cell>₩600,000</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>동상</Table.Cell>
                    <Table.Cell>3명</Table.Cell>
                    <Table.Cell>₩200,000</Table.Cell>
                    <Table.Cell>₩600,000</Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Row>
                  <Table.Cell colSpan={2}>합계</Table.Cell>
                  <Table.Cell>13명</Table.Cell>
                  <Table.Cell colSpan={2}>₩4,100,000</Table.Cell>
                </Table.Row>
              </Table>
            </Table.Wrapper>
          </Section.Body>
        </Section>
      </Page.Body>
      <HeroImage src={SpcPostersImage} alt="SPC Posters" />
      <Page.Body>
        <SelectedSpcHistoryContextProvider initialValue={{ year: 2024 }}>
          <Section>
            <Section.Title>
              <span>연도별 대회 기록</span>
              <YearDropdown />
            </Section.Title>
            <Section.Body>
              <SpcSummary />
              <SpcContestHistoryDisplay />
              <GrayText>
                *2019년 이전의 기록에는 누락된 정보가 있을 수 있습니다.
                <br />
                *정보 등록 및 수정 요청은 {constants.emailAddress}로 메일
                부탁드립니다.
              </GrayText>
            </Section.Body>
          </Section>
        </SelectedSpcHistoryContextProvider>
      </Page.Body>
    </Page>
  );
};
export const SpcPage = styled(_SpcPage)`
  ${Section.Title} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
