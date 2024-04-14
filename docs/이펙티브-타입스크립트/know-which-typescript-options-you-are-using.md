---
sidebar_position: 2
---

# 아이템 2 타입스크립트 설정 이해하기

타입스크립트 설정은 커맨드 라인보다는 tsconfig.json 을 사용하는 것이 좋다.

타입스크립트 설정을 제대로 사용하려면, **noImplicitAny** 와 **strictNullChecks** 를 이해해야 한다.

**noImplicitAny** 는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어한다.

다음 코드는 noImplicitAny 가 해제되어 있을 때에는 유효하다. noImplicitAny 가 설정되었다면 오류가 된다.

```ts
function add(a, b) {
  // ERROR: 'a' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.
  // ERROR: 'b' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.
  return a + b;
}
```

타입을 설정하면 해결할 수 있다.

```ts
function add(a: number, b: number) {
  return a + b;
}
```

자바스크립트 프로젝트를 타입스크립트로 전환하는 게 아니라면 noImplicitAny 를 설정하는 것이 좋다.

**strictNullChecks** 는 `null` 과 `undefined` 가 모든 타입에서 허용되는지 확인하는 설정이다.

다음은 strictNullChecks 가 해제되었을 때 유효한 코드이다.

```ts
const x: number = null;
```

그러나 strictNullChecks 를 설정하면 오류가 된다.

```ts
const x: number = null;
// ERROR: 'null' 형식은 'number' 형식에 할당할 수 없습니다.
```

`null` 을 허용하지 않으려면 `null` 을 체크하는 코드나 단언문을 추가하면 된다.

```ts
const el = document.getElementById('status');
el.textContent = 'Ready';
// ERROR: 'el'은(는) 'null'일 수 있습니다.

if (el) {
  el.textContent = 'Ready';
}

el!.textContent = 'Ready';
```

“undefined 는 객체가 아닙니다” 같은 런타임 오류를 방지하기 위해 strictNullChecks 를 설정하는 것이 좋다.

타입스크립트에서 엄격한 체크를 하고 싶다면 strict 설정을 고려해야 한다.

:::note

```ts
// noImplicitAny가 먼저 설정되지 않고 strictNullChecks만 설정됐을 경우의 문제점

const el = document.getElementById('status');

function getTextContent(el) {
  return el.textContent;
}

getTextContent(el).textContent = 'Ready';
getTextContent(null).textContent = 'Ready';

// any 를 거치면서 null 체크를 할 수 없음
```

:::
