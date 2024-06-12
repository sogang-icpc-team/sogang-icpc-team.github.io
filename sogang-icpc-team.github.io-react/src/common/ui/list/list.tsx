import styled from "styled-components";

const _List = ({
  className,
  items,
}: {
  className?: string;
  items: ({ label: React.ReactNode } | React.ReactNode)[];
}) => {
  return (
    <ul className={className}>
      {items.map((item) => {
        // FIXME: There's a typing issue |
        //  1. 'item' is possibly 'null' or 'undefined'
        //  2. Type 'string' is not assignable to type 'object'
        if (item && typeof item === "object" && "label" in item) {
          return <li>{item.label}</li>;
        }
        return <li>{item}</li>;
      })}
    </ul>
  );
};
export const List = styled(_List)`
  list-style-type: disc;

  margin-left: 16px;

  li {
    padding-bottom: 16px;

    &:last-child {
      padding-bottom: 0;
    }
  }
`;
