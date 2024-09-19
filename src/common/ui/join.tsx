import { Fragment } from "react";

export const Join = ({
  items,
  separator,
}: {
  items: React.ReactNode[];
  separator: React.ReactNode;
}) => {
  return (
    <>
      {items.map((item, index) => {
        if (index === 0) {
          return <Fragment key={index}>{item}</Fragment>;
        }
        return (
          <Fragment key={index}>
            {separator}
            {item}
          </Fragment>
        );
      })}
    </>
  );
};
