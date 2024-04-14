---
sidebar_position: 12
---

# 아이템 12 함수 표현식에 타입 적용하기

타입스크립트에서는 함수 표현식을 사용하는 것이 좋다. 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재사용할 수 있기 때문이다.

```ts
type DiceRollFn = (sides: number) => number;

const rollDice: DiceRollFn = sides => {
  /* COMPRESS */ return 0; /* END */
};
```

함수 타입의 선언은 불필요한 코드의 반복을 줄인다.

```ts
function add(a: number, b: number) {
  return a + b;
}
function sub(a: number, b: number) {
  return a - b;
}
function mul(a: number, b: number) {
  return a * b;
}
function div(a: number, b: number) {
  return a / b;
}
```

```ts
type BinaryFn = (a: number, b: number) => number;

const add: BinaryFn = (a, b) => a + b;
const sub: BinaryFn = (a, b) => a - b;
const mul: BinaryFn = (a, b) => a * b;
const div: BinaryFn = (a, b) => a / b;
```

함수 구현부를 분리해서 로직이 분명해진다.

시그니처가 일치하는 다른 함수가 있을 때도 함수 표현식에 타입을 적용할 수 있다.

```ts
const responseP = fetch('/quote?by=Mark+Twain'); // Type is Promise<Response>
```

```ts
async function getQuote() {
  const response = await fetch('/quote?by=Mark+Twain');
  const quote = await response.json();

  return quote;
}

// {
//   "quote": "If you tell the truth, you don't have to remember anything.",
//   "source": "notebook",
//   "date": "1894"
// }
```

`/quote` 가 존재하지 않는 API 일 때 ‘404 Not Found’를 포함한 내용을 응답한다. 응답은 JSON 형식이 아닐 수 있다. `response.json()` 은 JSON 형식이 아니라는 새로운 오류 메시지를 담아 rejected 프로미스를 반환한다. 호출한 곳에서는 새로운 오류 메시지가 전달되어 실제 오류인 404가 감추어진다. 또한, `fetch` 가 실패하면 rejected 프로미스를 응답하지 않는다는 걸 간과하기 쉽다. 상태 체크를 수행할 `checkedFetch` 함수 작성이 필요하다.

`fetch` 의 타입 선언은 `lib.dom.d.ts` 에 있으며 다음과 같다.

```ts
declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
```

`checkedFetch` 는 다음과 같다.

```ts
async function checkedFetch(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    // Converted to a rejected Promise in an async function
    throw new Error('Request failed: ' + response.status);
  }

  return response;
}
```

더 간결하게 작성하면 다음과 같다.

```ts
const checkedFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error('Request failed: ' + response.status);
  }

  return response;
};
```

`throw` 대신 `return` 을 사용하면 에러가 발생한다.

```ts
const checkedFetch: typeof fetch = async (input, init) => {
  //  ~~~~~~~~~~~~   Type 'Promise<Response | HTTPError>' is not assignable to type 'Promise<Response>'
  //                 Type 'Response | HTTPError' is not assignable to type 'Response'
  const response = await fetch(input, init);

  if (!response.ok) {
    return new Error('Request failed: ' + response.status);
  }

  return response;
};
```

`checkedFetch` 구현체가 아닌 함수를 호출한 위치에서 발생한다.

함수의 매개변수에 타입 선언을 하는 것보다 함수 표현식 전체 타입을 정의하는 것이 간결하고 안전하다.

## 요약

- 매개변수나 반환 값에 타입을 명시하기보다는 함수 표현식 전체에 타입 구문을 적용하는 것이 좋다.
- `typeof fn` 을 사용하면 다른 함수의 시그니처를 참조할 수 있다.
