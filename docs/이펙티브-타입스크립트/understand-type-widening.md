---
sidebar_position: 21
---

# 아이템 21 타입 넓히기

타입스크립트가 코드를 체크하는 정적 분석 시점에 변수는 ‘가능한’ 값의 집합인 타입을 가진다. 지정된 단일 값을 가지고 할당 가능한 값의 집합을 유추한다. 이러한 과정을 ‘넓히기’라고 부른다.

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

위와 같은 경우에는 (string | number)[] 로 추측한다.

let 대신 const 로 변수를 선언하면 더 좁은 타입이 된다.

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

- const 도 위의 mixed 예시처럼 객체와 배열에서 문제가 있다. 튜플 타입을 추론할지, 요소는 어떤 타입으로 추론할지 알 수 없다.

```ts
const v = {
  x: 1,
};

v.x = 3;
v.x = '3';
v.y = 4;
v.name = 'Pythagoras';
```

- 객체의 경우 타입스크립트의 넓히기 알고리즘은 각 요소를 let 으로 할당된 것처럼 다룬다. 그래서 v 의 타입은 `{x : number}` 가 된다.

타입스크립트는 명확성과 유연성 사이의 균형을 유지하려고 한다. 오류를 잡기 위해 충분히 구체적으로 타입을 추론해야 하지만 잘못된 추론을 할 정도로 구체적으로 수행하지는 않는다.

타입 추론의 강도를 직접 제어하려면 타입스크립트의 기본 동작을 재정의해야 한다. 타입스크립트의 기본 동작을 재정의하는 세 가지 방법이 있다.

첫 번째, 명시적 타입 구문을 제공하는 것이다.

```ts
const v: { x: 1 | 3 | 5 } = {
  x: 1,
}; // 타입: { x: 1 | 3 | 5; }
```

두 번째, 타입 체커에 추가적인 문맥을 제공하는 것이다. (ex. 함수의 매개변수로 값 전달)

세 번째, const 단언문을 사용하는 것이다.

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

배열을 튜플 타입으로 추론할 때 as const 를 사용할 수 있다.

```ts
const a1 = [1, 2, 3]; // 타입: number[]
const a2 = [1, 2, 3] as const; // 타입: readonly [1, 2, 3]
```

## 요약

- 타입스크립트가 넓히기를 통해 상수의 타입을 추론하는 법을 이해해야 한다.
- 동작에 영향을 줄 수 있는 방법인 const, 타입 구문, 문맥, as const에 익숙해져야 한다.
