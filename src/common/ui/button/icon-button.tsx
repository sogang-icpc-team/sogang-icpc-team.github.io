import { styled } from "styled-components";
import { EmptyButton } from "./empty-button";

const _IconButton = ({
  className,
  icon,
  onClick,
}: {
  className?: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <EmptyButton className={className} onClick={onClick}>
      {icon}
    </EmptyButton>
  );
};

export const IconButton = styled(_IconButton)``;
