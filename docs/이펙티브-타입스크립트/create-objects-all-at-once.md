---
sidebar_position: 23
---

# 아이템 23 한꺼번에 객체 생성하기

객체를 나눠서 생성할 때 타입 단언문을 사용하면 타입 체커를 통과할 수 있다.

```ts
interface Point {
  x: number;
  y: number;
}

const pt = {} as Point;

pt.x = 3;
pt.y = 4;
```

작은 객체를 조합해서 큰 객체를 생성할 때도 여러 단계를 거치는 것은 안 좋다.

```ts
const pt = { x: 3, y: 4 };
const id = { name: 'Pythagoras' };
const namedPoint = {};

Object.assign(namedPoint, pt, id);

namedPoint.name;
// ERROR: '{}' 형식에 'name' 속성이 없습니다.
```

다음과 같이 전개 연산자 … 를 사용하면 큰 객체를 한 번에 만들 수 있다.

```ts
const namedPoint = { ...pt, ...id };

namedPoint.name; // 타입: name: string
```

속성을 추가하지 않는 null 또는 { } 로 객체 전개를 사용하면 타입에 안전한 방식으로 조건부 속성을 추가할 수 있다.

```ts
declare let hasMiddle: boolean;

const firstLast = { first: 'Harry', last: 'Truman' };
const president = { ...firstLast, ...(hasMiddle ? { middle: 'S' } : {}) };

// const president: {
//   middle?: string | undefined;
//   first: string;
//   last: string;
// }
```

- `president` 는 선택적 속성을 가진다.

객체나 배열을 변환해서 새로운 객체나 배열을 생성하고 싶을 수 있다. 이런 경우 루프 대신 내장된 함수형 기법 또는 로대시 같은 유틸리티 라이브러리를 사용하는 것이 “한 번에 객체 생성하기” 관점에서 보면 옳다.

## 요약

- 속성을 제각각 추가하지 말고 한꺼번에 객체로 만들어야 한다. 안전한 타입으로 속성을 추가하려면 객체 전개(`{…a, …b}`)를 사용하면 된다.
- 객체에 조건부로 속성을 추가하는 방법을 익히자.

:::note

스프레드 연산자

[proposal-object-rest-spread/Spread.md at main · tc39/proposal-object-rest-spread](https://github.com/tc39/proposal-object-rest-spread/blob/main/Spread.md)

- 이러한 내용은 제안만 한 내용도 모두 포함한다.
- 모두 반영이 되었는지는 확인할 수 없다.
- (+) 스펙을 읽을 때 GPT 를 활용하면 좋다.

[proposals/finished-proposals.md at main · tc39/proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)

- 반영된 스펙이라는 것을 확인할 수 있다.

:::
