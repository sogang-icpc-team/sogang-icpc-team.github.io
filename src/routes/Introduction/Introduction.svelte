<script>
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
</script>

<div class="contents">
	<div class="pad">
		<span class="subtitle">소개</span>
		<h1>우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다.</h1>
	</div>
	<div class="row pad first_paragraph">
		<div class="p25">
			<h2>이곳은</h2>
		</div>
		<div class="p75">
			컴퓨터과학과 소프트웨어 공학의 근간이 되는, 알고리즘을 공부하는 서강대학교 컴퓨터공학과 학회입니다. 2005년에
			이한승, 심재은, 김영욱 동문께서 주축이 되어 ICPC 출전을 준비하기 위해 Sogang ACM-ICPC Team으로 시작해서,
			지금은 ICPC 뿐만 아니라 Google Code Jam, SCPC, Kakao Code Festival 등 여러 대회에 참가하고 있습니다. 또한
			교내 대회인 Sogang Programming Contest를 주관하고 있습니다.
		</div>
	</div>
	<img class="pad" src="/res/icpc2019-redshift.jpg" />
	<div class="row pad">
		<div class="p25">
			<h2>ICPC 참가</h2>
		</div>
		<div class="p75">
			<p>
				<a href="https://icpckorea.org" target="_blank">ICPC</a>(International Collegiate Programming
				Contest)는 국제 대학생 프로그래밍 경시대회로, 가장 긴 역사를 가지고 있는 권위 있는 프로그래밍
				대회입니다. 학부생 3명이 한 팀을 구성해 참가해 제한된 시간 내에 주어진 문제들을 프로그래밍으로 해결해야
				합니다. 학회의 이름에서 보이듯이 매년 이 대회에 참가하는 것이 학회 활동의 주 목적 중 하나이기도 합니다.
			</p>
			<p>
				Sogang ICPC Team이 생긴 2007년부터 지금까지 매년 한국 지역 본선에 꾸준히 참가해 왔고, 우수한 성적을
				거두고 있습니다.
			</p>
			<div class="button_container">
				<a href="/history" target="_blank"><div class="button">참여 기록</div></a>
			</div>
		</div>
	</div>
	<div class="row pad">
		<div class="p25">
			<h2>프로그래밍 대회 참가</h2>
		</div>
		<div class="p75">
			<p>
				Google <a href="https://codingcompetitions.withgoogle.com/codejam" target="_blank">Code Jam</a>, 삼성
				<a href="https://www.codeground.org" target="_blank">대학생 프로그래밍 경진대회</a>(SCPC), Kakao
				<a href="https://www.kakaocode.com" target="_blank">Code Festival</a> 등 여러 기업 주최 오프라인 대회에도
				참가하고 있습니다.
			</p>
			<p>
				또한 전국 대학생 프로그래밍 대회 동아리 연합 (전대프연)
				<a href="https://ucpc.me" target="_blank">프로그래밍 대회</a>(UCPC) 등의 대회에도 참가하고
				있습니다.
			</p>
			<div class="button_container">
				<a href="/history" target="_blank"><div class="button">참여 기록</div></a>
			</div>
		</div>
	</div>
	<img class="pad" src="/res/acm-solving.jpg" alt="Problem solving" />
	<div class="row pad">
		<div class="p25">
			<h2>알고리즘 스터디</h2>
		</div>
		<div class="p75">
			<p>
				학회에 같이 모여서 알고리즘 공부를 합니다. 학회원들의 문제 해결 능력을 업그레이드하기 위해 매 학기
				알고리즘 스터디를 진행합니다.
			</p>
			<p>
				스터디는 수준에 따라 초급, 중급으로 나뉘어져 있고, 주로
				<a href="https://www.acmicpc.net" target="_blank">Baekjoon OJ</a>에서 문제를 푸는 방식으로 진행됩니다.
				학회원 누구나 자유롭게 참여할 수 있습니다. 계절학기에도 쉬지 않고 진행합니다!
			</p>
		</div>
	</div>
	<div class="row pad">
		<div class="p25">
			<h2>문제 해결</h2>
		</div>
		<div class="p75">
			<p>
				<a href="https://www.acmicpc.net" target="_blank">Baekjoon OJ</a> 등의 온라인 저지에 있는 많은 문제들을
				해결해 나갑니다. 또한 <a href="https://codeforces.com" target="_blank">Codeforces</a>,
				<a href="https://atcoder.jp" target="_blank">AtCoder</a> 등에서 주기적으로 열리는 많은 온라인 대회에도 꾸준히
				참가하면서 알고리즘 실력을 함께 키워나갑니다.
			</p>
			<div class="button_container">
				<a href="https://www.acmicpc.net/school/ranklist/292" target="_blank"
					><div class="button">BOJ 랭킹</div></a
				>
				<a href="https://codeforces.com/ratings/organization/1637" target="_blank"
					><div class="button">Codeforces 랭킹</div></a
				>
			</div>
		</div>
	</div>
	<div class="row pad">
		<div class="p25">
			<h2>SPC 주관</h2>
		</div>
		<div class="p75">
			<p>
				ICPC 한국 지역 본선 1, 2위 수상팀은 매년 열리는 교내 프로그래밍 대회
				<a href="/spc" target="_blank">Sogang Programming Contest</a>를 주관합니다. 대회 전반을 준비하고,
				문제도 출제합니다.
			</p>
			<p>Sogang Programming Contest는 서강대학교 학부생이라면 누구나 참가할 수 있습니다.</p>
			<div class="button_container">
				<a href="/spc" target="_blank"><div class="button">대회 정보</div></a>
			</div>
		</div>
	</div>
	<div class="row pad">
		<div class="p25">
			<h2>랩 관리</h2>
		</div>
		<div class="p75">
			<p>김대건관 컴퓨터공학과 실습실 K512를 관리합니다.</p>
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
			</p>

			<img src="/res/map-sogang.svg" alt="서강대학교 약도" />

			<img src="/res/map-k.svg" alt="K관 약도" />
		</div>
	</div>
</div>

<style>
</style>
