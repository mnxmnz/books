---
sidebar_position: 3
---

# 아이템 3 코드 생성과 타입이 관계없음을 이해하기

타입스크립트 컴파일러는 두 가지 역할을 수행한다.

- 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일한다.
- 코드의 타입 오류를 체크한다.

이 두 가지는 서로 완벽히 독립적이다.

## 타입 오류가 있는 코드도 컴파일이 가능합니다

타입 오류가 존재하더라도 코드 생성(컴파일)은 가능하다.

코드에 오류가 있을 때 “컴파일에 문제가 있다”고 말하는 경우를 보았을 것이다. 그러나 이는 기술적으로 틀린 말이다. 엄밀히 말하면 오직 코드 생성만이 ‘컴파일’이라고 할 수 있기 때문이다. 작성한 타입스크립트가 유효한 자바스크립트라면 타입스크립트 컴파일러는 컴파일을 해낸다. 그러므로 코드에 오류가 있을 때 “타입 체크에 문제가 있다”고 말하는 것이 더 정확한 표현이다.

## 런타임에는 타입 체크가 불가능합니다

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
interface Square {
  width: number;
}

interface Rectangle extends Square {
  height: number;
}

type Shape = Square | Rectangle;

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

타입 정보를 유지하는 또 다른 방법으로는 런타임에 접근 가능한 타입 정보를 명시적으로 저장하는 ‘태그’ 기법이다.

```ts
interface Square {
  kind: 'square';
  width: number;
}

interface Rectangle {
  kind: 'rectangle';
  height: number;
  width: number;
}

type Shape = Square | Rectangle;

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

## 런타임 타입은 선언된 타입과 다를 수 있습니다

타입스크립트에서는 런타임 타입과 선언된 타입이 맞지 않을 수 있다.

## 타입스크립트 타입으로는 함수를 오버로드할 수 없습니다

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

## 타입스크립트 타입은 런타임 성능에 영향을 주지 않습니다

타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문에, 런타임의 성능에 아무런 영향을 주지 않는다. 타입스크립트의 정적 타입은 실제로 비용이 전혀 들지 않는다.

- 타입스크립트 컴파일러는 ‘빌드타임’ 오버헤드가 있다.
- 제너레이터 함수가 ES5 타깃으로 컴파일되려면, 타입스크립트 컴파일러는 호환성을 위한 특정 헬퍼 코드를 추가할 것이다. 이런 경우가 제너레이터의 호환성을 위한 오버헤드 또는 성능을 위한 네이티브 구현체 선택의 문제이다.

:::note

```ts
{
  // number로 값을 narrowing하는 잘못된 방법
  // as number 가 자바스크립트로 컴파일하면 사라져서 의도하지 않은 동작이 될 수 있음
  function asNumber(val: number | string): number {
    return val as number;
  }
}
{
  // 런타임시에 값을 정제하는 방법
  // 이런 방식이 좋은지 의문이 듦
  function asNumber(val: number | string): number {
    return typeof val === 'string' ? Number(val) : val;
  }
}
```

:::
