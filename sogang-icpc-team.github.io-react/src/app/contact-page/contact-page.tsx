import { styled } from "styled-components";

import { Page } from "@ui/page/page";
import { Section } from "@ui/section/section";
import { Table } from "@ui/table/table";
import { FlexRow } from "@ui/flex/flex";

import MapSogangSvg from "./assets/map-sogang.svg";
import MapKSvg from "./assets/map-k.svg";
import LabK512Image from "./assets/labk512.jpg";
import { useOrganizerDataContext } from "../../contexts/organizer-data-context";

const HeroImage = styled.img`
  width: 100%;
  margin: 32px 0;
`;
const OrganizerTable = styled(Table)``;
const _ContactPage = ({ className }: { className?: string }) => {
  const { latest: latestOrganizerData } = useOrganizerDataContext();
  return (
    <Page className={className}>
      <Page.Title description="서강대학교 학부생이라면 누구나 함께할 수 있습니다.">
        가입 및 문의
      </Page.Title>
      <Page.Body>
        <HeroImage src={LabK512Image} alt="K512 Lab" />
        <Section>
          <Section.Title>가입</Section.Title>
          <Section.Body>
            현재 모집기간이 아닙니다. 매년 3월 초, 6월 말, 12월 말에 모집을
            진행합니다. 해당 기간에 에브리타임, 서담 홍보글을 확인해주세요.
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>문의</Section.Title>
          <Section.Body>
            질문은 언제나 환영합니다!
            <br />
            학회 관련, 프로그래밍 대회 관련, ICPC 관련해 궁금한 점이 있으시다면
            언제든 sogang@acmicpc.team 혹은{" "}
            <a
              href="https://pf.kakao.com/_xewSPK"
              target="_blank"
              rel="noopener noreferrer"
              style={{ wordBreak: "keep-all" }}
            >
              카카오톡 플러스친구
            </a>
            로 문의 부탁드립니다.
          </Section.Body>
        </Section>
        <Section>
          <Section.Title>랩실 위치</Section.Title>
          <Section.Body>
            <p>
              K512 랩실은{" "}
              <a
                href="https://www.google.com/maps/place/%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%90+%EA%B9%80%EB%8C%80%EA%B1%B4%EA%B4%80/@37.5500361,126.940057,15z/data=!4m5!3m4!1s0x0:0x64853caa3a841c2b!8m2!3d37.5500361!4d126.940057"
                target="_blank"
                rel="noopener noreferrer"
              >
                서강대학교 김대건관
              </a>{" "}
              5층 중간 즈음에 위치하고 있습니다.
            </p>
            <FlexRow flexWrap="wrap">
              <img src={MapSogangSvg} alt="서강대학교 약도" />
              <img src={MapKSvg} alt="K관 약도" />
            </FlexRow>
          </Section.Body>
        </Section>

        <Section>
          <Section.Title>회장단</Section.Title>
          <Section.Body>
            <Table.Caption>{latestOrganizerData.year}</Table.Caption>
            <OrganizerTable>
              <Table.Row>
                <Table.Cell>{latestOrganizerData.president.name}</Table.Cell>
                <Table.Cell>학회장</Table.Cell>
                <Table.Cell>{latestOrganizerData.president.email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {latestOrganizerData.vicePresident?.name}
                </Table.Cell>
                <Table.Cell>부학회장</Table.Cell>
                <Table.Cell>
                  {latestOrganizerData.vicePresident?.email}
                </Table.Cell>
              </Table.Row>
            </OrganizerTable>
          </Section.Body>
        </Section>
      </Page.Body>
    </Page>
  );
};
export const ContactPage = styled(_ContactPage)`
  ${OrganizerTable} {
    margin-top: 16px;
  }
`;
