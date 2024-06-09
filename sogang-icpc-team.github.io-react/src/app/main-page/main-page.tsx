import styled from "styled-components";
import { Link } from "react-router-dom";

import { Page } from "@ui/page/page";

import ICPCWF21Image from "./assets/21-icpc-wf-1.jpg";

const HeroTitle = styled.div`
  font-size: 4rem;
  font-weight: bold;
  letter-spacing: -0.05ch;
  line-height: 0.9;
  margin-bottom: 32px;
`;
const HeroDescription = styled.div`
  line-height: 1.4;
`;
const Contents = styled.div`
  margin-top: 72px;
  line-height: 1.4;

  img {
    width: 100%;
  }
`;
const Pad = styled.div`
  padding: 32px 64px;

  @media only screen and (max-width: 768px) {
    padding: 32px 32px;
  }
`;
const RowPad = styled(Pad)`
  display: flex;
  flex-wrap: wrap;
`;
const HeroImage = styled.img`
  margin: 32px 0;
`;
const Hr = styled.hr`
  margin: 32px 64px;
  border-bottom: 1px dashed #ddd;

  @media only screen and (max-width: 768px) {
    margin: 32px 32px;
  }
`;
const P25 = styled.div`
  width: 25%;

  font-size: 1rem;

  @media only screen and (max-width: 768px) {
    width: 100%;

    padding-right: 0;
    margin-bottom: 32px;
  }
`;
const P75 = styled.div`
  width: 75%;

  font-size: 1rem;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const _MainPage = ({ className }: { className?: string }) => {
  return (
    <Page className={className}>
      <Contents>
        <Pad>
          <HeroTitle>
            Make it.
            <br />
            Solve it.
          </HeroTitle>
          <HeroDescription>
            Sogang ICPC Team —<br />
            서강대학교 컴퓨터공학과 알고리즘 문제해결 학회
            <br />
          </HeroDescription>
        </Pad>
        <HeroImage src={ICPCWF21Image} alt="21 ICPC World Finals" />
        <RowPad>
          <P25>
            <h2>소개</h2>
          </P25>
          <P75>
            <h1>
              우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다.{" "}
              <Link to="/introduction">
                <i className="material-icons main">arrow_forward</i>
              </Link>
            </h1>
          </P75>
        </RowPad>
        <Hr />
        <RowPad>
          <P25>
            <h2>기록</h2>
          </P25>
          <P75>
            <h1>
              매년 여러 대회에 참가해 우수한 성적을 거두고 있습니다.{" "}
              <Link to="/history">
                <i className="material-icons main">arrow_forward</i>
              </Link>
            </h1>
          </P75>
        </RowPad>
        <Hr />
        <RowPad>
          <P25>
            <h2>Sogang Programming Contest</h2>
          </P25>
          <P75>
            <h1>
              논리력과 문제 해결 능력을 겨루는 대회입니다.{" "}
              <Link to="/spc">
                <i className="material-icons main">arrow_forward</i>
              </Link>
            </h1>
          </P75>
        </RowPad>
        <Hr />
        <RowPad>
          <P25>
            <h2>가입 및 문의</h2>
          </P25>
          <P75>
            <h1>
              서강대학교 학부생이라면 누구나 함께할 수 있습니다.{" "}
              <Link to="/contact">
                <i className="material-icons main">arrow_forward</i>
              </Link>
            </h1>
          </P75>
        </RowPad>
      </Contents>
    </Page>
  );
};
export const MainPage = styled(_MainPage)``;
