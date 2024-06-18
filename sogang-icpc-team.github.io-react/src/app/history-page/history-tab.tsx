import { useState } from "react";
import styled, { css } from "styled-components";
import { useSelectedHistoryContext } from "./contexts/selected-history-context";

const _Item = ({
  className,
  label,
  onClick,
}: {
  className?: string;
  label: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <li className={className} onClick={onClick}>
      {label}
    </li>
  );
};
const Item = styled(_Item)`
  width: fit-content;
  margin-right: 16px;

  font-size: 2rem;
  color: #ddd;
  cursor: pointer;

  transition: 0.3s color ease;

  ${({ selected }) => {
    if (selected) {
      return css`
        color: #000;
        font-weight: bold;
      `;
    }
  }}
`;

const _HistoryTab = ({
  className,
  items,
}: {
  className?: string;
  items: { label: React.ReactNode; value: any }[];
}) => {
  const { year, setYear } = useSelectedHistoryContext();
  // const [selected, setSelected] = useState(selectedHistory.year);

  return (
    <ul className={className}>
      {items.map((item) => (
        <Item
          key={item.value}
          selected={year === item.value}
          label={item.label}
          onClick={() => setYear(item.value)}
        />
      ))}
    </ul>
  );
};

export const HistoryTab = styled(_HistoryTab)`
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }

  &::-webkit-scrollbar-thumb {
    background: #eee;

    &:hover {
      background: #eee;
    }
  }
`;
