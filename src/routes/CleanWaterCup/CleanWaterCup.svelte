<script>
  import { onMount } from "svelte";

  import HistoryTable from "../../template/HistoryTable/HistoryTable.svelte";
  import HistoryTab from "../../template/HistoryTab/HistoryTab.svelte";
  let spcData;
  let yearsList,
    curYear = "2021";
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

<div class="contents">
  <div
    class="pad"
    style="    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;"
  >
    <img
      alt="clean-water-cup-logo"
      src="/res/clean-water/clean-water-logo.svg"
      style="width: 2.4rem;"
    />
    <h1 style="text-align:center;color:var(--clean-water-color)">
      서강대학교 청정수컵
    </h1>
  </div>
  <!-- <div class="spc_banner_big_wrap" on:click={onBannerClick}>
      <img class="spc_banner_big" src="/res/21-spc-banner-big.svg" />
    </div>
    <div class="spc_banner_small_wrap" on:click={onBannerClick}>
      <img class="spc_banner_small" src="/res/21-spc-banner-small.svg" />
    </div> -->
  <div
    class="row pad first_paragraph"
    style="padding: 16px 64px; text-align:center;"
  >
    <div class="p75">
      청정수컵은 Sogang ICPC Team 학회원 중 문제해결 초심자들을 위한 프로그래밍
      대회입니다.<br />
      초심자들이 문제풀이의 재미를 느끼게 만드는 것을 목표로 개최되었습니다.
      <br />청정수컵은 참가자뿐만아니라 출제진과 운영진 모두 Sogang ICPC Team
      학회원으로 구성된 뜻깊은 대회입니다.
    </div>
  </div>
  <img
    class="pad"
    src="/res/clean-water/main.jpg"
    alt="2019 Sogang Programming Contest"
  />
</div>

<style>
  .spc_banner_big_wrap {
    display: flex;
    width: 100%;
    justify-content: center;
    cursor: pointer;
  }
  .spc_banner_big {
    width: 91%;
    margin: 10px 0 20px 0;
  }
  .spc_banner_small_wrap {
    display: none;
    width: 100%;
    justify-content: center;
    cursor: pointer;
  }
  .spc_banner_small {
    width: 100%;
  }
  @media only screen and (max-width: 768px) {
    .spc_banner_big_wrap {
      display: none;
    }
    .spc_banner_small_wrap {
      display: flex;
    }
  }
</style>
