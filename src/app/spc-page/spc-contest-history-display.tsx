import styled from "styled-components";

import { Section } from "@ui/section/section";
import { TAwardBadgeVariant } from "@ui/award-badge/award-badge";
import { AwardTable } from "@ui/award/award-table";
import { LinksAndReviews } from "@ui/award/links-and-reviews";
import { MedalIconDescriptions } from "@ui/award/medal-icon-descriptions";

import { useSelectedSpcHistoryContext } from "./contexts/selected-spc-history-context";

const _SpcContestHistoryDisplay = ({ className }: { className?: string }) => {
  const selectedHistory = useSelectedSpcHistoryContext();

  const showMedalIconDescriptions = selectedHistory.data.contests.length > 0;

  return (
    <div className={className}>
      {selectedHistory.data.contests.map(
        ({ title, columns, data, award, links }) => (
          <Section key={title}>
            <Section.Title>{title}</Section.Title>
            <Section.Body>
              <AwardTable
                columns={columns}
                data={data}
                award={award as unknown as TAwardBadgeVariant[]}
              />
              <LinksAndReviews links={links} review={[]} />
            </Section.Body>
          </Section>
        ),
      )}
      {showMedalIconDescriptions && <MedalIconDescriptions />}
    </div>
  );
};
export const SpcContestHistoryDisplay = styled(_SpcContestHistoryDisplay)``;
