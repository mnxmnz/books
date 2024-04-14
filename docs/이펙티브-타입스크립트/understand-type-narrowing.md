---
sidebar_position: 22
---

# 아이템 22 타입 좁히기

타입 좁히기의 가장 일반적인 예시는 null 체크이다.

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

instanceof 를 사용할 수 있다.

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

- 자바스크립트에서 typeof null 이 “object” 이기 때문에, if 구문에서 null 이 제외되지 않았다.

명시적 ‘태그’를 붙여서 타입을 좁힐 수 있다.

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

- ‘태그된 유니온’ 또는 ‘구별된 유니온’이라고 불린다.

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

- ‘사용자 정의 타입 가드’라고 한다.
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

## 요약

- 분기문 외에도 여러 종류의 제어 흐름을 살펴보며 타입스크립트가 타입을 좁히는 과정을 이해해야 한다.
- 태그된/구별된 유니온과 사용자 정의 타입 가드를 사용하여 타입 좁히기 과정을 원활하게 만들 수 있다.
