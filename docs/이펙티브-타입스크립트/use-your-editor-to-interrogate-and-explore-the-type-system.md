---
sidebar_position: 6
---

# 아이템 6 편집기를 사용하여 타입 시스템 탐색하기

타입스크립트를 설치하면 다음 두 가지를 실행할 수 있다.

- 타입스크립트 컴파일러 (tsc)
- 단독으로 실행할 수 있는 타입스크립트 서버 (tsserver)

편집기를 통해 타입스크립트가 언제 타입 추론을 수행하는지 개념을 잡을 수 있다. 이러한 개념을 잡으면 간결하고 읽기 쉬운 코드를 작성할 수 있다.

특정 시점에 타입스크립트가 값의 타입을 어떻게 이해하고 있는지 살펴보는 것은 “타입 넓히기”와 “타입 좁히기”의 개념을 위해 필요한 과정이다.

편집기의 타입 오류를 살펴보면서 타입 시스템의 성향을 파악할 수 있다.

```ts
function getElement(elOrId: string | HTMLElement | null): HTMLElement {
  if (typeof elOrId === 'object') {
    return elOrId;
    // ERROR: 'HTMLElement | null' 형식은 'HTMLElement' 형식에 할당할 수 없음
  } else if (elOrId === null) {
    return document.body;
  } else {
    const el = document.getElementById(elOrId);
    return el;
    // ERROR: 'HTMLElement | null' 형식은 'HTMLElement' 형식에 할당할 수 없음
  }
}
```

- 첫 번째 오류: 자바스크립트에서 `typeof null` 은 `object` 이므로, `elOrId` 는 `null` 가능성이 있다.
- 두 번째 오류: `document.getElementById` 가 `null` 을 반환할 가능성이 있다.

타입스크립트 언어 서비스는 라이브러리와 라이브러리의 타입 선언을 탐색할 때 유용하다.
편집기에서 “Go to Definition” 옵션을 사용해서 타입스크립트에 포함되어 있는 DOM 타입 선언인 `lib.dom.d.ts` 파일로 이동할 수 있다.

```ts
declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
```

```ts
declare var Request: {
  prototype: Request;
  new (input: RequestInfo, init?: RequestInit): Request;
};
```

```ts
interface RequestInit {
  body?: BodyInit | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  // ...
}
```

:::note

VS Code 에서 유용한 기능

- [TypeScript editing with Visual Studio Code](https://code.visualstudio.com/docs/typescript/typescript-editing)
- [Quokka.js - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode)

:::

## 요약

- 편집기에서 타입스크립트 언어 서비스를 적극 활용해야 한다.
- 편집기를 사용하면 어떻게 타입 시스템이 동작하는지, 그리고 타입스크립트가 어떻게 타입을 추론하는지 개념을 잡을 수 있다.
- 타입스크립트가 동작을 어떻게 모델링하는지 알기 위해 타입 선언 파일을 찾아보는 방법을 터득해야 한다.
