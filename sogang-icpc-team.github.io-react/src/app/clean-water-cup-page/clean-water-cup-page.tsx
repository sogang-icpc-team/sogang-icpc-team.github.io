import { useRef, useState } from "react";
import styled from "styled-components";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

import { AwardBadge, TAwardBadgeVariant } from "@ui/award-badge/award-badge";
import { OpenInANewTab } from "@ui/open-in-a-new-tab";
import { EmptyLink } from "@ui/button/empty-link";

import { CWC_DATASET } from "./assets/cwc-dataset";
import HeroImage1Jpg from "./assets/images/IMG_1380.jpg";
import HeroImage2Jpg from "./assets/images/IMG_1445.jpg";
import SectionHeaderRightJpg from "./assets/images/IMG_1394.jpg";
import { routes } from "../../routes/routes";

const GoBackIcon = styled(EmptyLink)`
  position: absolute;
  top: 28px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;

  span {
    font-size: 1rem;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 5px;
  }
`;

const Page = styled.div`
  --padding-left: 96px;
  max-width: 1532px;
  background-color: #f0efe7;
  padding: 85px var(--padding-left);
  overflow-x: hidden;
`;

const Hero = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 36px;
  font-weight: 500;
`;

const InfoItemWrapper = styled.div`
  display: flex;
  gap: 98px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoItemTitle = styled.span`
  font-weight: 500;
`;

const Description = styled.div`
  margin-top: 52px;
  line-height: 1.4;
`;

const HeroImageWrapper = styled.div`
  margin-top: 26px;
  line-height: 0;
`;

const HeroImage2 = styled.img`
  display: block;
  transform: translateY(-50%);
  margin-left: 736px;
`;

const SectionDivider = styled.div`
  background-image: url("data:image/svg+xml,%3Csvg width='1512' height='2' viewBox='0 0 1512 2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1L1512 1' stroke='%23c9c6b0' stroke-width='2' stroke-linecap='round' stroke-dasharray='12 12'/%3E%3C/svg%3E%0A");
  height: 2px;
  margin-left: -100px;
  margin-right: -100px;
`;

const Section = styled.div`
  margin: 96px 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SectionHeaderTitle = styled.div`
  font-size: 36px;
  font-weight: 600;
`;

const SectionHeaderDesc = styled.div`
  margin-top: 17px;
  line-height: 1.4;
`;

const SectionHeaderRightImage = styled.img`
  margin-right: calc(var(--padding-left) * -1);
`;

const RoundComparisonTable = styled.table`
  width: 100%;
  margin-top: 80px;

  text-align: center;

  td,
  th {
    padding: 18px 0;
    background-color: unset;
    vertical-align: middle;
  }

  thead th {
    border-bottom: 1px solid black;
  }

  tr:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const YearSwitchWrapper = styled.div`
  position: relative;
  display: flex;
`;

const YearSwitchGlider = styled.div`
  z-index: 1;
  position: absolute;
  display: flex;
  width: var(--year-switch-item-width);
  height: var(--year-switch-item-height);
  background-color: #e3ceae;
  border-radius: 99px;
  transition: 0.5s ease-in-out;
`;

const YearSwitchItem = styled.label`
  z-index: 2;
  width: var(--year-switch-item-width);
  height: var(--year-switch-item-height);
  line-height: var(--year-switch-item-height);
  background-color: unset;
  color: #c5c5c5;
  transition: color 0.2s ease-in;
  border: unset;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;

  &:has(input:checked) {
    color: black;
    border-radius: 8px;
  }

  input {
    display: none;
  }
`;

const Contest = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
  padding: 38px 0;
  border-top: 2px solid #6b6b6b;
  border-bottom: 2px solid #6b6b6b;
`;

const ContestTitle = styled.div`
  font-size: 32px;
  font-weight: 500;
`;

const ContestLinkButton = styled.button`
  margin-top: 32px;
  padding: 8px 24px;
  border: 1px solid #212427;
  border-radius: 8px;
  background: transparent;
`;

const ContestInfoItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const ContestInfoItemTitle = styled.div`
  font-weight: 500;
`;

const AwardHistoryWrapper = styled.div`
  margin-top: 58px;
`;

const NewbieOldbieWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 154px;
`;

const RoundInfoBadge = styled.div`
  border-left: 6px solid;
  padding-left: 6px;
  font-weight: 500;
  margin-top: 8px;
  margin-bottom: 4px;
`;

const AwardHistoryTable = styled.table`
  width: 100%;
  text-align: center;

  td,
  th {
    padding: 10px 0;
    background-color: unset;
    vertical-align: middle;
  }

  thead th {
    border-bottom: 1px solid black;
  }

  tr:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const MakerCheckerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 154px;
  margin-top: 58px;

  .maker__wrapper,
  .checker__wrapper {
    width: 100%;
  }

  th:first-child {
    width: 132px;
  }

  th:nth-child(2) {
    width: 160px;
  }
`;

const Caption = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const SponsorWrapper = styled.div`
  margin-top: 58px;
`;

const SponsorLogoImageWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 20px;

  img {
    width: 105px;
    height: fit-content;
  }
`;

const _CleanWaterCupPage = ({ className }: { className?: string }) => {
  const [selectedYear, setSelectedYear] = useState<number>(CWC_DATASET[0].year);
  const [selectedData, setSelectedData] = useState(CWC_DATASET[0]);
  const yearSwitchGliderRef = useRef<HTMLDivElement>(null);

  const yearsList = CWC_DATASET.map(({ year }) => year);

  const switchSelectedYear = (yearNum: number) => {
    setSelectedYear(yearNum);
    setSelectedData(CWC_DATASET.find(({ year }) => year === yearNum)!);
  };

  const handleGlidingTabItemClick = (yearNum: number, index: number) => {
    if (yearSwitchGliderRef.current) {
      yearSwitchGliderRef.current.style.transform = `translateX(${index * 100}%)`;
      switchSelectedYear(yearNum);
    }
  };

  return (
    <Page className={className}>
      <GoBackIcon to={routes.main.path()}>
        <ArrowLeftIcon width={17} />
        <span>홈으로 돌아가기</span>
      </GoBackIcon>

      <Hero>
        <div>
          <Title>청정수컵</Title>
          <div className="sub-title">Clean Water Cup</div>
        </div>

        <InfoItemWrapper>
          <InfoItem>
            <InfoItemTitle>참여 대상</InfoItemTitle>
            <span>서강대학교 학부생 누구나</span>
          </InfoItem>
          <InfoItem>
            <InfoItemTitle>대회 구분</InfoItemTitle>
            <span>
              <ul>
                <li>새내기 라운드</li>
                <li>청정수 라운드</li>
              </ul>
            </span>
          </InfoItem>
          <InfoItem>
            <InfoItemTitle>지원 언어</InfoItemTitle>
            <span>
              <ul>
                <li>C/C++</li>
                <li>Python3/Pypy3</li>
                <li>Java/Kotlin</li>
              </ul>
            </span>
          </InfoItem>
        </InfoItemWrapper>
      </Hero>

      <Description>
        서강대학교 청정수컵은 아직 프로그래밍에 익숙하지 않은 프로그래밍
        '청정수'를 위한 대회입니다.
        <br />
        컴퓨터공학과 신입생 그리고 아직 프로그래밍 대회에서 수상해보지 못한
        학부생 모두 청정수컵을 통해 수상의 즐거움을 경험하기를 기대합니다.
      </Description>

      <HeroImageWrapper>
        <img alt="hero-1" src={HeroImage1Jpg} />
        <HeroImage2 alt="hero-2" src={HeroImage2Jpg} />
      </HeroImageWrapper>

      <SectionDivider />

      <Section>
        <SectionHeader>
          <div>
            <SectionHeaderTitle>
              🐣
              <br />
              뉴비를 위한 대회
            </SectionHeaderTitle>
            <SectionHeaderDesc>
              새내기는 새내기끼리, 헌내기는 헌내기끼리
            </SectionHeaderDesc>
          </div>
          <SectionHeaderRightImage
            alt="section-header-right-image"
            src={SectionHeaderRightJpg}
          />
        </SectionHeader>

        <RoundComparisonTable>
          <thead>
            <tr>
              <th />
              <th>참가 조건</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>새내기 Round</th>
              <td>Sogang ICPC Team 소속 당해년도 신입생</td>
            </tr>
            <tr>
              <th>청정수 Round</th>
              <td>
                <span style={{ textAlign: "left" }}>
                  아래 조건에 해당하지 <u>않는</u> 모든 Sogang ICPC Team 학회원
                  <br />
                  <ul style={{ width: "max-content", margin: "20px auto 0" }}>
                    <li>Codeforces {">"}= 1600</li>
                    <li>AtCoder {">"}= 1200</li>
                    <li>solved.ac {">"}= Platinum III</li>
                    <li>
                      ICPC/UCPC/SUAPC/Camp Contest/SPC/SCPC/청정수컵 수상자
                    </li>
                  </ul>
                </span>
              </td>
            </tr>
          </tbody>
        </RoundComparisonTable>
      </Section>

      <SectionDivider />

      <Section>
        <SectionHeader>
          <div>
            <SectionHeaderTitle>
              ⚔<br />
              오프라인 경쟁의 장
            </SectionHeaderTitle>
            <SectionHeaderDesc>
              쫄깃한 오프라인 화합의 장, 누가 제일 많은 풍선을 가져가게 될까요?
              <br />
            </SectionHeaderDesc>
          </div>
          <SectionHeaderRightImage
            alt="section-header-right-image"
            src={SectionHeaderRightJpg}
          />
        </SectionHeader>
      </Section>

      <SectionDivider />

      <Section>
        <SectionHeader>
          <div>
            <SectionHeaderTitle>
              🏛️
              <br />
              기록
            </SectionHeaderTitle>
            <SectionHeaderDesc>대회를 빛내주신 분들입니다.</SectionHeaderDesc>
          </div>
          <YearSwitchWrapper>
            <YearSwitchGlider ref={yearSwitchGliderRef} />
            {yearsList.map((year, index) => (
              <YearSwitchItem key={year}>
                {year}
                <input
                  type="radio"
                  name="gliding-tab-year"
                  checked={year === selectedYear}
                  onClick={() => handleGlidingTabItemClick(year, index)}
                />
              </YearSwitchItem>
            ))}
          </YearSwitchWrapper>
        </SectionHeader>

        <Contest>
          <div>
            <ContestTitle>
              제{selectedData.nth}회<br />
              서강대학교 청정수컵
            </ContestTitle>
            <ContestLinkButton className="contest-link__button">
              BOJ 대회 바로가기 →
            </ContestLinkButton>
          </div>

          <ContestInfoItemWrapper>
            <div className="contest-info-item">
              <ContestInfoItemTitle>일자</ContestInfoItemTitle>
              <div>{selectedData.dateStr}</div>
            </div>
            <div className="contest-info-item">
              <ContestInfoItemTitle>장소</ContestInfoItemTitle>
              <div>{selectedData.location}</div>
            </div>
          </ContestInfoItemWrapper>
        </Contest>

        <AwardHistoryWrapper>
          <Caption>수상내역</Caption>
          <NewbieOldbieWrapper>
            <div className="newbie__wrapper">
              <RoundInfoBadge style={{ borderColor: "#cedfc8" }}>
                새내기 Round
              </RoundInfoBadge>
              <AwardHistoryTable>
                <thead>
                  <tr>
                    <th style={{ width: "84px" }}>순위</th>
                    <th style={{ width: "88px" }}>솔브 수</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.awards.round.newbie.map((data) => (
                    <tr key={data.rank}>
                      <td>
                        {data.rank}
                        <AwardBadge
                          variant={data.variant as TAwardBadgeVariant}
                        />
                      </td>
                      <td>{data.solved}</td>
                      <td>
                        {data.name}
                        <OpenInANewTab
                          href={`https://acmicpc.net/user/${data.bojHandle}`}
                        >
                          ({data.bojHandle})
                        </OpenInANewTab>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AwardHistoryTable>
            </div>

            <div className="oldbie__wrapper">
              <RoundInfoBadge style={{ borderColor: "#b4d9dd" }}>
                청정수 Round
              </RoundInfoBadge>
              <AwardHistoryTable>
                <thead>
                  <tr>
                    <th style={{ width: "84px" }}>순위</th>
                    <th style={{ width: "88px" }}>솔브 수</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.awards.round.oldbie.map((data) => (
                    <tr key={data.rank}>
                      <td>
                        {data.rank}
                        <AwardBadge
                          variant={data.variant as TAwardBadgeVariant}
                        />
                      </td>
                      <td>{data.solved}</td>
                      <td>
                        {data.name}
                        <OpenInANewTab
                          href={`https://acmicpc.net/user/${data.bojHandle}`}
                        >
                          ({data.bojHandle})
                        </OpenInANewTab>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AwardHistoryTable>
            </div>
          </NewbieOldbieWrapper>
        </AwardHistoryWrapper>

        <MakerCheckerWrapper>
          <div className="maker__wrapper">
            <Caption>출제진</Caption>
            <AwardHistoryTable>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>BOJ</th>
                  <th>소속</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.examiners.map((p) => (
                  <tr key={p.bojHandle}>
                    <td>{p.name}</td>
                    <td>
                      <OpenInANewTab
                        href={`https://acmicpc.net/user/${p.bojHandle}`}
                      >
                        {p.bojHandle}
                      </OpenInANewTab>
                    </td>
                    <td>{p.school}</td>
                  </tr>
                ))}
              </tbody>
            </AwardHistoryTable>
          </div>
          <div className="checker__wrapper">
            <Caption>검수진</Caption>
            <AwardHistoryTable>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>BOJ 핸들</th>
                  <th>소속</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.checkers.map((p) => (
                  <tr key={p.bojHandle}>
                    <td>{p.name}</td>
                    <td>
                      <OpenInANewTab
                        href={`https://acmicpc.net/user/${p.bojHandle}`}
                      >
                        {p.bojHandle}
                      </OpenInANewTab>
                    </td>
                    <td>{p.school}</td>
                  </tr>
                ))}
              </tbody>
            </AwardHistoryTable>
          </div>
        </MakerCheckerWrapper>

        <SponsorWrapper>
          <Caption>스폰서</Caption>
          <SponsorLogoImageWrapper>
            {selectedData.sponsors.map((s) => (
              <img key={s.name} src={s.logoImage.url} alt={s.name} />
            ))}
          </SponsorLogoImageWrapper>
        </SponsorWrapper>
      </Section>
    </Page>
  );
};

export const CleanWaterCupPage = styled(_CleanWaterCupPage)`
  --year-switch-item-width: 92px;
  --year-switch-item-height: 36px;

  li {
    list-style: inside;
  }
`;
