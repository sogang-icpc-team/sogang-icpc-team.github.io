import React from "react";

export type THTMLButtonElementAttributes = Omit<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "ref"
>;

export type THTMLTableElementAttributes = Omit<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >,
  "ref"
>;

export type THTMLTrElementAttributes = Omit<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >,
  "ref"
>;

export type THTMLTdElementAttributes = Omit<
  React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >,
  "ref"
>;

export type THTMLThElementAttributes = Omit<
  React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableHeaderCellElement
  >,
  "ref"
>;

export type THTMLDivElementAttributes = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "ref"
>;
