import { styled } from "styled-components";

import { OpenInANewTab } from "@ui/open-in-a-new-tab";

import { Button, TButtonProps } from "./button";

export const OpenInANewTabButton = styled(
  ({
    className,
    href,
    ...buttonProps
  }: { className?: string; href: string } & TButtonProps) => {
    return (
      <OpenInANewTab href={href} style={{ textDecoration: "none" }}>
        <Button className={className} {...buttonProps} />
      </OpenInANewTab>
    );
  },
)``;
