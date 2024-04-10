<script>
  import { onMount, onDestroy } from "svelte";
  import {
    showTopBar as showTopBarStore,
    showFooter as showFooterStore,
  } from "../../template/NavBar/store";
  let admission_url =
    "https://docs.google.com/forms/d/e/1FAIpQLSfcU8SC6PWg2iA7zLytnAl9WyqqCTA_hAlzBPeyD3S1EUyKUQ/viewform?embedded=true";

  const sponsers = ["mobis", "furiosa", "common-computer", "startlink"];

  onMount(() => {
    document.querySelector(".contents_container").style = "max-width: unset;";

    showTopBarStore.update(() => false);
    showFooterStore.update(() => false);
  });
  onDestroy(() => {
    document.querySelector(".contents_container").style = "max-width: 1600px;";
    showTopBarStore.update(() => true);
    showFooterStore.update(() => true);
  });
</script>

<a class="go_back_icon" href="/spc">
  <i class="material-icons main">arrow_backward</i>
  <span>SPC 메인으로</span>
</a>
<div class="contents">
  <div class="title">
    <div class="hero">
      <img alt="partying-face" src="/res/22-spc/partying-face.gif" />
      <br /> 총 상금
      <span style="background: yellow; color:black; padding: 0 0.2rem;"
        >250만원</span
      ><br />
      지금 신청하고 우승의 주인공이 되세요
    </div>

    <div class="spc-winner-wrapper" style="color:white;">
      <span class="spc-winner-title"
        ><img alt="crown" src="/res/22-spc/crown.gif" style="width:3rem;" /><br
        />역대 SPC 우승자
      </span>
      <div>
        <span class="spc-winner-title">2020</span><br />Master 강효규<br
        />Champion 고성빈
      </div>
      <div>
        <span class="spc-winner-title">2021</span><br />Master 손기령<br
        />Champion 전해성
      </div>
      <div>
        <span class="spc-winner-title">2022</span>
        <div class="ellipsis">⋮</div>
        <div
          style="font-weight:700; font-size:3rem;
          padding: 0rem 1rem;
          background:var(--sg-icpc-color);"
        >
          Who's NEXT?
        </div>
      </div>
    </div>
    <img
      alt="sogang-logo"
      class="spc_title_logo"
      src="/res/22-spc/sogang-logo.svg"
    />
    <img alt="spc-title" class="spc_title" src="/res/22-spc/spc-title.svg" />
  </div>

  <!-- <div class="section">
    <span class="section-title">신청 기간</span>
    <div class="section-body apply-duration-wrapper">
      11월 7일(월) <i class="material-icons">arrow_forward</i> 18일(금)
    </div>
  </div> -->

  <div class="section">
    <span class="section-title">일시 및 장소</span>
    <div class="section-body">
      11월 26일 토요일 오후 2시<i class="material-icons">arrow_forward</i>6시<br
      />@다산관 D104/105
    </div>
  </div>

  <div class="section">
    <span class="section-title">Sponsored by</span>
    <div class="section-body sponser-images-wrapper">
      {#each sponsers as sponser}
        <img alt="sponser" src={`/res/22-spc/sponser-${sponser}.svg`} />
      {/each}
    </div>
  </div>

  <div class="section">
    <span class="section-title">대회 신청 폼</span>
    11월 18일까지
    <div>
      <a style="font-size: .8rem;" target="_blank" href={admission_url}
        >폼이 보이지 않나요? <i
          class="material-icons"
          style="font-size:0.8rem;text-decoration: underline;">open_in_new</i
        ></a
      >
    </div>
  </div>
  <!-- <span style="font-size: 3rem;margin: 2rem 0;text-align:center;">👇🏻</span> -->
  <iframe
    src={admission_url}
    title="2022 SPC 신청"
    height={3280}
    frameborder={0}
    marginheight={0}
    marginwidth={0}
  />
</div>

<style lang="scss">
  * {
    --sg-icpc-color: #b60005;
  }
  img {
    pointer-events: none;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
  }
  .ellipsis {
    font-size: 2.8rem;
    margin: 0.8rem 0;

    background: rgb(2, 0, 36);
    background: linear-gradient(0deg, black 0%, white 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  span,
  div {
    font-family: "Pretendard";
    color: white;
  }
  .section {
    padding: 0 1rem;
    text-align: center;
    margin: 4rem 0 1rem;
    .section-title {
      font-size: 1.4rem;
      font-weight: 500;
    }
    .section-body {
      margin-top: 2rem;
      font-size: 1.8rem;
      @media only screen and (max-width: 768px) {
        font-size: 1.2rem;
        i {
          font-size: 1.2rem;
        }
      }
    }
  }
  .sponser-images-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8rem;
    @media only screen and (max-width: 768px) {
      gap: 4rem;
    }
    img {
      width: 10rem;
    }
  }
  .apply-duration-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
  }
  .spc-winner-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    margin: 2.8rem 0 4rem;
    .spc-winner-title {
      font-weight: 600;
      font-size: 1.6rem;
    }
  }
  .hero {
    text-align: center;
    font-weight: 700;
    font-size: 2rem;
    padding: 0 4rem;
    img {
      width: 6rem;
    }
  }
  iframe {
    overflow: hidden;
  }
  .go_back_icon {
    position: absolute;
    left: 1rem;
    top: 1rem;

    display: flex;
    align-items: center;
    gap: 0.8rem;

    i {
      // display: flex;
      width: 17px;
    }
    span {
      font-size: 1rem;
      font-weight: 500;
    }
  }
  .contents {
    margin-top: unset !important;
  }
  .title {
    padding: 5rem 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
    .spc_title_logo {
      width: 20%;
    }
    .spc_title {
      width: 60%;
    }
    @media only screen and (max-width: 768px) {
      .spc_title_logo {
        width: 35%;
      }
      .spc_title {
        width: 90%;
      }
    }
  }
  .contents {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: black;
  }
</style>
