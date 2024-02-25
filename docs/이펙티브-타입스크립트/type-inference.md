---
sidebar_position: 3
---

# 3장 타입 추론

## 아이템 19 추론 가능한 타입을 사용해 장황한 코드 방지하기

이상적인 타입스크립트 코드는 함수/메서드 시그니처에 타입 구문을 포함하지만 함수 내에서 생성한 지역 변수에는 타입 구문을 넣지 않는다. 타입 구문을 생략하여 방해되는 것들을 최소화하고 코드를 읽는 사람이 구현 로직에 집중할 수 있게 하는 것이 좋다.

```ts
interface Product {
  id: string;
  name: string;
  price: number;
}

function logProduct(product: Product) {
  const id: number = product.id;
  // ERROR: 'string' 형식은 'number' 형식에 할당할 수 없습니다.
  const name: string = product.name;
  const price: number = product.price;

  console.log(id, name, price);
}

const elmo: Product = {
  name: 'Tickle Me Elmo',
  id: '048188 627152',
  price: 28.99,
};
```

- `elmo` 정의에 타입을 명시하면 초과 속성 체크가 동작한다. 초과 속성 체크는 선택적 속성이 있는 타입의 오타 같은 오류를 잡는 데 효과적이다.

```ts
const furby = {
  name: 'Furby',
  id: 630509430963,
  price: 35,
};

logProduct(furby);
// ERROR: '{ name: string; id: number; price: number; }' 형식의 인수는 'Product' 형식의 매개 변수에 할당될 수 없습니다.
// ERROR: 'id' 속성의 형식이 호환되지 않습니다.
// ERROR: 'number' 형식은 'string' 형식에 할당할 수 없습니다.
```

- 타입 구문을 제거하면 초과 속성 체크가 동작하지 않고 객체를 선언한 곳이 아니라 객체를 사용하는 곳에서 타입 오류가 발생한다.

함수의 반환에도 타입을 명시하여 오류를 방지할 수 있다. 타입 추론이 가능해도 구현상의 오류가 함수를 호출한 곳까지 영향을 미치지 않도록 하기 위해 타입 구문을 명시하는 것이 좋다.

```ts
const cache: { [ticker: string]: number } = {};

function getQuote(ticker: string) {
  if (ticker in cache) {
    return cache[ticker];
  }

  return fetch(`https://quotes.example.com/?q=${ticker}`)
    .then(response => response.json())
    .then(quote => {
      cache[ticker] = quote;

      return quote;
    });
}

function considerBuying(x: any) {}

getQuote('MSFT').then(considerBuying);
// ERROR: 'number | Promise<any>' 형식에 'then' 속성이 없습니다.
// ERROR: 'number' 형식에 'then' 속성이 없습니다.
```

- 실행하면 `getQuote` 내부가 아닌 `getQuote` 를 호출하는 코드에서 오류가 발생한다.

```ts
function getQuote(ticker: string): Promise<number> {
  if (ticker in cache) {
    return cache[ticker];
    // ERROR: 'number' 형식은 'Promise<number>' 형식에 할당할 수 없습니다.
  }

  return Promise.resolve(0);
}
```

- 의도된 반환 타입 (`Promise<number>`) 를 명시하면 정확한 위치에 오류가 표시된다.

반환 타입을 명시하면 구현상의 오류가 사용자 코드의 오류로 표시되지 않는다. 오류의 위치를 제대로 표시해 주는 이점 외에도 반환 타입을 명시해야 하는 이유는 다음과 같다.

1. 반환 타입을 명시하면 함수에 대해 더욱 명확하게 알 수 있다. 반환 타입을 명시하려면 구현하기 전에 입력 타입과 출력 타입이 무엇인지 알아야 한다. 추후에 코드가 변경되어도 함수의 시그니처는 쉽게 바뀌지 않는다. 미리 타입을 명시하는 방법은 TDD 와 비슷하다. 전체 타입 시그니처를 먼저 작성하면 구현에 맞추어 주먹구구식으로 시그니처가 작성되는 것을 방지하고 원하는 모양을 얻게 된다.
2. 명명된 타입을 사용하기 위해서이다. 반환 타입을 명시하면 더욱 직관적인 표현이 된다. 그리고 반환 값을 별도의 타입으로 정의하면 타입에 대한 주석을 작성할 수 있어서 더욱 자세한 설명이 가능하다. 추론된 반환 타입이 복잡해질수록 명명된 타입을 제공하는 이점은 커진다.

### 요약

- 타입스크립트가 타입을 추론할 수 있다면 타입 구문을 작성하지 않는 것이 좋다.
- 이상적인 경우 함수/메서드의 시그니처에는 타입 구문이 있지만 함수 내의 지역 변수에는 타입 구문이 없다.
- 추론될 수 있는 경우라도 객체 리터럴과 함수 반환에는 타입 명시를 고려해야 한다. 내부 구현의 오류가 사용자 코드 위치에 나타나는 것을 방지할 수 있다.

## 아이템 20 다른 타입에는 다른 변수 사용하기

타입을 바꿀 수 있는 한 가지 방법은 범위를 좁히는 것이다. 새로운 변수값을 포함하도록 확장하는 것이 아니라 타입을 더 작게 제한하는 것이다.

다른 타입에는 별도의 변수를 사용하는 게 바람직한 이유는 다음과 같다.

- 서로 관련이 없는 값을 분리할 수 있다.
- 변수명을 더 구체적으로 지을 수 있다.
- 타입 추론을 향상시키며 타입 구문이 불필요해진다.
- 타입이 간결해진다.
- let 대신 const 로 변수를 선언하게 된다.

### 요약

- 변수의 값은 바뀔 수 있지만 타입은 일반적으로 바뀌지 않는다.
- 혼란을 막기 위해 타입이 다른 값을 다룰 때에는 변수를 재사용하지 않도록 한다.

## 아이템 21 타입 넓히기

타입스크립트가 코드를 체크하는 정적 분석 시점에 변수는 "가능한" 값의 집합인 타입을 가진다. 지정된 단일 값을 가지고 할당 가능한 값의 집합을 유추한다. 이러한 과정을 "넓히기"라고 부른다.

```ts
const mixed = ['x', 1];
```

`mixed` 의 타입이 될 수 있는 후보이다.

- (’x’ | 1)[]
- [’x’, 1]
- [string, number]
- readonly [string, number]
- (string | number)[]
- readonly (string | number)[]
- [any, any]
- any[]

위와 같은 경우에는 `(string | number)[]` 로 추측한다.

`let` 대신 `const` 로 변수를 선언하면 더 좁은 타입이 된다.

```ts
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
  return vector[axis];
}

const x = 'x'; // 타입: "x"
let vec = { x: 10, y: 20, z: 30 };

getComponent(vec, x); // OK
```

- `const` 도 위의 `mixed` 예시처럼 객체와 배열에서 문제가 있다. 튜플 타입을 추론할지, 요소는 어떤 타입으로 추론할지 알 수 없다.

```ts
const v = {
  x: 1,
};

v.x = 3;
v.x = '3';
v.y = 4;
v.name = 'Pythagoras';
```

- 객체의 경우 타입스크립트의 넓히기 알고리즘은 각 요소를 `let` 으로 할당된 것처럼 다룬다. 그래서 `v` 의 타입은 `{x : number}` 가 된다.

타입스크립트는 명확성과 유연성 사이의 균형을 유지하려고 한다. 오류를 잡기 위해 충분히 구체적으로 타입을 추론해야 하지만 잘못된 추론을 할 정도로 구체적으로 수행하지는 않는다.

타입 추론의 강도를 직접 제어하려면 타입스크립트의 기본 동작을 재정의해야 한다. 타입스크립트의 기본 동작을 재정의하는 세 가지 방법이 있다.

첫 번째, 명시적 타입 구문을 제공하는 것이다.

```ts
const v: { x: 1 | 3 | 5 } = {
  x: 1,
}; // 타입: { x: 1 | 3 | 5; }
```

두 번째, 타입 체커에 추가적인 문맥을 제공하는 것이다. (ex. 함수의 매개변수로 값 전달)

세 번째, `const` 단언문을 사용하는 것이다.

```ts
const v1 = {
  x: 1,
  y: 2,
}; // 타입: { x: number; y: number; }

const v2 = {
  x: 1 as const,
  y: 2,
}; // 타입: { x: 1; y: number; }

const v3 = {
  x: 1,
  y: 2,
} as const; // 타입: { readonly x: 1; readonly y: 2; }
```

배열을 튜플 타입으로 추론할 때 `as const` 를 사용할 수 있다.

```ts
const a1 = [1, 2, 3]; // 타입: number[]
const a2 = [1, 2, 3] as const; // 타입: readonly [1, 2, 3]
```

### 요약

- 타입스크립트가 넓히기를 통해 상수의 타입을 추론하는 법을 이해해야 한다.
- 동작에 영향을 줄 수 있는 방법인 `const`, 타입 구문, 문맥, `as const`에 익숙해져야 한다.

## 아이템 22 타입 좁히기

타입 좁히기의 가장 일반적인 예시는 `null` 체크이다.

```ts
const el = document.getElementById('foo'); // 타입: HTMLElement | null

if (el) {
  el; // 타입: HTMLElement
  el.innerHTML = 'Party Time'.blink();
} else {
  el; // 타입: null
  alert('No element #foo');
}
```

- 조건문에서 타입 좁히기를 잘 해내지만 타입 별칭이 존재하면 다를 수 있다.
- ⇒ 타입 별칭은 아이템 24에서 다룬다.

분기문에서 예외를 던지거나 함수를 반환하여 블록의 나머지 부분에서 변수의 타입을 좁힐 수 있다.

```ts
const el = document.getElementById('foo'); // 타입: HTMLElement | null
if (!el) throw new Error('Unable to find #foo');
el; // 타입: HTMLElement
el.innerHTML = 'Party Time'.blink();
```

`instanceof` 를 사용할 수 있다.

```ts
function contains(text: string, search: string | RegExp) {
  if (search instanceof RegExp) {
    search; // 타입: RegExp
    return !!search.exec(text);
  }

  search; // 타입: string
  return text.includes(search);
}
```

속성 체크도 활용할 수 있다.

```ts
interface A {
  a: number;
}

interface B {
  b: number;
}

function pickAB(ab: A | B) {
  if ('a' in ab) {
    ab; // 타입: A
  } else {
    ab; // 타입: B
  }

  ab; // 타입: A | B
}
```

타입스크립트는 일반적으로 조건문에서 타입을 좁히는 데 능숙하지만 다음 방법은 잘못된 방법이다.

```ts
const el = document.getElementById('foo'); // 타입: HTMLElement | null

if (typeof el === 'object') {
  el; // 타입: HTMLElement | null
}
```

- 자바스크립트에서 `typeof null` 이 "object" 이기 때문에, `if` 구문에서 `null` 이 제외되지 않았다.

명시적 "태그"를 붙여서 타입을 좁힐 수 있다.

```ts
interface UploadEvent {
  type: 'upload';
  filename: string;
  contents: string;
}

interface DownloadEvent {
  type: 'download';
  filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e; // 타입: DownloadEvent
      break;
    case 'upload':
      e; // 타입: UploadEvent
      break;
  }
}
```

- "태그된 유니온" 또는 "구별된 유니온"이라고 불린다.

타입 식별을 돕기 위해 커스텀 함수를 도입할 수 있다.

```ts
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // 타입: HTMLInputElement
    return el.value;
  }

  el; // 타입: HTMLElement
  return el.textContent;
}
```

- "사용자 정의 타입 가드"라고 한다.
- 반환 타입의 `el is HTMLInputElement` 는 함수의 반환이 true 인 경우 타입 체커에게 매개변수의 타입을 좁힐 수 있다고 알려준다.

특정 함수는 타입 가드를 사용하여 배열과 객체의 타입 좁히기를 할 수 있다.

```ts
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map(who => jackson5.find(n => n === who)); // 타입: (string | undefined)[]
```

```ts
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];
const members = ['Janet', 'Michael'].map(who => jackson5.find(n => n === who)).filter(who => who !== undefined); // 타입: (string | undefined)[]
```

```ts
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];

function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

const members = ['Janet', 'Michael'].map(who => jackson5.find(n => n === who)).filter(isDefined); // 타입: string[]
```

### 요약

- 분기문 외에도 여러 종류의 제어 흐름을 살펴보며 타입스크립트가 타입을 좁히는 과정을 이해해야 한다.
- 태그된/구별된 유니온과 사용자 정의 타입 가드를 사용하여 타입 좁히기 과정을 원활하게 만들 수 있다.
