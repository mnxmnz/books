---
sidebar_position: 14
---

# 아이템 14 타입 연산과 제너릭 사용으로 반복 줄이기

반복을 줄이는 가장 간단한 방법은 타입에 이름을 붙이는 것이다.

```ts
function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
```

```ts
interface Point2D {
  x: number;
  y: number;
}

function distance(a: Point2D, b: Point2D) {
  /* ... */
}
```

함수가 같은 타입 시그니처를 공유하면 명명된 타입으로 분리해 낼 수 있다.

```ts
function get(url: string, opts: Options): Promise<Response> {
  /* ... */
}
function post(url: string, opts: Options): Promise<Response> {
  /* ... */
}
```

```ts
type HTTPFunction = (url: string, opts: Options) => Promise<Response>;

const get: HTTPFunction = (url, opts) => {
  /* ... */
};
const post: HTTPFunction = (url, opts) => {
  /* ... */
};
```

다음과 같이 중복을 제거할 수 있다.

```ts
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}
interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}
```

```ts
type TopNavState = {
  userId: State['userId'];
  pageTitle: State['pageTitle'];
  recentFiles: State['recentFiles'];
};
```

```ts
type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k];
};
```

매핑된 타입은 배열의 필드를 루프 도는 것과 같은 방식이다. `Pick` 이라고 한다.

```ts
type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```

`Pick` 은 제너릭 타입이다. `Pick` 을 사용하는 것은 함수를 호출하는 것과 마찬가지이다. `Pick` 은 `T` 와 `K` 두 가지 타입을 받아서 결과 타입을 반환한다.

## 요약

- DRY 원칙을 타입에도 적용해야 한다.
- 타입에 이름을 붙여서 반복을 피하고, `extends` 를 사용해서 인터페이스 필드의 반복을 피해야 한다.
- `keyof` , `typeof` , 인덱싱, 매핑된 타입을 사용해서 타입을 매핑할 수 있다.
- 타입을 반복하는 대신 제너릭 타입을 사용하여 타입 간에 매핑을 하는 것이 좋다. 제너릭 타입을 제한하려면 `extends` 를 사용하면 된다.
