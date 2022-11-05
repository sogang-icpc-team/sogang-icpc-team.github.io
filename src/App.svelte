<script>
  import router from "page";
  import NavBar from "./template/NavBar/NavBar.svelte";
  import Footer from "./template/Footer/Footer.svelte";
  import Home from "./routes/Home.svelte";
  import History from "./routes/History/History.svelte";
  import Spc from "./routes/Spc/Spc.svelte";
  import Contact from "./routes/Contact/Contact.svelte";
  import Introduction from "./routes/Introduction/Introduction.svelte";

  // 필요한 데이터 fetch
  let latestOrganizerData;
  async function getLatestOrganizer() {
    const response = await fetch("/history/organizer.json");
    const data = await response.json();
    return (latestOrganizerData = data[0]);
  }
  getLatestOrganizer();

  // 라우터 정의
  let page, params;
  router("/", () => (page = Home));
  router("/introduction", () => (page = Introduction));
  router("/history", () => (page = History));
  router("/spc", () => (page = Spc));
  router(
    "/contact",
    async (ctx, next) => {
      ctx.params.latestOrganizerData = await getLatestOrganizer();
      params = ctx.params;
      next();
    },
    () => (page = Contact),
  );

  router.start();
</script>

<svelte:head>
  <title>Sogang ICPC Team</title>
  <meta charset="UTF-8" />
  <meta name="theme-color" content="#FFFFFF" />
  <meta name="viewport" content="width=device-width, user-scalable=no" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <link rel="icon" href="/res/logo-crimson.svg" />
  <link
    rel="stylesheet"
    type="text/css"
    href="//fonts.googleapis.com/css?family=Noto+Sans+KR:400,700"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="//fonts.googleapis.com/icon?family=Material+Icons"
  />
</svelte:head>
<div class="contents_container">
  <NavBar />
  <svelte:component this={page} {params} />
  <Footer data={latestOrganizerData} />
</div>

<style>
</style>
