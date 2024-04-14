---
sidebar_position: 26
---

# 아이템 26 타입 추론에 문맥이 어떻게 사용되는지 이해하기

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';

function setLanguage(language: Language) {
  /* ... */
}

setLanguage('JavaScript');

let language = 'JavaScript';
setLanguage(language);
// ERROR: 'string' 형식의 인수는 'Language' 형식의 매개 변수에 할당될 수 없습니다.
```

- 타입스크립트는 할당 시점에 타입을 추론하여 오류가 발생한다.

이러한 문제를 해결하는 두 가지 방법이 있다. 첫 번째는 타입 선언에서 가능한 값을 제한하는 것이다.

```ts
let language: Language = 'JavaScript';
setLanguage(language);
```

두 번째는 상수로 만드는 것이다.

```ts
const language = 'JavaScript';
setLanguage(language);
```

- 그런데 이 과정에서 사용되는 문맥으로부터 값을 분리했다. 문맥과 값을 분리하면 추후에 근본적인 문제를 발생시킬 수 있다.

## 튜플 사용 시 주의점

```ts
function panTo(where: [number, number]) {
  /* ... */
}

panTo([10, 20]);

const loc = [10, 20];
panTo(loc);
// ERRPR: 'number[]' 형식의 인수는 '[number, number]' 형식의 매개 변수에 할당될 수 없습니다.
```

- 타입스크립트가 `loc` 의 타입을 `number[]` 로 추론한다.

타입스크립트가 의도를 정확히 파악할 수 있도록 타입 선언을 제공할 수 있다.

```ts
const loc: [number, number] = [10, 20];
panTo(loc);
```

‘상수 문맥’을 제공해서 오류를 해결할 수 있다. `const` 는 단지 그 값이 가리키는 참조가 변하지 않은 얕은 상수인 반면, `as const` 는 그 값이 내부까지 상수라는 사실을 타입스크립트에게 알려준다.

```ts
const loc = [10, 20] as const;
panTo(loc);
// ERROR: 'readonly [10, 20]' 형식의 인수는 '[number, number]' 형식의 매개 변수에 할당될 수 없습니다.
// ERROR: 'readonly [10, 20]' 형식은 'readonly'이며 변경 가능한 형식 '[number, number]'에 할당할 수 없습니다.
```

- `panTo` 의 타입 시그니처는 `where` 의 내용이 불변이라고 보장하지 않는다. 즉, `loc` 매개변수가 `readonly` 타입이므로 동작하지 않는다.

`panTo` 함수에 `readonly` 구문을 추가하여 해결할 수 있다.

```ts
function panTo(where: readonly [number, number]) {
  /* ... */
}

const loc = [10, 20] as const;
panTo(loc); // OK
```

- 타입 시그니처를 수정할 수 없는 경우라면 타입 구문을 사용해야 한다.

`as const` 의 문제는 타입 정의에 실수가 있다면 오류가 호출하는 곳에서 발생하는 것이다.

## 객체 사용 시 주의점

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';

interface GovernedLanguage {
  language: Language;
  organization: string;
}

function complain(language: GovernedLanguage) {
  /* ... */
}

complain({ language: 'TypeScript', organization: 'Microsoft' }); // OK

const ts = {
  language: 'TypeScript',
  organization: 'Microsoft',
};
complain(ts);
// ERROR: '{ language: string; organization: string; }' 형식의 인수는 'GovernedLanguage' 형식의 매개 변수에 할당될 수 없습니다.
// ERROR: 'language' 속성의 형식이 호환되지 않습니다.
// ERROR: 'string' 형식은 'Language' 형식에 할당할 수 없습니다.
```

- 타입 선언을 추가하거나 상수 단언을 사용해서 해결할 수 있다.

## 콜백 사용 시 주의점

콜백을 다른 함수로 전달할 때, 타입스크립트는 콜백의 매개변수 타입을 추론하기 위해 문맥을 사용한다.

```ts
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

callWithRandomNumbers((a, b) => {
  a;
  b;
  console.log(a + b);
});
```

- `callWithRandomNumbers` 의 타입 선언으로 인해 `a` 와 `b` 의 타입이 `number` 로 추론된다.

```ts
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

const fn = (a, b) => {
  // 'a' 매개 변수는 암시적으로 'any' 형식이지만, 사용량에서 더 나은 형식을 유추할 수 있습니다.
  // 'b' 매개 변수는 암시적으로 'any' 형식이지만, 사용량에서 더 나은 형식을 유추할 수 있습니다.
  console.log(a + b);
};

callWithRandomNumbers(fn);
```

- 콜백을 상수로 분리하면 문맥이 소실되고 `noImplicitAny` 오류가 발생한다.

타입 구문을 추가하여 해결할 수 있다.

```ts
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

const fn = (a: number, b: number) => {
  console.log(a + b);
};

callWithRandomNumbers(fn);
```

## 요약

- 타입 추론에서 문맥이 어떻게 쓰이는지 주의해서 살펴봐야 한다.
- 변수를 뽑아서 별도로 선언했을 때 오류가 발생한다면 타입 선언을 추가해야 한다.
- 변수가 정말로 상수라면 상수 단언(as const)을 사용해야 한다. 그러나 상수 단언을 사용하면 정의한 곳이 아니라 사용하는 곳에서 오류가 발생하므로 주의해야 한다.
