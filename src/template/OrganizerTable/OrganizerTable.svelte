<script>
	let datas;
	fetch('/history/organizer.json')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			datas = data;
		});
</script>

<table style="min-width: 800px">
	<tr>
		<th>연도</th>
		<th>이름</th>
		<th>직책</th>
		<th>BOJ 핸들</th>
		<th>비고</th>
	</tr>
	{#if datas}
		{#each datas as data}
			<tr>
				<td rowspan={data.vicePresident ? '2' : ''}><b>{@html data.year}</b></td>
				<td>{data.president.name}</td>
				<td>학회장</td>
				<td
					><a href={`https://www.acmicpc.net/user/${data.president.boj}`} target="_blank"
						>{data.president.boj}</a
					></td
				>
				<td>
					{#if data.president.email}
						<a href={`mailto:${data.president.email}`}>{data.president.email}</a>
					{:else if data.president.link}
						<a href={data.president.link}>{data.president.link}</a>
					{:else}{/if}
				</td>
			</tr>
			{#if data.vicePresident}
				<tr>
					<td>{data.vicePresident.name}</td>
					<td>부학회장</td>
					<td>
						<a href={`https://www.acmicpc.net/user/${data.vicePresident.boj}`} target="_blank"
							>{data.vicePresident.boj}</a
						>
                    </td>
                    <td>
						{#if data.vicePresident.email}
							<a href={`mailto:${data.vicePresident.email}`}>{data.vicePresident.email}</a>
						{:else if data.vicePresident.link}
							<a href={data.vicePresident.link}>{data.vicePresident.link}</a>
						{:else}{/if}
					</td>
				</tr>
			{/if}
		{/each}
	{/if}
</table>
