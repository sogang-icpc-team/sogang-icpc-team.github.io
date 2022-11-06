<script>
  export let showPopup;
  const closePopup = () => (showPopup = false);
</script>

<div class="popup_backdrop" />
<div class="popup_wrapper" on:click={closePopup}>
  <div style="position: relative;">
    <a href="/22-spc">
      <img
        on:click={(e) => e.stopPropagation()}
        class="spc_image"
        alt="spc_image"
        src="/res/22-spc/homepage-banner.png"
      />
    </a>
    <i class="material-icons close-icon">close</i>
  </div>
</div>

<style lang="scss">
  .popup_backdrop {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 2000001;
  }
  .popup_wrapper {
    cursor: pointer;
    z-index: 2000002;
    width: 100vw;
    height: 100vh;
    top: 0;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    .spc_image {
      width: 60vw;
      margin: 0 auto;
      @media only screen and (max-width: 768px) {
        width: 90vw;
      }
    }
  }
  .close-icon {
    position: fixed;
    font-size: 2rem;
    font-weight: 700;
    transform: translate(-100%, -100%);
  }
</style>
