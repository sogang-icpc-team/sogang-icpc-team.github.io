<script>
</script>

<div class="footer">
	<div class="footer_item_container">
		<div class="footer_item">
			<div>
				<div class="left">Sogang ICPC Team</div>
				<div class="right">
					04107<br />
					서울특별시 마포구 백범로 35<br />
					서강대학교 김대건관<br />
					5층 K512<br />
					sogang@acmicpc.team
				</div>
			</div>
		</div>
		<div class="footer_item">
			<div>
				<div class="left">학회장</div>
				<div class="right">
					이민희<br />
					minigimbob@gmail.com
				</div>
			</div>
			<div>
				<div class="left">부학회장</div>
				<div class="right">
					이동주<br />
					nant0313@gmail.com
				</div>
			</div>
		</div>
	</div>
	<div class="footer_desc">
		<span class="copyright">© 2005—2021 Sogang ICPC Team</span>
		<ul>
			<li><a href="http://cs.sogang.ac.kr" target="_blank">컴퓨터공학과</a></li>
			<li><a href="https://www.acmicpc.net/group/4963" target="_blank">BOJ 그룹</a></li>
			<li><a href="https://solved.ac" target="_blank">solved.ac</a></li>
		</ul>
		<img class="footer_logo" src="/res/logo-white.svg" alt="Sogang ICPC Team" />
	</div>
</div>

<style lang="scss">
	div.footer {
		margin-top: 32px;
		padding: 64px 64px;
		font-size: 0.9rem;
		background: #b60005;
		color: #fff;

		div.footer_item_container {
			font-size: 0;
		}
		div.footer_item {
			display: inline-block;
			vertical-align: top;
			width: 50%;
			line-height: 1.7;
		}
		&*::selection {
			background: rgba(255, 255, 255, 0.5);
			color: #fff;
		}
	}

	div.footer_item {
		div {
			padding-bottom: 16px;
		}
		a {
			color: inherit;
		}
		div.left,
		div.right {
			display: inline-block;
			vertical-align: top;
			width: 50%;
			font-size: 0.8rem;
			padding-right: 16px;
		}
		div.left {
			font-weight: bold;
		}
	}
	div.footer_desc {
		position: relative;
		color: #fff;
		line-height: 36px;
		margin-top: 32px;
		ul {
			display: inline-block;
		}
		span.copyright {
			display: inline-block;
			padding-right: 18px;
			font-size: 0.8rem;
		}
		li {
			display: inline-block;
			padding-right: 18px;
			font-weight: bold;
			font-size: 0.8rem;
			-moz-user-select: none;
			-khtml-user-select: none;
			-webkit-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
		li a {
			color: inherit;
		}
	}

	img.footer_logo {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 36px;
		height: 36px;
		-moz-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	@media only screen and (max-width: 768px) {
		div.footer {
			padding: 64px 32px;
		}
		div.footer div.footer_item {
			display: block;
			width: 100%;
		}
	}
</style>
