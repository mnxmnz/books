---
sidebar_position: 8
---

# 아이템 8 타입 공간과 값 공간의 심벌 구분하기

타입스크립트의 심벌(`symbol`)은 타입 공간이나 값 공간 중의 한 곳에 존재한다.

```ts
interface Cylinder {
  radius: number;
  height: number;
}

const Cylinder = (radius: number, height: number) => ({ radius, height });

function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape.radius;
    // ERROR: '{}' 형식에 'radius' 속성이 없음
  }
}
```

`instanceof` 는 자바스크립트의 런타임 연산자이고 값에 대해 연산한다. 따라서 `instanceof Cylinder` 는 타입이 아니라 함수를 참조한다.

타입 선언(`:`) 또는 단언문(`as`) 다음에 나오는 심벌은 타입인 반면, `=` 다음에 나오는 모든 것은 값이다.

`class` 와 `enum` 은 상황에 따라 타입과 값 두 가지 모두 가능한 예약어이다.
클래스가 타입으로 쓰일 때는 형태(속성과 메서드)가 사용되는 반면, 값으로 쓰일 때는 생성자가 사용된다.

연산자 중에서도 타입에서 쓰일 때와 값에서 쓰일 때 다른 기능을 하는 것이 있다. 그 중 하나가 `typeof` 이다.

```ts
interface Person {
  first: string;
  last: string;
}

const p: Person = { first: 'Jane', last: 'Jacobs' };

function email(p: Person, subject: string, body: string): Response {
  return new Response();
}

class Cylinder {
  radius = 1;
  height = 1;
}

function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape; // Cylinder
    shape.radius; // number
  }
}

type T1 = typeof p; // Person
type T2 = typeof email;
// (p: Person, subject: string, body: string) => Response

const v1 = typeof p; // "object"
const v2 = typeof email; // "function"
```

타입의 관점에서 `typeof` 는 값을 읽어서 타입스크립트 타입을 반환한다. 타입 공간의 `typeof` 는 보다 큰 타입의 일부분으로 사용할 수 있고, `type` 구문으로 이름을 붙이는 용도로도 사용할 수 있다.

값의 관점에서 `typeof` 는 자바스크립트 런타임의 `typeof` 연산자가 된다. 값 공간의 `typeof` 는 대상 심벌의 런타임 타입을 가리키는 문자열을 반환하며, 타입스크립트 타입과는 다르다.

속성 접근자인 `[]` 는 타입으로 쓰일 때에도 동일하게 동작한다. 그러나 `obj['field']` 와 `obj.field` 는 값이 동일하더라도 타입은 다를 수 있다. 따라서 타입의 속성을 얻을 때에는 반드시 첫 번째 방법을 사용해야 한다.

:::note

enum 컴파일

- [enum 타입](https://yamoo9.gitbook.io/typescript/types/enum)

:::

:::note

in 연산자

- [in 연산자 - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/in)

:::

:::note

this 활용해서 타입 지정하는 방법

```ts
class Calculator {
  protected value: number;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  // 'this' 타입을 반환하여 메서드 체이닝을 지원합니다.
  add(operand: number): this {
    this.value += operand;
    return this;
  }

  multiply(operand: number): this {
    this.value *= operand;
    return this;
  }

  // 현재 계산된 값을 반환합니다.
  getValue(): number {
    return this.value;
  }
}

// 'Calculator'의 서브클래스에서 'polymorphic this'를 활용한 예시
class ScientificCalculator extends Calculator {
  // 'Calculator'의 메서드를 확장합니다.
  sin(): this {
    this.value = Math.sin(this.value);
    return this;
  }
}

// 'ScientificCalculator' 인스턴스를 생성하고 메서드 체이닝을 사용합니다.
const calc = new ScientificCalculator(0)
  .add(1)
  .multiply(2)
  .sin() // 'ScientificCalculator'에만 있는 메서드
  .getValue();

console.log(calc); // 계산된 값 출력
```

:::

## 요약

- 타입스크립트 코드를 읽을 때 타입인지 값인지 구분하는 방법을 터득해야 한다. 타입스크립트 플레이그라운드를 활용해 개념을 잡는 것이 좋다.
- 모든 값은 타입을 가지지만, 타입은 값을 가지지 않는다. `type` 과 `interface` 같은 키워드는 타입 공간에만 존재한다.
- `class` 나 `enum` 같은 키워드는 타입과 값 두 가지로 사용될 수 있다.
- `“foo”` 는 문자열 리터럴이거나, 문자열 리터럴 타입일 수 있다. 차이점을 알고 구별하는 방법을 터득해야 한다.
- `typeof` , `this` 그리고 많은 다른 연산자들과 키워드들은 타입 공간과 값 공간에서 다른 목적으로 사용될 수 있다.
