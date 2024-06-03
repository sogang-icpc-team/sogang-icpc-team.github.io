<script>
  import { onMount, onDestroy } from "svelte";
  import {
    showTopBar as showTopBarStore,
    showFooter as showFooterStore,
  } from "../../template/NavBar/store";

  import { CWC_DATASET } from "./res/cwc-dataset";
  import AwardBadge from "./AwardBadge.svelte";

  let selectedYear = CWC_DATASET[0].year,
    selectedData = CWC_DATASET[0],
    yearsList = CWC_DATASET.map(({ year }) => year);

  onMount(() => {
    document.querySelector(".contents_container").style = "max-width: unset;";

    showTopBarStore.update(() => false);
    showFooterStore.update(() => false);
  });

  onDestroy(() => {
    showTopBarStore.update(() => true);
    showFooterStore.update(() => true);
  });

  const switchSelectedYear = (yearNum) => {
    selectedYear = yearNum;
    selectedData = CWC_DATASET.find(({ year }) => year === yearNum);
  };

  const handleGlidingTabItemClick = (yearNum, offset) => {
    document.querySelector(".year-switch__glider").style.transform =
      `translateX(${offset * 100}%)`;

    switchSelectedYear(yearNum);
  };
</script>

<a class="go_back_icon" href="/">
  <i class="material-icons main">arrow_backward</i>
  <span>홈으로 돌아가기</span>
</a>
<div class="page">
  <div class="hero">
    <div>
      <div class="title">청정수컵</div>
      <div class="sub-title">Clean Water Cup</div>
    </div>

    <div class="info-item__wrapper">
      <div class="info-item">
        <span class="info-item__title">참여 대상</span>
        <span>서강대학교 학부생 누구나</span>
      </div>
      <div class="info-item">
        <span class="info-item__title">참여 대상</span>
        <span>서강대학교 학부생 누구나</span>
      </div>
      <div class="info-item">
        <span class="info-item__title">참여 대상</span>
        <span>서강대학교 학부생 누구나</span>
      </div>
    </div>
  </div>
  <div class="description">
    서강대학교 청정수컵은 ㅇㅇㅇ 취지로 도입되어, <br />
    컴퓨터공학과 신입생 그리고 아직 프로그래밍 대회에서 수상해보지 못한 학부생 모두,
    수상의 즐거움을 경험하기를 기대합니다.
  </div>
  <div class="hero-image__wrapper">
    <img
      class="hero-image-1"
      alt="hero-1"
      src="/res/clean-water-cup/IMG_1380.jpg"
    />
    <img
      class="hero-image-2"
      alt="hero-2"
      src="/res/clean-water-cup/IMG_1445.jpg"
    />
  </div>

  <div class="section-divider" />

  <div class="section">
    <div class="section-header">
      <div>
        <div class="section-header__title">
          🐣<br />뉴비를 위한 대회
        </div>
        <div class="section-header__desc">
          새내기는 새내기끼리, 헌내기는 헌내기끼리
        </div>
      </div>
      <img
        alt="poster"
        class="section-header__right-img"
        src="/res/clean-water-cup/IMG_1394.jpg"
      />
    </div>
    <table class="round-comparison__table">
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
            <span style="text-align: left;">
              <span
                >아래 조건에 해당하지 <u>않는</u> 모든 Sogang ICPC Team 학회원</span
              >
              <br />
              <ul style="width: max-content; margin: 20px auto 0;">
                <li>Codeforces >= 1600</li>
                <li>AtCoder >= 1200</li>
                <li>solved.ac >= Platinum III</li>
                <li>ICPC/UCPC/SUAPC/Camp Contest/SPC/SCPC/청정수컵 수상자</li>
              </ul>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section-divider" />

  <div class="section">
    <div class="section-header">
      <div>
        <div class="section-header__title">⚔<br />오프라인 경쟁의 장</div>
        <div class="section-header__desc">
          쫄깃한 오프라인 화합의 장, 누가 제일 많은 풍선을 가져가게 될까요?
          <br />
        </div>
      </div>
      <img
        alt="poster"
        class="section-header__right-img"
        src="/res/clean-water-cup/IMG_1394.jpg"
      />
    </div>
  </div>

  <div class="section-divider" />

  <div class="section">
    <div class="section-header">
      <div>
        <div class="section-header__title">🏛️<br />기록</div>
        <div class="section-header__desc">대회를 빛내주신 분들입니다.</div>
      </div>
      <div class="year-switch__wrapper">
        <div class="year-switch__glider" />
        {#each yearsList as year, index}
          <label class="year-switch-item">
            {year}
            <input
              type="radio"
              name="gliding-tab-year"
              checked={year === selectedYear}
              on:click={() => handleGlidingTabItemClick(year, index)}
            />
          </label>
        {/each}
      </div>
    </div>

    <div class="contest">
      <div>
        <div class="contest__title">
          제 {selectedData.nth}회<br />서강대학교 청정수컵
        </div>
        <button class="contest-link__button">BOJ 대회 바로가기 →</button>
      </div>

      <div class="contest-info-item__wrapper">
        <div class="contest-info-item">
          <div class="contest-info-item__title">일자</div>
          <div>{selectedData.dateStr}</div>
        </div>
        <div class="contest-info-item">
          <div class="contest-info-item__title">장소</div>
          <div>{selectedData.location}</div>
        </div>
      </div>
    </div>

    <div class="award-history__wrapper">
      <div class="caption">수상내역</div>
      <div class="newbie-oldbie__wrapper">
        <div class="newbie__wrapper">
          <div class="round-info__badge" style="border-color:#cedfc8;">
            새내기 Round
          </div>
          <table class="award-history__table">
            <thead>
              <tr>
                <th style="width: 84px;">순위</th>
                <th style="width: 88px;">솔브 수</th>
                <th>이름</th>
              </tr>
            </thead>
            <tbody>
              {#each selectedData.awards.round.newbie as data}
                <tr>
                  <td>{data.rank}<AwardBadge variant={data.variant} /></td>
                  <td>{data.solved}</td>
                  <td
                    >{data.name}<a
                      href="https://acmicpc.net/user/{data.bojHandle}"
                      target="_blank"
                      rel="noreferrer">({data.bojHandle})</a
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="oldbie__wrapper">
          <div class="round-info__badge" style="border-color: #b4d9dd">
            청정수 Round
          </div>
          <table class="award-history__table">
            <thead>
              <tr>
                <th style="width: 84px;">순위</th>
                <th style="width: 88px;">솔브 수</th>
                <th>이름</th>
              </tr>
            </thead>
            <tbody>
              {#each selectedData.awards.round.oldbie as data, index}
                <tr>
                  <td>{data.rank}<AwardBadge variant={data.variant} /></td>
                  <td>{data.solved}</td>
                  <td
                    >{data.name}<a
                      href="https://acmicpc.net/user/{data.bojHandle}"
                      target="_blank"
                      rel="noreferrer">({data.bojHandle})</a
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="maker-checker__wrapper">
      <div class="maker__wrapper">
        <div class="caption">출제진</div>
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>BOJ</th>
              <th>소속</th>
            </tr>
          </thead>
          <tbody>
            {#each selectedData.examiners as p}
              <tr>
                <td>
                  {p.name}
                </td>
                <td>
                  <a
                    href="https://acmicpc.net/user/{p.bojHandle}"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.bojHandle}
                  </a>
                </td>
                <td>{p.school}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="checker__wrapper">
        <div class="caption">검수진</div>
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>BOJ 핸들</th>
              <th>소속</th>
            </tr>
          </thead>
          <tbody>
            {#each selectedData.checkers as p}
              <tr>
                <td>{p.name}</td>
                <td>
                  <a
                    href="https://acmicpc.net/user/{p.bojHandle}"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.bojHandle}
                  </a>
                </td>
                <td>{p.school}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    <div class="sponser__wrapper">
      <div class="caption">스폰서</div>
      <div class="sponser__wrapper__logo-image__wrapper">
        {#each selectedData.sponsers as s}
          {#if s.logoImage.type === "png"}
            <img src={s.logoImage.url} alt={s.name} />
          {/if}
          {#if s.logoImage.type === "svg"}
            <img src={s.logoImage.url} alt={s.name} />
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  *:not(i) {
    font-family: "MaruBuri", "Tossface";

    color: #212427;
  }
  ::selection {
    background: #e2e0cf;
    color: unset;
  }
  table {
    td,
    th {
      background-color: unset;
      vertical-align: middle;
    }
    thead {
      th {
        border-bottom: 1px solid black;
      }
    }
    td {
      padding: 10px 0;
      border: unset;
    }
    tr:nth-child(2n) {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
  ul {
    li {
      &::before {
        content: "-";
        margin-right: 8px;
      }
    }
  }

  .round-comparison__table {
    margin-top: 80px;

    tr {
      td {
        padding: 18px 0;
      }
    }
  }

  * {
    --year-switch-item-width: 92px;
    --year-switch-item-height: 36px;
  }
  .year-switch {
    &__glider {
      z-index: 1;

      position: absolute;

      display: flex;
      width: var(--year-switch-item-width);
      height: var(--year-switch-item-height);
      background-color: #e3ceae;
      border-radius: 99px; // just a high number to create pill effect
      transition: 0.5s ease-in-out;
    }
    &__wrapper {
      position: relative;

      display: flex;
    }
    &-item {
      input {
        display: none;
      }

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
    }
  }

  .sponser__wrapper,
  .award-history__wrapper,
  .maker-checker__wrapper {
    margin-top: 58px;
  }
  .newbie-oldbie__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 154px;
  }
  .round-info__badge {
    border-left: 6px solid;
    padding-left: 6px;
    font-weight: 500;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  .sponser__wrapper {
    &__logo-image__wrapper {
      display: flex;
      align-items: baseline;
      gap: 20px;
      img {
        width: 105px;
        height: fit-content;
      }
    }
  }
  .maker-checker__wrapper {
    display: flex;
    justify-content: space-between;
    gap: 154px;

    .maker__wrapper,
    .checker__wrapper {
      width: 100%;

      th:first-child {
        width: 132px;
      }
      th:nth-child(2) {
        width: 160px;
      }
    }
  }
  .caption {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .contest {
    display: flex;
    justify-content: space-between;

    margin-top: 80px;
    padding: 38px 0;

    border-top: 2px solid #6b6b6b;
    border-bottom: 2px solid #6b6b6b;

    &__title {
      font-size: 32px;
      font-weight: 500;
    }

    &-link__button {
      margin-top: 32px;
      padding: 8px 24px;

      border: 1px solid #212427;
      border-radius: 8px;
      background: transparent;
    }

    &-info-item {
      line-height: 1.5;

      &__wrapper {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }
      &__title {
        font-weight: 500;
      }
    }
  }

  .page {
    --padding-left: 96px;

    max-width: 1532px;
    background-color: #f0efe7;

    padding: 85px var(--padding-left);

    overflow-x: hidden;

    .section-divider {
      background-image: url("data:image/svg+xml,%3Csvg width='1512' height='2' viewBox='0 0 1512 2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1L1512 1' stroke='%23c9c6b0' stroke-width='2' stroke-linecap='round' stroke-dasharray='12 12'/%3E%3C/svg%3E%0A");
      height: 2px;

      margin-left: -100px;
      margin-right: -100px;
    }

    .section {
      margin: 96px 0;

      &-header {
        display: flex;
        justify-content: space-between;

        &__title {
          font-size: 36px;
          font-weight: 600;
        }

        &__desc {
          margin-top: 17px;
          line-height: 1.4;
        }

        &__right-img {
          margin-right: calc(var(--padding-left) * -1);
        }
      }
    }

    .hero-image {
      &__wrapper {
        margin-top: 26px;
        margin-right: calc(var(--padding-left) * -1);
        margin-left: calc(var(--padding-left) * -1);

        line-height: 0;
      }

      &-2 {
        display: block;

        transform: translateY(-50%);

        margin-left: 736px;
        /* margin-left: auto; */
        /* margin-right: 51px; */
      }
    }

    .hero {
      display: flex;
      justify-content: space-between;

      .title {
        font-size: 36px;
        font-weight: 500;
      }
      .info-item {
        &__wrapper {
          display: flex;
          gap: 98px;
        }

        &__title {
          font-weight: 500;
        }

        display: flex;
        flex-direction: column;
      }
    }
    .description {
      margin-top: 52px;

      line-height: 1.4;
    }
  }

  .go_back_icon {
    position: absolute;
    top: 28px;
    left: 28px;

    display: flex;
    align-items: center;
    gap: 0.8rem;

    text-decoration: none;

    i {
      width: 17px;
    }
    span {
      font-size: 1rem;
      font-weight: 500;

      text-decoration: underline;
      text-underline-offset: 5px;
    }
  }
</style>
