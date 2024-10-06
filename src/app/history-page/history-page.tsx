import styled from "styled-components";

import { Page } from "@ui/page/page";
import { Section } from "@ui/section/section";
import { YearSelectorDropdown } from "@ui/dropdown/year-selector-dropdown";
import { MedalIconDescriptions } from "@ui/award/medal-icon-descriptions";

import ScoreboardImage from "./assets/scoreboard.jpg";
import { useHistoryDataContext } from "../../contexts/history-data-context";
import {
  SelectedHistoryContextProvider,
  useSelectedHistoryContext,
} from "./contexts/selected-history-context";
import { HistoryDisplay } from "./history-display/history-display";
import constants from "../../contexts/assets/constants";

const YearDropdown = () => {
  const { year, setYear } = useSelectedHistoryContext();
  const historyData = useHistoryDataContext();
  return (
    <YearSelectorDropdown
      year={year}
      setYear={setYear}
      items={historyData.years.reverse().map((y) => ({ label: y, value: y }))}
    />
  );
};

const GrayText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.gray[500]};

  margin-top: 24px;
`;
const HeroImage = styled.img`
  width: 100%;
  margin: 32px 0;
`;
const _HistoryPage = ({ className }: { className?: string }) => {
  return (
    <Page className={className}>
      <Page.Title description="매년 여러 대회에 참가해 우수한 성적을 거두고 있습니다.">
        기록
      </Page.Title>
      <HeroImage src={ScoreboardImage} alt="scoreboard" />
      <Page.Body>
        <SelectedHistoryContextProvider initialValue={{ year: 2024 }}>
          <Section>
            <Section.Title>
              <span>연도별 대회 기록</span>
              <YearDropdown />
            </Section.Title>
            <Section.Body>
              <HistoryDisplay />
              <MedalIconDescriptions />
              <GrayText>
                *2019년 이전의 기록에는 누락된 정보가 있을 수 있습니다.
                <br />
                *정보 등록 및 수정 요청은 {constants.emailAddress}로 메일
                부탁드립니다.
              </GrayText>
            </Section.Body>
          </Section>
        </SelectedHistoryContextProvider>
      </Page.Body>
    </Page>
  );
};

export const HistoryPage = styled(_HistoryPage)`
  ${Section.Title} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
