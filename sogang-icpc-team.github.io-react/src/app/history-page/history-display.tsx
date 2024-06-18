import { styled } from "styled-components";

import { Section } from "@ui/section/section";
import { Table } from "@ui/table/table";

import { useSelectedHistoryContext } from "./contexts/selected-history-context";

const _HistoryDisplay = () => {
  const selectedHistory = useSelectedHistoryContext();

  return (
    <div>
      {selectedHistory.data.contests.map(
        ({ title, columns, data, award, links }) => (
          <Section key={title}>
            <Section.Title>{title}</Section.Title>
            <Section.Body>
              <Table>
                <Table.Header>
                  <Table.Row>
                    {columns.map((h, i) => (
                      <Table.Head key={i}>{h}</Table.Head>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.map((r, i) => (
                    <Table.Row key={i}>
                      {r.map((c, i) => (
                        <Table.Cell key={i}>{c}</Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Section.Body>
          </Section>
        ),
      )}
    </div>
  );
};
export const HistoryDisplay = styled(_HistoryDisplay)``;
