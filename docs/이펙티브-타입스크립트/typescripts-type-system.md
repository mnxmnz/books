---
sidebar_position: 2
---

# 2장 타입스크립트의 타입 시스템

## 아이템 6 편집기를 사용하여 타입 시스템 탐색하기

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

### 요약

- 편집기에서 타입스크립트 언어 서비스를 적극 활용해야 한다.
- 편집기를 사용하면 어떻게 타입 시스템이 동작하는지, 그리고 타입스크립트가 어떻게 타입을 추론하는지 개념을 잡을 수 있다.
- 타입스크립트가 동작을 어떻게 모델링하는지 알기 위해 타입 선언 파일을 찾아보는 방법을 터득해야 한다.

:::note

**VS Code 에서 유용한 단축키 및 확장**

![02-vs-code-navigation](./images/02-vs-code-navigation.png)

- [Editing TypeScript](https://code.visualstudio.com/docs/typescript/typescript-editing)
- [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode)

:::

## 아이템 7 타입이 값들의 집합이라고 생각하기

코드가 실행되기 전, 타입스크립트가 오류를 체크하는 순간에는 “타입”을 가지고 있다. “할당 가능한 값들의 집합”이 타입이라고 생각하면 된다. 이 집합은 타입의 “범위”라고 부르기도 한다.

![typescript-set.png](./images/02-typescript-set.png)

- 출처: [Making sense of TypeScript using set theory](https://thoughtspile.github.io/2023/01/23/typescript-sets/)

가장 작은 집합은 아무 값도 포함하지 않는 공집합이며, 타입스크립트에서는 `never` 타입이다. `never` 타입으로 선언한 변수의 범위는 공집합이기 때문에 아무런 값도 할당할 수 없다.

그 다음으로 작은 집합은 타입스크립트에서 유닛(unit) 타입이라고 부르는 리터럴(literal) 타입이다.

두 개 혹은 세 개로 묶으려면 유니온(union) 타입을 사용한다.

```ts
type AB = 'A' | 'B';
type AB12 = 'A' | 'B' | 12;
```

타입스크립트 오류에서 “할당 가능한”이라는 문구를 볼 수 있다. 이 문구는 집합의 관점에서 “~의 원소(값과 타입의 관계)” 또는 “~의 부분 집합(두 타입의 관계)”을 의미한다.

구조적 타이핑 규칙은 어떠한 값이 다른 속성도 가질 수 있음을 의미한다. 함수 호출의 매개변수에서도 다른 속성을 가질 수 있다. 이러한 사실은 특정 상황에서만 추가 속성을 허용하지 않는 초과 속성 체크만 생각하면 간과하기 쉽다.

```ts
interface Identified {
  id: string;
}

interface Person {
  name: string;
}

interface Lifespan {
  birth: Date;
  death?: Date;
}

type PersonSpan = Person & Lifespan;
```

`&` 연산자는 두 타입의 인터섹션(교집합)을 계산한다.

```ts
type K = keyof (Person | Lifespan); // never
```

유니온 타입에 속하는 값은 어떠한 키도 없기 때문에, 유니온에 대한 `keyof` 는 공집합(`never`)이다.

```ts
keyof (A&B) = (keyof A) | (keyof B)
keyof (A|B) = (keyof A) & (keyof B)
```

“서브타입”은 어떤 집합이 다른 집합의 부분 집합이라는 의미이다.

```ts
interface Vector1D {
  x: number;
}

interface Vector2D extends Vector1D {
  y: number;
}

interface Vector3D extends Vector2D {
  z: number;
}
```

`Vector3D`는 `Vector2D`의 서브타입이고 `Vector2D`는 `Vector1D`의 서브타입이다.

`extends` 키워드는 제너릭 타입에서 한정자로도 사용한다. 이 문맥에서는 “~의 부분 집합”을 의미한다.

```ts
function getKey<K extends string>(val: any, key: K) {
  // ...
}
```

`string` 을 상속한다는 의미를 집합의 관점으로 생각하면 쉽게 이해할 수 있다. `string` 의 부분 집합 범위를 가지는 어떠한 타입이 된다. 이 타입은 `string` 리터럴 타입, `string` 리터럴 타입의 유니온, `string` 자신을 포함한다.

```ts
getKey({}, 'x'); // OK
getKey({}, Math.random() < 0.5 ? 'a' : 'b'); // OK
getKey({}, document.title); // OK
getKey({}, 12); // ERROR: 'number' 형식의 인수는 'string' 형식의 매개 변수에 할당할 수 없음
```

```ts
interface Point {
  x: number;
  y: number;
}

type PointKeys = keyof Point; // "x" | "y"

function sortBy<K extends keyof T, T>(vals: T[], key: K): T[] {
  vals.sort((a, b) => (a[key] === b[key] ? 0 : a[key] < b[key] ? -1 : +1));
  return vals;
}

const pts: Point[] = [
  { x: 1, y: 1 },
  { x: 2, y: 0 },
];

sortBy(pts, 'x'); // OK, "x" | "y" 상속
sortBy(pts, 'y'); // OK, "x" | "y" 상속
sortBy(pts, Math.random() < 0.5 ? 'x' : 'y'); // OK
sortBy(pts, 'z');
// ERROR: '"z"' 형식의 인수는 'keyof Point' 형식의 매개 변수에 할당할 수 없음
```

타입이 집합이라는 관점은 배열과 튜플의 관계를 명확하게 만든다.

```ts
const list = [1, 2]; // number[]
const tuple: [number, number] = list;
// ERROR: 'number[]' 형식은 '[number, number]' 형식에 할당할 수 없음
```

숫자 배열을 숫자의 쌍(pair)이라고 할 수 없다. 빈 리스트와 [1]이 그 반례이다. `number[]` 는 `[number, number]` 의 부분 집합이 아니기 때문에 할당할 수 없다.

타입이 값의 집합이라는 건, 동일한 값의 집합을 가지는 두 타입은 같다는 의미가 된다. 두 타입이 의미적으로 다르고 우연히 같은 범위를 가진다고 하더라도, 같은 타입을 두 번 정의할 이유는 없다.

- 관련 자료: [타입스크립트의 Omit은 어떻게 동작할까? Exclude, Pick 부터 알아보기](https://yceffort.kr/2022/03/typescript-omit-exclude-pick)

### 요약

- 타입을 값의 집합으로 생각하면 이해하기 편하다(타입의 “범위”). 이 집합은 유한(`boolean` 또는 리터럴 타입)하거나 무한(`number` 또는 `string`)하다.
- 타입스크립트 타입은 엄격한 상속 관계가 아니라 겹쳐지는 집합(벤 다이어그램)으로 표현된다. 두 타입은 서로 서브타입이 아니면서도 겹쳐질 수 있다.
- 한 객체의 추가적인 속성이 타입 선언에 언급되지 않더라도 그 타입에 속할 수 있다.
- 타입 연산은 집합의 범위에 적용된다. A와 B의 인터섹션은 A의 범위와 B의 범위의 인터섹션이다. 객체 타입에서는 A&B인 값이 A와 B의 속성을 모두 가짐을 의미한다.
- “A는 B를 상속”, “A는 B에 할당 가능”, “A는 B의 서브 타입”은 “A는 B의 부분 집합”과 같은 의미이다.

:::note

**원시 타입과 객체의 차이**

원시 타입은 일반적으로 알고 있는 교집합, 합집합과 같다.

그런데 객체에서는 `key` , `value` 가 무한대라서 다르다.

```ts
// 인터섹션(intersection, 교집합)
type A = {
  a: number;
};

type B = {
  b: number;
};

type AandB = A & B;
type AorB = A | B;

const aAndB: AandB = { a: 1, b: 2 };
const aOrB: AorB = { a: 1 };
const aOrB2: AorB = { b: 2 };
const aOrB3: AorB = { a: 1, b: 2 };

// aAndB 는 A 와 B 의 부분집합
// A 타입에 aAndB 할당
const a: A = aAndB; // No error

// B 타입에 aAndB 할당
const b: B = aAndB; // No error

// A 와 B 는 AorB 의 부분집합
const aOrB4: AorB = a;
const aOrB5: AorB = b;
```

- **추가 자료1**: [[번역] 집합론으로 이해하는 타입스크립트](https://itchallenger.tistory.com/874)
- **추가 자료2**: [[번역] TypeScript 및 집합 이론](https://velog.io/@yeeed711/번역-TypeScript-및-집합-이론)
- 내가 이해한 내용이 맞는지 코드로 증명하기 위해 노력하기

:::

## 아이템 8 타입 공간과 값 공간의 심벌 구분하기

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

`class` 와 `enum` 은 상황에 따라 타입과 값 두 가지 모두 가능한 예약어이다. 클래스를 타입으로 사용하면 형태(속성과 메서드)를 사용하고 값으로 사용하면 생성자를 사용한다.

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

### 요약

- 타입스크립트 코드를 읽을 때 타입인지 값인지 구분하는 방법을 터득해야 한다. 타입스크립트 플레이그라운드를 활용해 개념을 잡는 것이 좋다.
- 모든 값은 타입을 가지지만, 타입은 값을 가지지 않는다. `type` 과 `interface` 같은 키워드는 타입 공간에만 존재한다.
- `class` 나 `enum` 같은 키워드는 타입과 값 두 가지로 사용될 수 있다.
- `“foo”` 는 문자열 리터럴이거나, 문자열 리터럴 타입일 수 있다. 차이점을 알고 구별하는 방법을 터득해야 한다.
- `typeof` , `this` 그리고 많은 다른 연산자들과 키워드들은 타입 공간과 값 공간에서 다른 목적으로 사용될 수 있다.

:::note

**enum 컴파일**

- [enum 타입](https://yamoo9.gitbook.io/typescript/types/enum)

:::

:::note

**in 연산자**

- [in 연산자 - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/in)

:::

:::note

**this 활용해서 타입 지정하는 방법**

```ts
class Calculator {
  protected value: number;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  // 'this' 타입을 반환하여 메서드 체이닝 지원
  add(operand: number): this {
    this.value += operand;
    return this;
  }

  multiply(operand: number): this {
    this.value *= operand;
    return this;
  }

  // 현재 계산된 값 반환
  getValue(): number {
    return this.value;
  }
}

// 'Calculator' 의 서브클래스에서 'polymorphic this' 를 활용한 예시
class ScientificCalculator extends Calculator {
  // 'Calculator' 의 메서드 확장
  sin(): this {
    this.value = Math.sin(this.value);
    return this;
  }
}

// 'ScientificCalculator' 인스턴스를 생성하고 메서드 체이닝 사용
const calc = new ScientificCalculator(0)
  .add(1)
  .multiply(2)
  .sin() // 'ScientificCalculator'에만 있는 메서드
  .getValue();

console.log(calc); // 계산된 값 출력
```

:::

## 아이템 9 타입 단언보다는 타입 선언을 사용하기

타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사한다. 타입 단언은 강제로 타입을 지정했으니 타입 체커에게 오류를 무시하라고 하는 것이다.

타입 선언문에서는 초과 속성 체크가 동작했지만, 단언문에서는 적용되지 않는다.

화살표 함수의 타입 선언은 추론된 타입이 모호할 때가 있다.

```ts
interface Person {
  name: string;
}

const people = ['alice', 'bob', 'jan'].map(name => ({ name })); // { name: string; }[]...
```

`{ name }` 에 타입 단언을 사용하면 문제가 해결된 것처럼 보일 수 있다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => ({ name } as Person)); // Person[]
```

그러나 타입 단언을 사용하면 런타임에 문제가 발생한다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => ({} as Person));
```

단언문을 사용하지 않고, 다음과 같이 화살표 함수 안에서 타입과 함께 변수를 선언하는 것이 가장 직관적이다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => {
  const person: Person = { name };
  return person;
}); // Person[]
```

화살표 함수의 반환 타입을 선언하여 코드를 간결하게 작성할 수 있다.

```ts
const people = ['alice', 'bob', 'jan'].map((name): Person => ({ name })); // Person[]
```

다음과 같이 작성해서 원하는 타입을 직접 명시하고 타입스크립트가 할당문의 유효성을 검사하게 할 수 있다.

```ts
const people: Person[] = ['alice', 'bob', 'jan'].map((name): Person => ({ name }));
```

타입 단언이 필요한 경우는 다음과 같다. 타입 단언은 타입 체커가 추론한 타입보다 직접 판단한 타입이 더 정확할 때 의미있다.

```ts
document.querySelector('#myButton').addEventListener('click', e => {
  e.currentTarget; // EventTarget
  const button = e.currentTarget as HTMLButtonElement;
  button; // HTMLButtonElement
});
```

`!` 을 사용해서 `null` 이 아님을 단언할 수 있다.

```ts
const elNull = document.getElementById('foo'); // HTMLElement | null
const el = document.getElementById('foo')!; // HTMLElement
```

접미사로 사용하는 `!` 는 그 값이 `null` 이 아니라는 단언문으로 해석된다. `null` 이 아니라고 확신할 수 있는 경우가 아니라면 `null` 인 경우를 체크하는 조건문을 사용하는 것이 좋다.

타입 단언문으로 임의의 타입 간에 변환을 할 수는 없다. 서로의 서브타입이 아니면 변환할 수 없다.

모든 타입은 `unknown` 의 서브타입이기 때문에 `unknown` 이 포함된 단언문은 항상 동작한다.

### 요약

- 타입 단언(`as Type`)보다 타입 선언(`: Type`)을 사용해야 한다.
- 화살표 함수의 반환 타입을 명시하는 방법을 터득해야 한다.
- 타입스크립트보다 타입 정보를 더 잘 알고 있는 상황에서는 타입 단언문과 `null` 아님 단언문을 사용하면 된다.

:::note

`!` 보다는 `?` 를 활용하자

:::

## 아이템 10 객체 래퍼 타입 피하기

```ts
'primitive'.charAt(3); // "m"
```

`charAt` 은 `string` 의 메서드가 아니며, `string` 을 사용할 때 자바스크립트 내부적으로 많은 동작이 일어난다. `string` "기본형"에는 메서드가 없지만, 자바스크립트에는 메서드를 가지는 `String` "객체" 타입이 정의되어 있다. 자바스크립트는 기본형과 객체 타입을 서로 자유롭게 변환한다. `string` 기본형에 `charAt` 같은 메서드를 사용할 때, 자바스크립트는 기본형을 `String` 객체로 래핑(wrap)하고, 메서드를 호출하고, 마지막에 래핑한 객체를 버린다.

### 요약

- 기본형 값에 메서드를 제공하기 위해 객체 래퍼 타입이 어떻게 쓰이는지 이해해야 한다. 직접 사용하거나 인스턴스를 생성하는 것은 피해야 한다.
- 타입스크립트 객체 래퍼 타입은 지양하고, 대신 기본형 타입을 사용해야 한다. `String` 대신 `string`, `Number` 대신 `number`, `Boolean` 대신 `boolean`, `Symbol` 대신 `symbol`, `BigInt` 대신 `bigint` 를 사용해야 한다.

:::note

래퍼 객체가 더 크다. `String > string`

:::

## 아이템 11 잉여 속성 체크의 한계 인지하기

:::note

**대부분 잉여가 아닌 "초과"로 번역한다.**

:::

타입이 명시된 변수에 객체 리터럴을 할당할 때 타입스크립트는 해당 타입의 속성이 있는지, 그리고 "그 외 속성은 없는지" 확인한다.

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
  // ERROR: 개체 리터럴은 알려진 속성만 지정할 수 있으며 'ROOM' 형식에 'elephant' 가 없음
};
```

```ts
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
};

const r: Room = obj; // OK
```

첫 번째 예제는 구조적 타입 시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 “초과 속성 체크”라는 과정이 수행되었다. 초과 속성 체크 역시 조건에 따라 동작하지 않는다는 한계가 있고, 통상적인 할당 가능 검사와 함께 쓰이면 구조적 타이핑이 무엇인지 혼란스러워질 수 있다.

```ts
interface Options {
  title: string;
  darkMode?: boolean;
}

const o1: Options = document;
const o2: Options = new HTMLAnchorElement();
```

`document` 와 `HTMLAnchorElement` 의 인스턴스 모두 `string` 타입인 `title` 속성을 가지고 있기 때문에 할당문은 정상이다.

초과 속성 체크를 이용하면 기본적으로 타입 시스템의 구조적 본질을 해치지 않으면서도 객체 리터럴에 알 수 없는 속성을 허용하지 않음으로써, 앞에서 다룬 `Room` 이나 `Options` 예제 같은 문제점을 방지할 수 있다.

`document` 나 `new HTMLAnchorElement` 는 객체 리터럴이 아니기 때문에 초과 속성 체크가 되지 않는다. 그러나 `{ title, darkmode }` 객체는 체크가 된다.

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

interface Options {
  title: string;
  darkMode?: boolean;
}

const o: Options = { darkmode: true, title: 'Ski Free' };
// ERROR: 'Options' 형식에 'darkmode' 가 없음
```

```ts
const intermediate = { darkmode: true, title: 'Ski Free' };

const o: Options = intermediate; // OK
```

첫 번째 줄의 오른쪽은 객체 리터럴이지만, 두 번째 줄의 오른쪽은 객체 리터럴이 아니다. 따라서 초과 속성 체크가 적용되지 않고 오류는 사라진다.

타입 단언문을 사용할 때에도 적용되지 않는다.

```ts
const o = { darkmode: true, title: 'Ski Free' } as Options; // OK
```

초과 속성 체크는 구조적 타이핑 시스템에서 허용되는 속성 이름의 오타 같은 실수를 잡는 데 효과적인 방법이다. 선택적 필드를 포함하는 `Options` 같은 타입에 특히 유용한 반면, 적용 범위도 매우 제한적이며 오직 객체 리터럴에만 적용된다. 이러한 한계점을 인지하고 초과 속성 체크와 일반적인 타입 체크를 구분한다면, 두 가지 모두의 개념을 잡는 데에 도움이 될 것이다.

:::note

**초과 속성 체크 도입 이유**

초과 속성 체크 라는 개념을 도입해서 오히려 타입스크립트가 의도한 대로 동작하지 않는 것은 아닌지?

- 도입한 히스토리를 알면 이해할 수 있을 거 같다. (관련 이슈나 릴리즈 노트 찾아보기)
- 타입을 좁힌 후 어려움을 겪음 → 넓힘
- 타입에 자유도가 높아서 어려움을 겪음 → 좁힘

:::

### 요약

- 객체 리터럴을 변수에 할당하거나 함수에 매개변수로 전달할 때 초과 속성 체크가 수행된다.
- 초과 속성 체크는 오류를 찾는 효과적인 방법이지만, 타입스크립트 타입 체커가 수행하는 일반적인 구조적 할당 가능성 체크와 역할이 다르다. 할당의 개념을 정확히 알아야 초과 속성 체크와 일반적인 구조적 할당 가능성 체크를 구분할 수 있다.
- 초과 속성 체크에는 한계가 있다. 임시 변수를 도입하면 초과 속성 체크를 건너뛸 수 있다는 점을 기억해야 한다.

## 아이템 12 함수 표현식에 타입 적용하기

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
const responseP = fetch('/quote?by=Mark+Twain'); // 타입: Promise<Response>
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

`/quote` 가 존재하지 않는 API 일 때 "404 Not Found"를 포함한 내용을 응답한다. 응답은 JSON 형식이 아닐 수 있다. `response.json()` 은 JSON 형식이 아니라는 새로운 오류 메시지를 담아 rejected 프로미스를 반환한다. 호출한 곳에서는 새로운 오류 메시지가 전달되어 실제 오류인 404가 감추어진다. 또한, `fetch` 가 실패하면 rejected 프로미스를 응답하지 않는다는 걸 간과하기 쉽다. 상태 체크를 수행할 `checkedFetch` 함수 작성이 필요하다.

`fetch` 의 타입 선언은 `lib.dom.d.ts` 에 있으며 다음과 같다.

```ts
declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
```

`checkedFetch` 는 다음과 같다.

```ts
async function checkedFetch(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    // 비동기 함수에서 rejected Promise 로 변환
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
  // ERROR: '(input: any, init: any) => Promise<Response | Error>' 형식은 '{ (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>; (input: RequestInfo, init?: RequestInit | undefined): Promise<...>; }' 형식에 할당할 수 없습니다.
  // ERROR: 'Promise<Response | Error>' 형식은 'Promise<Response>' 형식에 할당할 수 없습니다.
  // ERROR: 'Response | Error' 형식은 'Response' 형식에 할당할 수 없습니다.

  const response = await fetch(input, init);

  if (!response.ok) {
    return new Error('Request failed: ' + response.status);
  }

  return response;
};
```

`checkedFetch` 구현체가 아닌 함수를 호출한 위치에서 발생한다.

함수의 매개변수에 타입 선언을 하는 것보다 함수 표현식 전체 타입을 정의하는 것이 간결하고 안전하다.

### 요약

- 매개변수나 반환 값에 타입을 명시하기보다는 함수 표현식 전체에 타입 구문을 적용하는 것이 좋다.
- `typeof fn` 을 사용하면 다른 함수의 시그니처를 참조할 수 있다.

## 아이템 13 타입과 인터페이스의 차이점 알기

인터페이스는 유니온 타입과 같은 복잡한 타입을 확장하지 못한다. 복잡한 타입을 확장하고 싶으면 타입과 `&` 를 사용해야 한다.

유니온 타입을 확장하는 게 필요할 땐 다음과 같이 할 수 있다.

```ts
type Input = {
  /* ... */
};

type Output = {
  /* ... */
};

interface VariableMap {
  [name: string]: Input | Output;
}
```

유니온 타입에 `name` 속성을 붙인 타입을 만들 수 있다.

```ts
type NamedVariable = (Input | Output) & { name: string };
```

이러한 타입은 인터페이스로 표현할 수 없다.

튜플과 배열 타입도 type 키워드를 이용해 더 간결하게 표현할 수 있다.

```ts
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];
```

인터페이스로 튜플과 비슷하게 구현하면 튜플에서 사용할 수 있는 `concat` 같은 메서드를 사용할 수 없다.

인터페이스는 보강(augment)이 가능하다.

```ts
interface IState {
  name: string;
  capital: string;
}

interface IState {
  population: number;
}

const wyoming: IState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population: 500_000,
}; // OK
```

이렇게 속성을 확장하는 것을 ‘선언 병합’이라고 한다. 선언 병합은 주로 타입 선언 파일에서 사용한다.

`Array` 인터페이스는 `lib.es5.d.ts` 에 정의되어 있다. 기본적으로는 `lib.es5.d.ts` 에 선언한 인터페이스를 사용한다. 그러나 `tsconfig.json` 의 `lib` 목록에 ES2015 를 추가하면 타입스크립트는 `lib.es2015.d.ts` 에 선언한 인터페이스를 병합한다. 여기에는 ES2015 에 추가한 또 다른 `Array` 선언의 `find` 같은 메서드가 포함된다. 병합을 통해 다른 `Array` 인터페이스에 추가된다. 각 선언이 병합되어 전체 메서드를 가지는 하나의 `Array` 타입을 얻게 된다.

### 요약

- 프로젝트에서 어떤 문법을 사용할지 결정할 때 한 가지 일관된 스타일을 확립하고, 보강 기법이 필요한지 고려해야 한다.

## 아이템 14 타입 연산과 제너릭 사용으로 반복 줄이기

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

### 요약

- DRY 원칙을 타입에도 적용해야 한다.
- 타입에 이름을 붙여서 반복을 피하고, `extends` 를 사용해서 인터페이스 필드의 반복을 피해야 한다.
- `keyof` , `typeof` , 인덱싱, 매핑된 타입을 사용해서 타입을 매핑할 수 있다.
- 타입을 반복하는 대신 제너릭 타입을 사용하여 타입 간에 매핑을 하는 것이 좋다. 제너릭 타입을 제한하려면 `extends` 를 사용하면 된다.

## 아이템 15 동적 데이터에 인덱스 시그니처 사용하기

타입에 "인덱스 시그니처"를 명시하여 유연하게 매핑을 표현할 수 있다.

```ts
type Rocket = { [property: string]: string };

const rocket: Rocket = {
  name: 'Falcon 9',
  variant: 'v1.0',
  thrust: '4,940 kN',
}; // OK
```

`[property: string]: string` 이 인덱스 시그니처이며, 다음 세 가지 의미를 담고 있다.

- **키의 이름**: 키의 위치만 표시하는 용도이다. 타입 체커에서는 사용하지 않는다.
- **키의 타입**: `string` 이나 `number` 또는 `symbol` 의 조합이어야 하지만, 보통은 `string` 을 사용한다.
- **값의 타입**: 어떤 것이든 될 수 있다.

이렇게 타입 체크를 수행하면 네 가지 단점이 드러난다.

- 잘못된 키를 포함해 모든 키를 허용한다. `name` 대신 `Name` 으로 작성해도 유효한 `Rocket` 타입이 된다.
- 특정 키가 필요하지 않다. `{ }` 도 유효한 `Rocket` 타입이다.
- 키마다 다른 타입을 가질 수 없다. `thrust` 는 `string` 이 아니라 `number` 여야 할 수 있다.
- `name:` 을 입력할 때, 키는 무엇이든 가능하기 때문에 자동 완성 기능이 동작하지 않는다.

인덱스 시그니처는 부정확하므로 더 나은 방법을 적용해야 한다.

```ts
interface Rocket {
  name: string;
  variant: string;
  thrust_kN: number;
}

const falconHeavy: Rocket = {
  name: 'Falcon Heavy',
  variant: 'v1',
  thrust_kN: 15_200,
};
```

### 요약

- 런타임 때까지 객체의 속성을 알 수 없을 때만 인덱스 시그니처를 사용한다.
- 안전한 접근을 위해 인덱스 시그니처의 값 타입에 `undefined` 를 추가하는 것을 고려해야 한다.

## 아이템 16 number 인덱스 시그니처보다는 Array, 튜플, ArrayLike 를 사용하기

인덱스 시그니처가 `number` 로 표현되어 있다면 입력한 값이 `number` 여야 한다는 것을 의미하지만, 실제 런타임에 사용되는 키는 `string` 타입이다. 일반적으로 `string` 대신 `number` 를 타입의 인덱스 시그니처로 사용할 이유는 많지 않다. 숫자를 사용하여 인덱스할 항목을 지정한다면 `Array` 또는 튜플 타입을 대신 사용하게 될 것이다. `number` 를 인덱스 타입으로 사용하면 숫자 속성이 어떤 특별한 의미를 지닌다는 오해를 불러 일으킬 수 있다.

`Array` 타입이 사용하지도 않을 `push` 나 `concat` 같은 다른 속성을 가지는 게 납득하기 어려울 수 있다. 납득하기 어렵다는 것은 구조적인 고려를 하고 있다는 뜻이기 때문에 타입스크립트를 잘 이해하고 있는 것이다.

어떤 길이를 가지는 배열과 비슷한 형태의 튜플을 사용하고 싶다면 타입스크립트에 있는 `ArrayLike` 타입을 사용한다.

```ts
const xs = [1, 2, 3];

function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
  if (i < xs.length) {
    return xs[i];
  }

  throw new Error(`Attempt to access ${i} which is past end of array.`);
}
```

길이와 숫자 인덱스 시그니처만 있는 경우는 드물지만 필요하면 `ArrayLike` 를 사용해야 한다.

```ts
const tupleLike: ArrayLike<string> = {
  '0': 'A',
  '1': 'B',
  length: 2,
}; // OK
```

### 요약

- 인덱스 시그니처로 사용하는 `number` 타입은 버그를 잡기 위한 순수 타입스크립트 코드이다.
- 인덱스 시그니처에 `number` 를 사용하기보다 `Array` , 튜플, `ArrayLike` 타입을 사용하는 것이 좋다.

## 아이템 17 변경 관련된 오류 방지를 위해 readonly 사용하기

`arraySum` 함수는 배열 안의 숫자를 모두 합친다. 계산이 끝나면 원래 배열이 전부 비게 된다. 오류의 범위를 좁히기 위해 readonly 접근자를 사용해서 배열을 변경하지 않는다는 선언을 할 수 있다.

```ts
function arraySum(arr: readonly number[]) {
  let sum = 0,
    num;

  // ERROR: 'readonly number[]' 형식에 'pop' 속성이 없습니다.
  while ((num = arr.pop()) !== undefined) {
    sum += num;
  }

  return sum;
}
```

readonly number[] 는 **"타입"** 이고 number[] 와 구분되는 몇 가지 특징이 있다.

- 배열의 요소를 읽을 수 있지만 쓸 수는 없다.
- `length` 를 읽을 수 있지만 바꿀 수 없다.
- 배열을 변경하는 `pop` 을 비롯한 다른 메서드를 호출할 수 없다.

매개변수를 readonly 로 선언하면 다음과 같은 일이 발생한다.

- 타입스크립트는 매개변수가 함수 내에서 변경이 일어나는지 체크한다.
- 호출하는 쪽에서 함수가 매개변수를 변경하지 않는다는 보장을 받게 된다.
- 호출하는 쪽에서 함수에 readonly 배열을 매개변수로 넣을 수 있다.

다음은 `parseTaggedText` 예시이다.연속된 행을 가져와서 빈 줄을 기준으로 구분되는 단락으로 나누는 기능을 하는 프로그램이다.

```ts
function parseTaggedText(lines: string[]): string[][] {
  const paragraphs: string[][] = [];
  const currPara: string[] = [];

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push(currPara);
      currPara.length = 0;
    }
  };

  for (const line of lines) {
    if (!line) {
      addParagraph();
    } else {
      currPara.push(line);
    }
  }

  addParagraph();

  return paragraphs;
}
```

- `currPara` 의 내용이 삽입되지 않고 배열의 참조가 삽입된다.
- `currPara` 를 변경하면 같은 객체를 참조하는 `paragraphs` 요소에도 변경이 반영된다.
  `currPara` 수정을 방지하기 위해 readonly 로 선언하면 다음과 같은 오류가 발생한다.

```ts
function parseTaggedText(lines: string[]): string[][] {
  const currPara: readonly string[] = [];
  const paragraphs: string[][] = [];

  const addParagraph = () => {
    if (currPara.length) {
      paragraphs.push(currPara);
      // ERROR: 'readonly string[]' 형식의 인수는 'string[]' 형식의 매개 변수에 할당될 수 없습니다.
      // 'readonly string[]' 형식은 'readonly'이며 변경 가능한 형식 'string[]'에 할당할 수 없습니다.

      currPara.length = 0;
      // ERROR: 읽기 전용 속성이므로 'length'에 할당할 수 없습니다.
    }
  };

  for (const line of lines) {
    if (!line) {
      addParagraph();
    } else {
      currPara.push(line);
      // ERROR: 'readonly string[]' 형식에 'push' 속성이 없습니다.
    }
  }

  addParagraph();

  return paragraphs;
}
```

- `currPara` 를 `let` 으로 선언하고 `concat` 을 사용하여 아래 두 개의 오류를 해결할 수 있다.
- 선언부를 `const` 에서 `let` 으로 바꾸고 readonly 를 추가함으로써 변경 가능성을 옮긴 것이다.
  `paragraphs` 오류를 해결하는 방법은 다음과 같다.

1. `currPara` 복사본 생성하기

   ```ts
   paragraphs.push([...currPara]);
   ```

   `currPara` 는 readonly 로 유지되지만 복사본은 원하는 대로 변경이 가능해서 오류가 사라진다.

2. `paragraphs` 를 readonly string[] 의 배열로 변경하기

   ```ts
   const paragraphs: (readonly string[])[] = [];
   ```

   readonly string[][] 은 readonly 배열의 변경 가능한 배열이 아니라 변경 가능한 배열의 readonly 배열이라 괄호가 중요하다.

3. readonly 속성을 제거하기 위해 단언문 사용하기

   ```ts
   paragraphs.push(currPara as string[]);
   ```

readonly 는 얕게 동작한다. 객체의 readonly 배열이 있다면 그 객체 자체는 readonly 가 아니다.

```ts
const dates: readonly Date[] = [new Date()];
dates.push(new Date());
// ERROR: 'readonly Date[]' 형식에 'push' 속성이 없습니다.

dates[0].setFullYear(2037);
// OK
```

Readonly 제너릭에도 해당된다.

```ts
interface Outer {
  inner: {
    x: number;
  };
}

const o: Readonly<Outer> = { inner: { x: 0 } };

o.inner = { x: 1 };
// ERROR: 읽기 전용 속성이므로 'inner'에 할당할 수 없습니다.

o.inner.x = 1;
// OK
```

타입 별칭을 생성한 후 확인하면 다음과 같다.

```ts
type T = Readonly<Outer>;
// Type T = {
//   readonly inner: {
//     x: number;
//   };
// }
```

깊은 readonly 타입이 기본으로 지원되지 않지만 제너릭을 만들면 깊은 readonly 타입을 사용할 수 있다. ts-essentials 에 있는 DeepReadonly 제너릭과 같은 라이브러리를 사용하는 것이 좋다.

인덱스 시그니처에도 readonly 를 사용할 수 있다.

```ts
let obj: { readonly [k: string]: number } = {};
// Or Readonly<{[k: string]: number}

obj.hi = 45;
// ERROR: '{ readonly [k: string]: number; }' 형식의 인덱스 시그니처는 읽기만 허용됩니다.

obj = { ...obj, hi: 12 };
// OK
obj = { ...obj, bye: 34 };
// OK
```

- 인덱스 시그니처에 readonly 를 사용하면 객체의 속성이 변경되는 것을 방지할 수 있다.

### 요약

- 함수가 매개변수를 수정하지 않는다면 readonly 로 선언하는 것이 좋다. readonly 매개변수는 인터페이스를 명확하게 하고 매개변수가 변경되는 것을 방지한다.
- readonly 를 사용하면 변경해서 발생하는 오류를 방지할 수 있고 변경이 발생하는 코드도 쉽게 찾을 수 있다.
- const 와 readonly 의 차이를 이해해야 한다.
- readonly 는 얕게 동작한다.

### 참고 자료

- [읽기 전용(readonly) - TypeScript Deep Dive](https://radlohead.gitbook.io/typescript-deep-dive/type-system/readonly)

## 아이템 18 매핑된 타입을 사용하여 값을 동기화하기

```ts
interface ScatterProps {
  xs: number[];
  ys: number[];
  xRange: [number, number];
  yRange: [number, number];
  color: string;
  onClick: (x: number, y: number, index: number) => void;
}

const REQUIRES_UPDATE: { [k in keyof ScatterProps]: boolean } = {
  xs: true,
  ys: true,
  xRange: true,
  yRange: true,
  color: true,
  onClick: false,
};

function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
  let k: keyof ScatterProps;

  for (k in oldProps) {
    if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
      return true;
    }
  }

  return false;
}
```

매핑된 타입은 한 객체가 또 다른 객체와 정확히 같은 속성을 가지게 할 때 이상적이다. 이번 예제처럼 매핑된 타입을 사용해 타입스크립트가 코드에 제약을 강제하도록 할 수 있다.

### 요약

- 매핑된 타입을 사용해서 관련된 값과 타입을 동기화하자. (개발자가 할 일이다. 개발자에게 강제하는 것이다.)
- 인터페이스에 새로운 속성을 추가할 때 선택을 강제하도록 매핑된 타입을 고려해야 한다.
