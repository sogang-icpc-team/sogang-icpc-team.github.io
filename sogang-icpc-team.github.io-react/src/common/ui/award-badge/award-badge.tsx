import { useMemo } from "react";
import styled from "styled-components";

export type TAwardBadgeVariant =
  | "winner"
  | "gold"
  | "silver"
  | "bronze"
  | "special"
  | "advanced"
  | "encouragement";

const _AwardBadge = ({
  className,
  variant,
}: {
  className?: string;
  variant: TAwardBadgeVariant;
}) => {
  const icon = useMemo(() => {
    switch (variant) {
      case "winner":
        return "★";
      case "gold":
      case "silver":
      case "bronze":
      case "special":
        return "⬤";
      case "advanced":
        return "▲";
      case "encouragement":
        // TODO: 아이콘 결정 필요
        return "";
    }
  }, [variant]);
  return <span className={className}>{icon}</span>;
};

export const AwardBadge = styled(_AwardBadge)`
  vertical-align: super;
  font-size: 13px;
  color: ${({ variant }) => {
    switch (variant) {
      case "winner":
        return "#ff8800";
      case "gold":
        return "gold";
      case "silver":
        return "silver";
      case "bronze":
        return "#CD7F32";
      case "special":
        return "black";
      case "advanced":
        return "#30d10f";
    }
  }};
`;
