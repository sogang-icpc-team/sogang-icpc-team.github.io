import styled from "styled-components";

import { AwardBadge } from "@ui/award-badge/award-badge";

const Bold = styled.span`
  font-weight: bold;
`;
const _MedalIconDescriptions = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Bold>#</Bold> = 순위, <Bold>=</Bold> = 푼 문제 수 / 점수
      <br />
      <AwardBadge variant="winner" /> = 우승,
      <AwardBadge variant="gold" /> = 금상,
      <AwardBadge variant="silver" /> = 은상,
      <AwardBadge variant="bronze" /> = 동상
      <br />
      <AwardBadge variant="special" /> = 기타 수상
      <br />
      <AwardBadge variant="advanced" /> = 다음 라운드 진출
      <br />
      HM = Honorable Mention
    </div>
  );
};

export const MedalIconDescriptions = styled(_MedalIconDescriptions)`
  line-height: 1.4rem;
`;
