<script>
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
</script>

<div class="contents">
	<div class="pad">
		<span class="subtitle">가입 및 문의</span>
		<h1>서강대학교 학부생이라면 누구나 함께할 수 있습니다.</h1>
	</div>
	<img class="pad" src="/res/labk512.jpg" alt="K512 PC Lab" />
	<div class="row pad">
		<div class="p25">
			<h2>가입</h2>
		</div>
		<div class="p75">
			<p>
				현재 모집기간이 아닙니다.
				<!--현재 2022년 Winter 신규 학회원 모집이 진행중입니다. 지원 마감은 12/17(금) 11:59까지이며, 12/20(월)~22(수)에 면접을
				통해 선발됩니다.<br /><br />
				아래 폼에서 지원하실 수 있습니다.<br />
				<a href="http://acmicpc.team/apply">http://acmicpc.team/apply</a>
				-->
			</p>
		</div>
	</div>
	<div class="hr" />
	<div class="row pad">
		<div class="p25">
			<h2>문의</h2>
		</div>
		<div class="p75">
			<p>질문은 언제나 환영합니다!</p>
			<p>
				학회 관련, 프로그래밍 대회 관련, ICPC 관련해 궁금한 점이 있으시다면 언제든 sogang@acmicpc.team 혹은 <a
					href="https://pf.kakao.com/_xewSPK"
					style="word-break: keep-all;">카카오톡 플러스친구</a
				>로 문의 부탁드립니다.
			</p>
		</div>
	</div>
	<div class="hr" />
	<div class="row pad">
		<div class="p25">
			<h2>랩 위치</h2>
		</div>
		<div class="p75">
			<p>
				K512 랩은
				<a
					href="https://www.google.com/maps/place/%EC%84%9C%EA%B0%95%EB%8C%80%ED%95%99%EA%B5%90+%EA%B9%80%EB%8C%80%EA%B1%B4%EA%B4%80/@37.5500361,126.940057,15z/data=!4m5!3m4!1s0x0:0x64853caa3a841c2b!8m2!3d37.5500361!4d126.940057"
					target="_blank">서강대학교 김대건관</a
				>
				5층 중간 즈음에 위치하고 있습니다.
				<br />
				<span style=""> 코로나 바이러스로 인해 랩실 개방은 계획에 없습니다. </span>
			</p>

			<img src="/res/map-sogang.svg" alt="서강대학교 약도" />

			<img src="/res/map-k.svg" alt="K관 약도" />
		</div>
	</div>
	<div class="hr" />
	<div class="row pad">
		<div class="p25">
			<h2>회장단</h2>
		</div>
		<div class="p75">
			<h3>2021년 - 현재</h3>
			<table style="margin-top: 16px">
				<tr>
					<td>이민희</td>
					<td>학회장</td>
					<td>mini@sogang.ac.kr</td>
				</tr>
				<tr>
					<td>이동주</td>
					<td>부학회장</td>
					<td>nant0313@gmail.com</td>
				</tr>
			</table>
		</div>
	</div>
</div>

<style>
</style>
