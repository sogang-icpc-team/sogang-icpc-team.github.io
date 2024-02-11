<script>
  import { onMount } from "svelte";

  import HistoryTable from "../../template/HistoryTable/HistoryTable.svelte";
  import HistoryTab from "../../template/HistoryTab/HistoryTab.svelte";
  import Spc22Banner from "./spc-22-banner.svelte";
  export let showPopup = false;

  let spcData;
  let yearsList,
    curYear = "2023";
  const spc_admission_url = "https://forms.gle/DTbtyNfrdpC35Ede9";
  // Re-fetch Whenever curYear Changes In HistoryTab Component
  $: fetch(`/spc/data/${curYear.trim()}.json`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      spcData = data;
    });
  fetch(`/spc/data/years.json`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      yearsList = data;
    });

  onMount(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
  // function onBannerClick() {
  //   window.open(spc_admission_url, "_blank").focus();
  // }
</script>

<svelte:component this={showPopup ? Spc22Banner : null} bind:showPopup />
<div class="contents">
  <div class="pad">
    <span class="subtitle">Sogang Programming Contest</span>
    <h1>논리력과 문제 해결 능력을 겨루는 대회입니다.</h1>
  </div>
  <div class="row pad first_paragraph">
    <div class="p25">
      <h2>소개</h2>
    </div>
    <!-- <div class="p75">
      SPC는 서강대학교 학부생을 위한 프로그래밍 대회입니다. 프로그래밍과 ICPC에
      대한 관심을 높이고 학생들의 논리력과 알고리즘 설계 능력을 향상하기 위한
      대회로서 2005년부터 개최되었습니다. 참가자들은 주어진 문제들을 시간 내에
      프로그래밍 언어를 이용하여 해결해야 합니다.
    </div> -->
    <div class="p75">
      Sogang Programming Contest (SPC)는 서강대학교 학부생을 위한 프로그래밍
      대회입니다. 참가자는 알고리즘 설계 능력과 논리적 사고를 통해 주어진 문제를
      프로그래밍 언어로 해결해야 합니다. 프로그래밍에 대한 관심 촉구 및 문제
      해결 능력과 컴퓨팅 사고력의 향상을 위한 대회로 2005년부터 개최되었습니다.
    </div>
  </div>
  <img
    class="pad"
    src="/res/spc2019.jpg"
    alt="2019 Sogang Programming Contest"
  />

  <div class="row pad">
    <div class="p25">
      <h2>개요</h2>
    </div>
    <div class="p75">
      <p>
        논리적인 사고력과 알고리즘 작성 능력을 평가하는 ICPC 유형의 문제가
        출제됩니다.
      </p>
      <p>
        대회는 난이도에 따라 Master와 Champion로 나누어져 3시간 동안 진행되며,
        대회 참가자들은 해당 Division에서 총 8문제를 풀게 됩니다. Champion에는
        모든 학생, Master에는 4학기 이하 학생만이 참가할 수 있습니다. 시상은
        Master와 Champion으로 나뉘어 진행됩니다.
      </p>
    </div>
  </div>
  <div class="hr" />
  <div class="row pad">
    <div class="p25">
      <h2>참가</h2>
    </div>
    <div class="p75">
      <p>
        대학원생과 휴학생을 제외한 모든 서강대학교 학부생이 참가할 수 있습니다.
        단, Champion 대상, 금상 수상자는 다음 해부터 참가할 수 없고, Master 금상
        수상자는 다음 해부터 Master에 참가할 수 없습니다.
      </p>
    </div>
  </div>
  <div class="row pad">
    <div class="p25">
      <h2>규칙</h2>
    </div>
    <div class="p75">
      <p>
        대회 중 제출한 소스코드는 채점 서버에 의해 자동으로 채점되며, 실시간으로
        결과를 알 수 있습니다. 코드를 제출하였을 때 '<b>맞았습니다!!</b>'를
        받으면 문제를 푼 것으로, 이외의 결과를 받으면 틀린 것으로 간주합니다.
      </p>
      <p>
        문제를 풀 때마다 패널티 점수가 누적됩니다. 패널티 점수는 모든 맞은
        문제에 대해, 대회 시작 시간부터 그 문제를 풀기까지 걸린 시간을 <i>t</i
        >분, 처음으로 문제를 맞기 직전까지 제출한 횟수를
        <i>w</i>번이라고 할 때 (<i>t</i> + 20<i>w</i>)점입니다.
      </p>
      <p>
        순위는 푼 문제가 많은 순서대로, 푼 문제 수가 같을 경우에는 패널티 점수의
        합이 적은 순서대로 결정됩니다.
      </p>
      <p>
        대회는 <a href="https://www.acmicpc.net" target="blank"
          >Baekjoon Online Judge</a
        >
        플랫폼에서 진행되며, 채점 관련 규칙은 BOJ의
        <a href="https://www.acmicpc.net/help/judge" target="blank"
          >채점 도움말</a
        >,
        <a href="https://www.acmicpc.net/help/language" target="blank"
          >언어 도움말</a
        >을 참조합니다.
      </p>
      <p>모든 문제는 출제진이 C++로 정답을 작성했음이 보장됩니다.</p>
    </div>
  </div>
  <div class="row pad">
    <div class="p25">
      <h2>사용 가능 언어</h2>
    </div>
    <div class="p75">
      <ul class="bullet">
        <li>C</li>
        <li>C++</li>
        <li>Java</li>
        <li>Python 3</li>
        <li>Kotlin</li>
      </ul>
      <p style="margin-top: 16px;">
        사용 가능한 언어 목록은 변경될 수 있습니다.
      </p>
    </div>
  </div>
  <div class="row pad">
    <div class="p25">
      <h2>주의사항</h2>
    </div>
    <div class="p75">
      <ul class="bullet">
        <li>
          대회 중 각 언어의 레퍼런스 페이지를 제외한 인터넷 사용은 금지됩니다.
        </li>
        <li>대회 종료 전에 퇴실할 수 없습니다.</li>
        <li>책이나 개인이 준비한 인쇄된 참고자료는 지참할 수 있습니다.</li>
        <li>휴대폰 및 전자기기는 사용할 수 없습니다.</li>
      </ul>
    </div>
  </div>
  <div class="hr" />
  <div class="row pad">
    <div class="p25">
      <h2>시상 내역</h2>
    </div>
    <div class="p75">
      <div class="table_container">
        <table style="width: 700px;">
          <thead>
            <tr>
              <th>Division</th> <th>상</th> <th>인원</th>
              <th>상금</th> <th>총액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="4" style="vertical-align:middle;">Champion</td>
              <td>대상</td><td class="l">1명</td><td class="l">₩500,000</td><td
                class="l">₩500,000</td
              >
            </tr>
            <tr>
              <td>금상</td><td class="l">1명</td><td class="l">₩300,000</td><td
                class="l">₩300,000</td
              >
            </tr>
            <tr>
              <td>은상</td><td class="l">2명</td><td class="l">₩200,000</td><td
                class="l">₩400,000</td
              >
            </tr>
            <tr>
              <td>동상</td><td class="l">3명</td><td class="l">₩150,000</td><td
                class="l">₩450,000</td
              >
            </tr>

            <tr>
              <td rowspan="3" style="vertical-align:middle;">Master</td>
              <td>금상</td><td class="l">1명</td><td class="l">₩300,000</td><td
                class="l">₩300,000</td
              >
            </tr>
            <tr>
              <td>은상</td><td class="l">2명</td><td class="l">₩200,000</td><td
                class="l">₩400,000</td
              >
            </tr>
            <tr>
              <td>동상</td><td class="l">3명</td><td class="l">₩150,000</td><td
                class="l">₩450,000</td
              >
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">합계</td><td class="l">13명</td><td
                colspan="2"
                class="l">₩2,800,000</td
              >
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
  <img
    class="pad"
    src="/res/spc2018.jpg"
    alt="Sogang Programming Contest posters"
  />
  <div class="pad_v">
    <div class="pad_h">
      <h2>역대 대회 기록</h2>
    </div>
    <div class="tabs_container">
      <ul class="tabs pad_h">
        <HistoryTab {yearsList} bind:curYear />
      </ul>
    </div>
  </div>
  <div class="history_contents">
    {#if spcData}
      {#if spcData.meta}
        <div class="row pad p75">
          <p>
            {spcData.meta.date}<br />
            {spcData.meta.place}
          </p>
          <div class="button_container">
            <span class="contest_section">스코어보드</span>
            <a href={spcData.meta.scoreboard.master} target="_blank"
            ><div class="button">Master</div></a
            >
            <a href={spcData.meta.scoreboard.champion} target="_blank"
            ><div class="button">Champion</div></a
            >
          </div>
          {#if spcData.meta.problem.pdf}
            <div class="button_container">
              <span class="contest_section">문제 (PDF)</span>
              <a href={spcData.meta.problem.pdf.master} target="_blank"
              ><div class="button">Master</div></a
              >
              <a href={spcData.meta.problem.pdf.champion} target="_blank"
              ><div class="button">Champion</div></a
              >
            </div>
          {/if}
          <div class="button_container">
            <span class="contest_section">문제 (BOJ)</span>
            <a href={spcData.meta.problem.Integrated} target="_blank"
            ><div class="button">Integrated</div></a
            >
          </div>
          {#if spcData.meta.solution}
            <div class="button_container">
              <span class="contest_section">해설 (PDF)</span>
              <a href={spcData.meta.solution}
              ><div class="button">Official Solutions</div></a
              >
            </div>
          {/if}
          {#if spcData.meta.author}
            <p>출제 - {spcData.meta.author.join(", ")}</p>
          {/if}
        </div>
        <div class="hl" />
      {/if}
      {#each spcData.contests as contest}
        <HistoryTable
          title={contest.title}
          award={contest.award}
          thead={["#", "=", "이름"]}
          tbody={contest.data}
        />
      {/each}
    {/if}
  </div>
  <div class="hr" />
  <div class="pad">
    <b>#</b> = 순위, <b>=</b> = 푼 문제 수 / 점수<br />
    <i class="award winner">&#9733;</i> = 대상,
    <i class="award gold">&#11044;</i> = 금상,
    <i class="award silver">&#11044;</i> = 은상,
    <i class="award bronze">&#11044;</i> = 동상<br />
    2014년 이전의 정보는 완전하지 않을 수 있습니다. 정보 등록/수정 요청은 하단의
    학회장 메일로 메일을 보내 주세요.
  </div>
</div>
