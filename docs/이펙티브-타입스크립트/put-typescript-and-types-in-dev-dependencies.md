---
sidebar_position: 45
---

# 아이템 45 devDependencies 에 TypeScript 와 @types 추가하기

## 요약

- 타입스크립트를 시스템 레벨로 설치하면 안 된다. 타입스크립트를 프로젝트의 devDependencies 에 포함시키고 팀원 모두가 동일한 버전을 사용하도록 해야 한다.
- @types 의존성은 dependencies 가 아니라 devDependencies 에 포함시켜야 한다. 런타임에 @types 가 필요한 경우라면 별도의 작업이 필요할 수 있다.
