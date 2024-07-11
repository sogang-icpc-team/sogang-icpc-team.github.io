import styled from "styled-components";

export type TAwardBadgeVariant = "gold" | "silver" | "bronze";

const _AwardBadge = ({
  className,
}: {
  className?: string;
  variant: TAwardBadgeVariant;
}) => {
  return <span className={className}>⬤</span>;
};

export const AwardBadge = styled(_AwardBadge)`
  vertical-align: super;
  font-size: 13px;
  color: ${({ variant }) => {
    switch (variant) {
      case "gold":
        return "gold";
      case "silver":
        return "silver";
      case "bronze":
        return "#CD7F32";
    }
  }};
`;
