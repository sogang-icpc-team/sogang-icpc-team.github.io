import styled from "styled-components";

import { OpenInANewTabButton } from "@ui/button/open-in-a-new-tab-button";
import { FlexRow } from "@ui/flex/flex";

import { useSelectedSpcHistoryContext } from "./contexts/selected-spc-history-context";

const Bold = styled.span`
  font-weight: bold;
`;
/**
 * TODO: Improve styles
 */
export const SpcSummary = () => {
  const {
    data: { edition, date, time, location, authors, links },
  } = useSelectedSpcHistoryContext();
  return (
    <p>
      <Bold>{edition} Sogang Programming Contest</Bold>
      <br />
      {date} {time}
      <br />
      {location}
      <br />
      {authors.length > 0 && `출제 - ${authors.join(", ")}`}
      <FlexRow alignItems="center" columnGap="8px" style={{ marginTop: 12 }}>
        {links.problems.workbookBOJ ? (
          <>
            <OpenInANewTabButton
              href={links.problems.workbookBOJ.Challenger}
              children="BOJ 문제 (Challenger)"
            />
            <OpenInANewTabButton
              href={links.problems.workbookBOJ.Champion}
              children="BOJ 문제 (Champion)"
            />
          </>
        ) : null}
        {links.scoreboards ? (
          <>
            <OpenInANewTabButton
              href={links.scoreboards.Master}
              children="스코어보드 (Master)"
            />
            <OpenInANewTabButton
              href={links.scoreboards.Champion}
              children="스코어보드 (Champion)"
            />
          </>
        ) : null}
        {links.problems.BOJ ? (
          <OpenInANewTabButton
            href={links.problems.BOJ}
            children="문제 (BOJ)"
          />
        ) : null}
        {links.problems.PDF ? (
          <>
            <OpenInANewTabButton
              href={links.problems.PDF.Master}
              children="문제 (PDF)"
            />
            <OpenInANewTabButton
              href={links.problems.PDF.Champion}
              children="문제 (PDF)"
            />
          </>
        ) : null}
        {links.solutions ? (
          <OpenInANewTabButton
            href={links.solutions.PDF}
            children="해설 (PDF)"
          />
        ) : null}
      </FlexRow>
    </p>
  );
};
