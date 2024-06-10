import { styled } from "styled-components";

import {
  THTMLTableElementAttributes,
  THTMLTdElementAttributes,
  THTMLTrElementAttributes,
} from "../../types/html-element-types";

const _TableRow = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLTrElementAttributes) => {
  return <tr {...htmlAttrs}>{children}</tr>;
};
export const TableRow = styled(_TableRow)``;

const _TableCell = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLTdElementAttributes) => {
  return <td {...htmlAttrs}>{children}</td>;
};
export const TableCell = styled(_TableCell)`
  padding: 8px;
  text-align: center;
  vertical-align: top;

  border: 1px solid #ddd;
`;

const _TableCaption = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <caption className={className}>{children}</caption>;
};
export const TableCaption = styled(_TableCaption)`
  font-weight: bold;
`;

const _Table = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLTableElementAttributes) => {
  return <table {...htmlAttrs}>{children}</table>;
};
export const Table = styled(_Table)`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
` as unknown as typeof _Table & {
  Row: typeof TableRow;
  Cell: typeof TableCell;
  Caption: typeof TableCaption;
};

Table.Row = TableRow;
Table.Cell = TableCell;
Table.Caption = TableCaption;
