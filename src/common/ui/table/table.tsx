import { styled } from "styled-components";

import type {
  THTMLTableElementAttributes,
  THTMLTableHeaderElementAttributes,
  THTMLTableBodyElementAttributes,
  THTMLTrElementAttributes,
  THTMLThElementAttributes,
  THTMLTdElementAttributes,
} from "../../types/html-element-types";

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

const _TableRow = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLTrElementAttributes) => {
  return <tr {...htmlAttrs}>{children}</tr>;
};
export const TableRow = styled(_TableRow)``;

const _TableHead = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLThElementAttributes) => {
  return <th {...htmlAttrs}>{children}</th>;
};
export const TableHead = styled(_TableHead)`
  padding: 8px;
  text-align: center;
  vertical-align: top;

  border: 1px solid #ddd;
`;

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
  vertical-align: baseline;

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

const _TableBody = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLTableBodyElementAttributes) => {
  return <tbody {...htmlAttrs}>{children}</tbody>;
};
export const TableBody = styled(_TableBody)``;

const _TableHeader = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLTableHeaderElementAttributes) => {
  return <thead {...htmlAttrs}>{children}</thead>;
};
export const TableHeader = styled(_TableHeader)``;

const _Table = ({
  children,
  ...htmlAttrs
}: {
  children: React.ReactNode;
} & THTMLTableElementAttributes) => {
  return <table {...htmlAttrs}>{children}</table>;
};
export const Table = styled(_Table)`
  min-width: 800px;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
` as unknown as typeof _Table & {
  Wrapper: typeof TableWrapper;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
  Caption: typeof TableCaption;
};

Table.Wrapper = TableWrapper;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Caption = TableCaption;
