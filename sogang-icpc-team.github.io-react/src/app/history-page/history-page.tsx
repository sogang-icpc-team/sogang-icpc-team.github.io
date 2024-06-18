import styled from "styled-components";

import { Page } from "@ui/page/page";
import { Section } from "@ui/section/section";

import ScoreboardImage from "./assets/scoreboard.jpg";
import { HistoryTab } from "./history-tab";
import { useHistoryDataContext } from "../../contexts/history-data-context";
import { SelectedHistoryContextProvider } from "./contexts/selected-history-context";
import { HistoryDisplay } from "./history-display";

const HeroImage = styled.img`
  width: 100%;
  margin: 32px 0;
`;
const _HistoryPage = ({ className }: { className?: string }) => {
  const historyData = useHistoryDataContext();
  return (
    <Page className={className}>
      <Page.Title description="매년 여러 대회에 참가해 우수한 성적을 거두고 있습니다.">
        기록
      </Page.Title>
      <Page.Body>
        <HeroImage src={ScoreboardImage} alt="scoreboard" />
        <Section>
          <Section.Body>
            <SelectedHistoryContextProvider
              historyDataset={historyData.all}
              initialValue={{ year: 2024 }}
            >
              <HistoryTab
                items={historyData.years
                  .reverse()
                  .map((y) => ({ label: y, value: y }))}
              />
              <HistoryDisplay />
            </SelectedHistoryContextProvider>
          </Section.Body>
        </Section>
      </Page.Body>
    </Page>
  );
};
export const HistoryPage = styled(_HistoryPage)``;
