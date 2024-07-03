import styled, { createGlobalStyle, css } from "styled-components";
import { Dropdown } from "antd";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { EmptyButton } from "@ui/button/empty-button";

import { useSelectedHistoryContext } from "./contexts/selected-history-context";

const _Item = ({
  className,
  label,
}: {
  className?: string;
  label: React.ReactNode;
  selected: boolean;
}) => {
  return <li className={className}>{label}</li>;
};
const Item = styled(_Item)`
  width: fit-content;

  font-size: 1.6rem;
  letter-spacing: -1px;
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

const DropdownTriggerButton = styled(EmptyButton)`
  align-items: baseline;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem 0.2rem 0.8rem;
  border: 2px solid #a5a5a5;

  font-size: 1.6rem;
  letter-spacing: -1px;
  cursor: pointer;
  color: black;
  font-weight: bold;

  transition: 0.3s color ease;
`;
const DropdownStyles = createGlobalStyle`
  .ant-dropdown-menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    &-item{
      justify-content: center;
    }
  }
`;
const _HistoryTab = ({
  className,
  items,
}: {
  className?: string;
  items: { label: React.ReactNode; value: any }[];
}) => {
  const { year, setYear } = useSelectedHistoryContext();

  return (
    <ul className={className}>
      <DropdownStyles />
      <Dropdown
        placement="bottomLeft"
        trigger={["click"]}
        menu={{
          items: items.map((item) => ({
            key: item.value,
            onClick: () => setYear(item.value),
            label: <Item selected={year === item.value} label={item.label} />,
          })),
        }}
        children={
          <DropdownTriggerButton
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <span>{year}</span>
            <ChevronDownIcon width={20} color="#A5A5A5" />
          </DropdownTriggerButton>
        }
      />
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
