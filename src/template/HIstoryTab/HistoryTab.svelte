<script>
	export let yearsList, curYear;

	const switchSelected = (e) => {
        // Change curYear Value To Re-fetch Json
        curYear = e.target.textContent
        
        // Toggling Class
		let ul = e.target.closest('li').parentElement;
		ul.querySelectorAll('li').forEach((ele) => {
            if(ele !== e.target)
			    ele.classList.remove('selected');
		});
        e.target.closest('li').classList.add('selected')
	};
</script>

{#if yearsList}
	{#each yearsList as data, idx}
		<li class={idx == 0 ? 'selected' : ''} on:click={switchSelected}>
			<span class="tab_text">{data}</span>
		</li>
	{/each}
{/if}
