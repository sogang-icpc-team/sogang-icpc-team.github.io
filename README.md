# Sogang ICPC Team Offical Site

> 서강대학교 컴퓨터공학과 알고리즘 문제해결 학회 공식 홈페이지

## 설치 및 개발환경 준비

아래의 명령어를 통해 레파지토리를 클론합니다.

```shell
git clone https://github.com/sogang-icpc-team/sogang-icpc-team.github.io
```

아래의 명령어를 통해 패키지 의존성을 설치합니다.

```shell
yarn
```

의존성을 설치한 후, 아래의 명령어를 통해 Svelte.js를 개발환경에서 실행할 수 있습니다.

```shell
yarn react:dev
```

기본 포트는 `8001`로, `.env` 파일을 수정하여 개발 포트를 변경할 수 있습니다.

## 배포하기

기여자분의 `fork`한 레파지토리 혹은 `branch`에서 `main` 브랜치로 `pull request`를 보내주세요.  
`merge`가 완료되면 `github actions`를 통해 자동으로 배포됩니다.