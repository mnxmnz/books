---
sidebar_position: 52
---

# 아이템 52 테스팅 타입의 함정에 주의하기

문제점을 방지하기 위해 [dtslint](https://github.com/microsoft/dtslint) 같은 도구를 사용하는 것이 좋다.

## 요약

- 타입을 테스트할 때는 특히 함수 타입의 동일성(equality)과 할당 가능성(assignability)의 차이점을 알고 있어야 한다.
- 콜백이 있는 함수를 테스트할 때 콜백 매개변수의 추론된 타입을 체크해야 한다. 또한 `this` 가 API 의 일부분이라면 역시 테스트해야 한다.
- 타입 관련된 테스트에서 `any` 를 주의해야 한다. 더 엄격한 테스트를 위해 [dtslint](https://github.com/microsoft/dtslint) 같은 도구를 사용하는 것이 좋다.

:::note

📖 dtslint repo has moved: dtslint is now part of [DefinitelyTyped-tools](https://github.com/microsoft/DefinitelyTyped-tools)

:::

:::note

헬퍼 함수 참조

[total-typescript/typescript-generics-workshop](https://github.com/total-typescript/typescript-generics-workshop/blob/main/src/helpers/type-utils.ts)

:::
