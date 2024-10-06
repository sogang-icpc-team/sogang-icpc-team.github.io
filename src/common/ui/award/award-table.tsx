import { Table } from "@ui/table/table";
import { AwardBadge, TAwardBadgeVariant } from "@ui/award-badge/award-badge";
import { CSSProperties } from "react";

const columnStyle = (headerContent: string): CSSProperties | undefined => {
  if (headerContent === "#") {
    return { width: "6em" };
  }
  if (headerContent === "=") {
    return { width: "6em" };
  }
  return undefined;
};

export const AwardTable = ({
  columns,
  data,
  award,
}: {
  columns: string[];
  data: string[][];
  award: TAwardBadgeVariant[];
}) => {
  return (
    <Table.Wrapper>
      <Table>
        <Table.Header>
          <Table.Row>
            {columns.map((h, i) => (
              <Table.Head key={i} style={columnStyle(h)}>
                {h}
              </Table.Head>
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
                        <AwardBadge variant={award[rowIndex]} />
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
    </Table.Wrapper>
  );
};
