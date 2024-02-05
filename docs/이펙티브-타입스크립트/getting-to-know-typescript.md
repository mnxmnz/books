---
sidebar_position: 1
---

# 1장 타입스크립트 알아보기

## 아이템 1 타입스크립트와 자바스크립트의 관계 이해하기

타입스크립트는 자바스크립트의 상위 집합이다.

자바스크립트 프로그램에 이슈가 존재하면 문법 오류가 아니더라도 타입 체커에 걸릴 가능성이 높다. 그러나 문법의 유효성과 동작의 이슈는 독립적인 문제라서 타입스크립트는 여전히 코드를 파싱하고 자바스크립트로 변환할 수 있다.

모든 자바스크립트 프로그램이 타입스크립트라는 명제는 참이지만, 그 반대는 성립하지 않는다. 타입스크립트가 타입을 명시하는 추가적인 문법을 가지기 때문이다.

타입스크립트는 자바스크립트 런타임 동작을 모델링하는 타입 시스템을 가지고 있기 때문에 런타임 오류가 발생하는 코드를 찾으려고 한다. 그러나 모든 오류를 찾을 것이라고 기대하면 안 된다. 타입 체커를 통과하면서도 런타임 오류가 발생하는 코드도 존재할 수 있다.

타입스크립트 타입 시스템은 전반적으로 자바스크립트 동작을 모델링한다.

:::note

**자료형과 연산자의 법칙**

책의 예제만 보면 법칙이 모호해 보일 수 있지만 모든 자료형에 대해 열거하면 법칙은 명확하다.

```ts
const a = null + 7;
// The value 'null' cannot be used here.

const b = [] + 12;
// Operator '+' cannot be applied to types 'never[]' and 'number'.
```

연산자가 문자열을 이어 붙이는 경우(피연산자가 하나라도 String 타입)는 `Symbol` 을 제외하고 모두 가능하다. `Symbol` 을 붙일 수 없는 이유는 스펙상에 정의되어 있다.

`+` 연산자의 피연산자가 하나라도 String 이면 `ToString` (피연산자)을 수행하여 값을 가져오는데 피연산자가 `Symbol` 인 경우만 TypeError exception 을 throw 한다.

그 외에는 산술연산자로 동작하기 때문에 Numeric types(Number, BigInt)만 가능하다.

- [관련 예제 코드 | GitHub](https://github.com/youngbeomrhee/effective-typescript/blob/8b341dde5430adbb05758cb4089b545c4ca30237/src/ch01-intro/item-01-ts-vs-js/list.ts#L84)
- [6 ECMAScript Data Types and Values | ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-data-types-and-values)
- [The Addition Operator (+) | ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/#prod-AdditiveExpression)
- [ApplyStringOrNumericBinaryOperator | ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/#sec-applystringornumericbinaryoperator)
- [ToString | ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/#sec-tostring)

:::

## 아이템 2 타입스크립트 설정 이해하기

타입스크립트 설정은 커맨드 라인보다는 `tsconfig.json` 을 사용하는 것이 좋다.

타입스크립트 설정을 제대로 사용하려면, **noImplicitAny** 와 **strictNullChecks** 를 이해해야 한다.

**noImplicitAny** 는 변수가 미리 정의한 타입을 가져야 하는지 여부를 제어한다.

다음 코드는 noImplicitAny 가 해제되어 있을 때 유효하다. noImplicitAny 를 설정하면 오류가 발생한다.

```ts
function add(a, b) {
  // ERROR: 'a' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.
  // ERROR: 'b' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.
  return a + b;
}
```

타입을 설정해서 오류를 해결할 수 있다.

```ts
function add(a: number, b: number) {
  return a + b;
}
```

자바스크립트 프로젝트를 타입스크립트로 전환하는 게 아니라면 noImplicitAny 를 설정하는 것이 좋다.

**strictNullChecks** 는 `null` 과 `undefined` 를 모든 타입에서 허용하는지 확인하는 설정이다.

다음은 strictNullChecks 가 해제되었을 때 유효한 코드이다.

```ts
const x: number = null;
```

그러나 strictNullChecks 를 설정하면 오류가 발생한다.

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

"undefined 는 객체가 아닙니다" 같은 런타임 오류를 방지하기 위해 strictNullChecks 를 설정하는 것이 좋다.

타입스크립트에서 엄격한 체크를 하고 싶다면 strict 설정을 고려해야 한다.

:::note

**noImplicitAny 와 strictNullChecks 의 상관관계**

```ts
// noImplicitAny 를 먼저 설정하지 않고 strictNullChecks 만 설정했을 때 문제점

const el = document.getElementById('status');

function getTextContent(el) {
  return el.textContent;
}

getTextContent(el).textContent = 'Ready';
getTextContent(null).textContent = 'Ready';

// any 를 거치면서 null 체크를 할 수 없음
```

:::

## 아이템 3 코드 생성과 타입이 관계없음을 이해하기

타입스크립트 컴파일러는 두 가지 역할을 수행한다.

- 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일한다.
- 코드의 타입 오류를 체크한다.

이 두 가지는 서로 완벽히 독립적이다.

### 타입 오류가 있는 코드도 컴파일이 가능합니다

타입 오류가 존재하더라도 코드 생성(컴파일)은 가능하다.

코드에 오류가 있을 때 "컴파일에 문제가 있다"고 말하는 경우를 보았을 것이다. 이는 기술적으로 틀린 말이다. 엄밀히 말하면 오직 코드 생성만이 "컴파일"이라고 할 수 있기 때문이다.

작성한 타입스크립트가 유효한 자바스크립트라면 타입스크립트 컴파일러는 컴파일할 수 있다. 그러므로 코드에 오류가 있을 때 "타입 체크에 문제가 있다"고 말하는 것이 더 정확한 표현이다.

### 런타임에는 타입 체크가 불가능합니다

```ts
interface Square {
  width: number;
}

interface Rectangle extends Square {
  height: number;
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    // ERROR: 'Rectangle'은(는) 형식만 참조하지만, 여기서는 값으로 사용되고 있습니다.
    return shape.width * shape.height;
    //ERROR: 'Shape' 형식에 'height' 속성이 없습니다. 'Square' 형식에 'height' 속성이 없습니다.
  } else {
    return shape.width * shape.width;
  }
}
```

`instanceof` 체크는 런타임에 일어나지만, `Rectangle` 은 타입이기 때문에 런타임 시점에 아무런 역할을 할 수 없다.

앞의 코드에서 다루고 있는 `shape` 타입을 명확하게 하려면, 런타임에 타입 정보를 유지하는 방법이 필요하다.

하나의 방법은 `height` 속성이 존재하는지 체크해 보는 것이다.

```ts
function calculateArea(shape: Shape) {
  if ('height' in shape) {
    shape;
    return shape.width * shape.height;
  } else {
    shape;
    return shape.width * shape.width;
  }
}
```

타입 정보를 유지하는 또 다른 방법은 런타임에 접근 가능한 타입 정보를 명시적으로 저장하는 "태그" 기법이다.

```ts
function calculateArea(shape: Shape) {
  if (shape.kind === 'rectangle') {
    shape;
    return shape.width * shape.height;
  } else {
    shape;
    return shape.width * shape.width;
  }
}
```

`Shape` 타입은 태그된 유니온의 한 예시이다.

타입과 값을 둘 다 사용하는 기법도 있다. 타입을 클래스로 만드는 것이다.

```ts
class Square {
  constructor(public width: number) {}
}

class Rectangle extends Square {
  constructor(public width: number, public height: number) {
    super(width);
  }
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    shape;
    return shape.width * shape.height;
  } else {
    shape;
    return shape.width * shape.width;
  }
}
```

인터페이스는 타입으로만 사용 가능하지만, `Rectangle` 을 클래스로 선언하면 타입과 값으로 모두 사용할 수 있으므로 오류가 없다.

### 런타임 타입은 선언한 타입과 다를 수 있습니다

타입스크립트에서는 런타임 타입과 선언한 타입이 맞지 않을 수 있다.

### 타입스크립트 타입으로는 함수를 오버로드할 수 없습니다

타입스크립트에서는 타입과 런타임의 동작이 무관하기 때문에, 함수 오버로딩은 불가능하다.

```ts
function add(a: number, b: number) {
  // ERROR: 중복된 함수 구현입니다.
  return a + b;
}

function add(a: number, b: number) {
  // ERROR: 중복된 함수 구현입니다.
  return a + b;
}
```

타입스크립트가 함수 오버로딩 기능을 지원하기는 하지만, 온전히 타입 수준에서만 동작한다. 하나의 함수에 대해 여러 개의 선언문을 작성할 수 있지만, 구현체는 오직 하나뿐이다.

```ts
function add(a: number, b: number): number;

function add(a: string, b: string): string;

function add(a, b) {
  return a + b;
}

const three = add(1, 2); // number

const twelve = add('1', '2'); // string
```

`add` 에 대한 처음 두 개의 선언문은 타입 정보를 제공할 뿐이다. 이 두 선언문은 타입스크립트가 자바스크립트로 변환되면서 제거되며, 구현체만 남게 된다.

### 타입스크립트 타입은 런타임 성능에 영향을 주지 않습니다

타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문에, 런타임의 성능에 아무런 영향을 주지 않는다. 타입스크립트의 정적 타입은 실제로 비용이 전혀 들지 않는다.

- 타입스크립트 컴파일러는 "빌드타임" 오버헤드가 있다.
- 제너레이터 함수가 ES5 타깃으로 컴파일되려면, 타입스크립트 컴파일러는 호환성을 위한 특정 헬퍼 코드를 추가할 것이다. 이런 경우가 제너레이터의 호환성을 위한 오버헤드 또는 성능을 위한 네이티브 구현체 선택의 문제이다.

:::note

**타입 정제 방법**

```ts
// number 로 값을 narrowing 하는 잘못된 방법
// as number 가 자바스크립트로 컴파일하면 사라져서 의도하지 않은 동작이 될 수 있음
function asNumber(val: number | string): number {
  return val as number;
}
```

```ts
// 런타임시에 값을 정제하는 방법
// 이런 방식이 좋은지 의문이 듦
function asNumber(val: number | string): number {
  return typeof val === 'string' ? Number(val) : val;
}
```

:::

## 아이템 4 구조적 타이핑에 익숙해지기

자바스크립트가 덕 타이핑 기반이고 타입스크립트가 이를 모델링하기 위해 구조적 타이핑을 사용함을 이해해야 한다.

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

const v: NamedVector = { x: 3, y: 4, name: 'Zee' };

calculateLength(v); // 5
```

`NamedVector` 의 구조가 `Vector2D` 와 호환되기 때문에 `calculateLength` 호출이 가능하다. 여기서 "구조적 타이핑"이라는 용어가 사용된다.

구조적 타이핑 때문에 문제가 발생하기도 한다.

```tsx
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

function normalize(v: Vector3D) {
  const length = calculateLength(v);

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}
```

`calculateLength` 는 2D 벡터를 기반으로 연산하는데, 버그로 인해 `normalize` 가 3D 벡터로 연산되었다. `z` 가 정규화에서 무시된 것이다.

`Vector3D` 와 호환하는 `{x, y, z}` 객체로 `calculateLength` 를 호출하면, 구조적 타이핑 관점에서 `x` 와 `y` 가 있어서 `Vector2D` 와 호환한다. 따라서 오류가 발생하지 않았고, 타입 체커가 문제로 인식하지 않았다.

어떤 인터페이스에 할당 가능한 값이라면 타입 선언에 명시적으로 나열된 속성들을 가지고 있을 것이다. 타입은 "봉인"되어 있지 않다.

```ts
calculateLengthL1(v: Vector3D) {
  let length = 0;

  for (const axis of Object.keys(v)) {
    const coord = v[axis];
    // 'string' 형식의 식을 'Vector3D' 인덱스 형식에 사용할 수 없으므로 요소에 암시적으로 'any' 형식이 있습니다.
    // 'Vector3D' 형식에서 'string' 형식의 매개 변수가 포함된 인덱스 시그니처를 찾을 수 없습니다.
    length += Math.abs(coord);
  }

  return length;
}
```

앞에서 `Vector3D` 는 다른 속성이 없다고 가정했다. 그런데 다음 코드처럼 작성할 수도 있다.

```ts
const vec3D = { x: 3, y: 4, z: 1, address: '123 Broadway' };

calculateLengthL1(vec3D);
```

`v` 는 어떤 속성이든 가질 수 있기 때문에, `axis` 의 타입은 `string` 이 될 수 있다. 그러므로 앞서 본 것처럼 타입스크립트는 `v[axis]` 가 어떤 속성이 될지 알 수 없기 때문에 `number` 라고 확정할 수 없다.

이러한 경우에는 루프보다는 모든 속성을 각각 더하는 구현이 더 낫다.

```tsx
function calculateLengthL1(v: Vector3D) {
  return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
}
```

클래스 역시 구조적 타이핑 규칙을 따른다는 것을 명심해야 한다. 클래스의 인스턴스가 예상과 다를 수 있다.

구조적 타이핑을 사용하면 유닛 테스팅을 손쉽게 할 수 있다.

:::note

**덕타이핑의 장점**

- 테스트 로직이나 특정 무언가를 모킹하는 것을 만들 때 수월하다.
- class 하나만 만들어서 사용할 수 있다. → Java 를 활용하면 다형성을 활용해서 어렵다.
- 객체를 생성하는 비용이 낮다.
- 빠른 개발이 가능하다.

:::

:::note

- **[Syntactic Sugar](https://www.zerocho.com/category/JavaScript/post/5816c858ca15d50015d924ae)**

:::

## 아이템 5 any 타입 지양하기

any 타입을 사용하면 타입 체커와 타입스크립트 언어 서비스를 무력화한다. any 타입은 문제점을 감추며, 개발 경험을 나쁘게 하고, 타입 시스템의 신뢰도를 떨어뜨린다.

:::note

**any 와 함수 시그니처**

any 가 함수 시그니처를 무시하는 것이 맞을까? → 책에서 소개하는 예제는 시그니처가 아닌 것 같다.

- **의견 1**: 입출력을 정의하는 것을 시그니처라고 하는 거 같다. parameter, return 과 같은 것을 정한다는 흐름으로 "시그니처"라는 용어를 사용한 거 같다.
- **의견 2**: 함수 시그니처, 인덱스 시그니처 등 "시그니처"를 포함하는 용어를 각각을 따로 생각하는 것이 좋을 거 같다. → 모든 시그니처를 하나의 용어로 정의하면 후에 오해를 할 일이 생길 거 같다.
- **관련 자료**: [Signature (functions) | MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/Signature/Function)

:::

:::note

**any 활용 방법**

- 타입 정의가 안 된 라이브러리를 사용할 때

:::
