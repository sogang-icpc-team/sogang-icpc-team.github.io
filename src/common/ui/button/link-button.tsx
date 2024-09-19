import styled from "styled-components";
import { Link } from "react-router-dom";

import { Button, TButtonProps } from "./button";

export const LinkButton = styled(
  ({
    className,
    to,
    ...buttonProps
  }: { className?: string; to: string } & TButtonProps) => {
    return (
      <Link className={className} to={to}>
        <Button {...buttonProps} />
      </Link>
    );
  },
)``;
