---
sidebar_position: 5
---

# 아이템 5 any 타입 지양하기

any 타입을 사용하면 타입 체커와 타입스크립트 언어 서비스를 무력화시켜버린다. any 타입은 진짜 문제점을 감추며, 개발 경험을 나쁘게 하고, 타입 시스템의 신뢰도를 떨어뜨린다. 최대한 사용을 피하자.

:::note

any 가 함수 시그니처를 무시하는 것이 맞는지? → 책에서 소개하는 예제는 시그니처가 아닌 것 같다.

- [Signature (functions) - MDN Web Docs Glossary: Definitions of Web-related terms | MDN](https://developer.mozilla.org/en-US/docs/Glossary/Signature/Function)
  - 입출력을 정의하는 것을 시그니처라고 하는 거 같다.
  - parameter, return 과 같은 것을 정한다는 흐름으로 시그니처라는 용어를 사용한 거 같다.
- 함수 시그니처, 인덱스 시그니처 등등 각각을 따로 생각하는 것이 좋을 거 같다. → 모든 시그니처를 하나의 용어로 정의하면 후에 오해를 할 일이 생길 거 같다.

:::

:::note

any 활용 방법

- 타입 정의가 안 된 라이브러리를 사용할 때

:::
