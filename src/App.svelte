<script>
	import router from 'page';
	import NavBar from './template/NavBar/NavBar.svelte';
	import Footer from './template/Footer/Footer.svelte';
	import Home from './routes/Home.svelte';
	import History from './routes/History/History.svelte';
	import Spc from './routes/Spc/Spc.svelte';
	import Contact from './routes/Contact/Contact.svelte';
	import Introduction from './routes/Introduction/Introduction.svelte';

	let page;
	router('/', () => (page = Home));
	router('/introduction', () => (page = Introduction));
	router('/history', () => (page = History));
	router('/spc', () => (page = Spc));
	router('/contact', () => (page = Contact));

	router.start();
</script>

<div class="contents_container">
	<NavBar />
	<svelte:component this={page} />
	<Footer />
</div>

<style>
</style>
