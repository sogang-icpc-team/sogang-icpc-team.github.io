import { styled } from "styled-components";

import { EmptyLink } from "./empty-link";
import { type TButtonProps } from "./button";

const _EmptyButton = ({ to, ...props }: TButtonProps & { to?: string }) => {
  if (to) {
    return (
      <EmptyLink to={to}>
        <button {...props} />
      </EmptyLink>
    );
  }
  return <button {...props} />;
};

export const EmptyButton = styled(_EmptyButton)`
  display: inline-flex;

  background: unset;
  border: unset;
  padding: unset;

  cursor: pointer !important;
`;
