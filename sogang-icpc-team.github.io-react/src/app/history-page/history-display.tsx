import { styled } from "styled-components";

import { Section } from "@ui/section/section";
import { Table } from "@ui/table/table";
import { AwardBadge, TAwardBadgeVariant } from "@ui/award-badge/award-badge";
import { OpenInANewTab } from "@ui/open-in-a-new-tab";

import { useSelectedHistoryContext } from "./contexts/selected-history-context";

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;
const LinksWrapper = styled.ul`
  margin-top: 16px;
`;

const _HistoryDisplay = () => {
  const selectedHistory = useSelectedHistoryContext();

  return (
    <div>
      {selectedHistory.data.contests.map(
        ({ title, columns, data, award, links }) => (
          <Section key={title}>
            <Section.Title>{title}</Section.Title>
            <Section.Body>
              <TableWrapper>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      {columns.map((h, i) => (
                        <Table.Head key={i}>{h}</Table.Head>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data.map((r, rowIndex) => (
                      <Table.Row key={rowIndex}>
                        {r.map((c, colIndex) => {
                          // FIXME: data 형식을 string[] -> json으로 일괄 변경해야 함
                          if (colIndex === 1) {
                            return (
                              <Table.Cell key={colIndex}>
                                {c}
                                {award[rowIndex] ? (
                                  <AwardBadge
                                    variant={
                                      award[rowIndex] as TAwardBadgeVariant
                                    }
                                  />
                                ) : null}
                              </Table.Cell>
                            );
                          }
                          return <Table.Cell key={colIndex}>{c}</Table.Cell>;
                        })}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </TableWrapper>
              <LinksWrapper>
                {links?.map((link) => {
                  return (
                    <li key={link[1]}>
                      <OpenInANewTab href={link[1]}>{link[0]}</OpenInANewTab>
                    </li>
                  );
                })}
                {/* TODO: Show Review Table */}
              </LinksWrapper>
            </Section.Body>
          </Section>
        ),
      )}
    </div>
  );
};
export const HistoryDisplay = styled(_HistoryDisplay)``;
