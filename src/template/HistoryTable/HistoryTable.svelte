<script>
	export let title, info, award, thead, tbody, link, isReviewAvail;

	const onReviewClick = (e) => {
		let nextElem = e.target.closest('.pad').nextElementSibling;
		nextElem.classList.toggle('hide');
		nextElem.classList.toggle('show');
	};
</script>

<div class={`row pad`}>
	<div class="p25">
		<h2>{title}</h2>
		{#if info}
			<div>
				{info.date}<br/>
				{info.place}
			</div>
		{/if}
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
		<ul>
			{#if link}
				{#each link as elem}
					<li><a href={elem[1]} target="_blank">{elem[0]}</a></li>
				{/each}
				{#if isReviewAvail}
					<li class="review_table_btn" on:click={onReviewClick}>대회 후기</li>
				{/if}
			{/if}
		</ul>
	</div>
</div>

<style lang="scss">
	table {
		min-width: 800px;
	}
	.ranking--wrapper {
		position: relative;
		i {
			position: absolute;
		}
	}
	.hide {
		display: none;
	}
	.show {
		display: block;
	}
	.review_table_btn {
		cursor: pointer;
		text-decoration: underline;
	}
</style>
