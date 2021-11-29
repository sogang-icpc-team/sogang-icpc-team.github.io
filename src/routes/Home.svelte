<script>
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
</script>

<div class="contents">
	<div class="pad">
		<div class="main_title text">
			Make it.<br />
			Solve it.
		</div>
		<p class="main_desc text">
			Sogang ICPC Team —<br />	
			서강대학교 컴퓨터공학과 알고리즘 문제해결 학회<br />
		</p>
	</div>
	<!--
    <div class="row pad urgent">
        <div class="p25">
            <h2>대회 등록</h2>
        </div>
        <div class="p75">
            <h1>ICPC Seoul Regional 2019 등록 <a href="https://docs.google.com/forms/d/e/1FAIpQLSctQBMh-G3JSFFW67vgbYLHdvE8Vy2xEaYPSXEQd8IbavJS6A/viewform"><i class="material-icons main">arrow_forward</i></a></h1>
            <p>
                신청 기한: 9월 12일 (목요일)
            </p>
        </div>
    </div> -->
	<img class="pad" src="/res/21-icpc-wf-1.jpg" alt="" />
	<div class="row pad">
		<div class="p25">
			<h2>소개</h2>
		</div>
		<div class="p75">
			<h1>
				우리는 알고리즘을 공부하고, 알고리즘으로 문제를 해결합니다. <a href="/introduction"
					><i class="material-icons main">arrow_forward</i></a
				>
			</h1>
		</div>
	</div>
	<div class="hr" />
	<div class="row pad">
		<div class="p25">
			<h2>기록</h2>
		</div>
		<div class="p75">
			<h1>
				매년 여러 대회에 참가해 우수한 성적을 거두고 있습니다. <a href="/history"
					><i class="material-icons main">arrow_forward</i></a
				>
			</h1>
		</div>
	</div>
	<div class="hr" />
	<div class="row pad">
		<div class="p25">
			<h2>Sogang Programming Contest</h2>
		</div>
		<div class="p75">
			<h1>
				논리력과 문제 해결 능력을 겨루는 대회입니다. <a href="/spc"
					><i class="material-icons main">arrow_forward</i></a
				>
			</h1>
		</div>
	</div>
	<div class="hr" />
	<div class="row pad">
		<div class="p25">
			<h2>가입 및 문의</h2>
		</div>
		<div class="p75">
			<h1>
				서강대학교 학부생이라면 누구나 함께할 수 있습니다. <a href="/contact"
					><i class="material-icons main">arrow_forward</i></a
				>
			</h1>
		</div>
	</div>
</div>

<style>
</style>
