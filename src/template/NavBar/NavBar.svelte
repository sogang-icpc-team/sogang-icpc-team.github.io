<div class="navbar">
  <div class="navbar_logo_container">
    <a href="/">
      <img
        class="navbar_logo"
        src="/res/logo-crimson.svg"
        alt="Sogang ACM-ICPC Team"
      />
    </a>
  </div>
  <div class="navbar_nav_container">
    <ul>
      <li class="nav_item"><a href="/introduction">소개</a></li>
      <li class="nav_item"><a href="/history">기록</a></li>
      <li class="nav_item"><a href="/spc">SPC</a></li>
      <li class="nav_item"><a href="/apply-k512">K512컵</a></li>
      <li class="nav_item"><a href="/contact">가입 및 문의</a></li>
    </ul>
  </div>
</div>

<style lang="scss">
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 1600px;
    height: 72px;
    background: #fff;
    z-index: 2000000;

    .navbar_logo_container {
      position: absolute;
      top: 14px;
      left: 64px;
      width: 44px;
      height: 44px;

      img.navbar_logo {
        position: absolute;
        top: 4px;
        left: 4px;
        height: 36px;
        width: 36px;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }

    .navbar_nav_container {
      position: absolute;
      top: 16px;
      right: 64px;
      height: 40px;
      line-height: 40px;

      li.nav_item {
        display: inline-block;
        padding-left: 18px;
        font-weight: bold;
        font-size: 0.9rem;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;

        a {
          color: black;
          text-decoration: none;
        }
      }
    }
  }
  @media only screen and (max-width: 768px) {
    .navbar > .navbar_logo_container {
      left: 32px;
    }
    .navbar > .navbar_nav_container {
      right: 32px;
    }
  }
</style>
