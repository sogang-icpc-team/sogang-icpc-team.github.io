<script>
	export let title, tbody;
</script>

<div class={`row pad review_table hide`}>
	<div class="p25">
		<h2>{title}</h2>
	</div>
	<div class="p75">
		<div class="table_container">
			<table>
				<thead
					><tr>
						<th>링크</th>
					</tr></thead
				>
				<tbody>
					{#each tbody as data, idx1}
						<tr>
							<td><a href={data[1]}>{data[0]}</a></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p />
	</div>
</div>

<style lang="scss">
	.hide {
		display: none;
	}
	.show {
		display: block;
	}
</style>
