<script>
	export let title, award, thead, tbody, link;
</script>

<div class="row pad">
	<div class="p25">
		<h2>{title}</h2>
	</div>
	<div class="p75">
		<div class="table_container">
			<table>
				<thead
					><tr>
						{#each thead as data}
							<th>{data}</th>
						{/each}
					</tr></thead
				>
				<tbody>
					{#each tbody as data, idx1}
						<tr>
							{#each data as col, idx2}
								{#if idx2 === 0}
									<td class="ranking--wrapper"
										>{col}<i class={`award ${award[idx1]}`}>
											{#if award[idx1] === 'gold' || award[idx1] === 'silver' || award[idx1] === 'bronze' || award[idx1] === 'special'}
												&#11044;
											{:else if award[idx1] === 'winner'}
												&#9733;
											{:else if award[idx1] === 'advanced'}
												&#9650;
											{/if}
										</i></td
									>
								{:else}
									<td>{col}</td>
								{/if}
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p />
		{#if link}
			<ul>
				{#each link as elem}
					<li><a href={elem[1]} target="_blank">{elem[0]}</a></li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
<style lang="scss">
	table{
		min-width: 800px;
	}
	.ranking--wrapper{
		position:relative;
		i{
			position:absolute;
		}
	}
</style>