import { styled } from "styled-components";

import { Section } from "@ui/section/section";

import { useSelectedHistoryContext } from "../contexts/selected-history-context";
import { AwardTable } from "@ui/award/award-table";
import { LinksAndReviews } from "@ui/award/links-and-reviews";
import { TAwardBadgeVariant } from "@ui/award-badge/award-badge";

const _HistoryDisplay = ({ className }: { className?: string }) => {
  const selectedHistory = useSelectedHistoryContext();

  return (
    <div className={className}>
      {selectedHistory.data.contests.map(
        ({ title, columns, data, award, links, review }) => (
          <Section key={title}>
            <Section.Title>{title}</Section.Title>
            <Section.Body>
              <AwardTable
                columns={columns}
                data={data}
                award={award as unknown as TAwardBadgeVariant[]}
              />
              <LinksAndReviews links={links} review={review} />
            </Section.Body>
          </Section>
        ),
      )}
    </div>
  );
};
export const HistoryDisplay = styled(_HistoryDisplay)`
  ${Section.Title} {
    font-size: 1.2rem !important;
  }
`;
