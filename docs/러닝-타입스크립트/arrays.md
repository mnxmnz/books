---
sidebar_position: 6
---

# 6장 배열

타입스크립트는 초기 배열에 어떤 데이터 타입이 있는지 기억하고 배열이 해당 데이터 타입에서만 작동하도록 제한한다. 이런 방식으로 배열의 데이터 타입을 하나로 유지한다.

```ts
const warriors = ['Artemisia', 'Boudica'];

warriors.push('Zenobia'); // OK

warriors.push(true); // ERROR
```

## 6.1 배열 타입

배열을 저장하기 위한 변수는 초깃값이 필요하지 않다.

```ts
let arrayOfNumbers: number[];

arrayOfNumbers = [4, 8, 15, 16, 23, 42];
```

배열 타입은 ` Array<number>` 구문으로도 작성할 수 있다. 하지만 대부분의 개발자는 더 간단한 `number[]`를 선호한다.

### 6.1.1 배열과 함수 타입

배열 타입은 함수 타입에 무엇이 있는지를 구별하는 괄호가 필요한 구문 컨테이너이다. 괄호는 애너테이션의 어느 부분이 함수 반환 부분이고 어느 부분이 배열 타입 묶음인지를 나타내기 위해 사용한다.

```ts
// string 배열을 반환하는 함수
let createStrings: () => string[];

// 각각의 string을 반환하는 함수 배열
let stringCreators: (() => string)[];
```

### 6.1.2 유니언 타입 배열

배열의 각 요소가 여러 선택 타입 중 하나일 수 있음을 나타내려면 유니언 타입을 사용한다.

유니언 타입으로 배열 타입을 사용할 때 애너테이션의 어느 부분이 배열의 콘텐츠이고 어느 부분이 유니언 타입 묶음인지를 나타내기 위해 괄호를 사용해야 할 수도 있다.

```ts
// string 또는 number의 배열
let stringOrArrayOfNumbers: string | number[];

// 각각 number 또는 string인 요소의 배열
let arrayOfStringOrNumbers: (string | number)[];
```

타입스크립트는 배열의 선언에서 두 가지 이상의 요소 타입이 포함되는 경우 유니언 타입 배열임을 알게 된다. 배열의 요소 타입은 배열에 담긴 요소에 대한 모든 가능한 타입의 집합이다.

```ts
// (string | undefined)[]
const namesMaybe = ['Aqualtune', 'Blenda', undefined];
```

### 6.1.3 any 배열의 진화

초기에 빈 배열로 설정된 변수에서 타입 애너테이션을 포함하지 않으면 타입스크립트는 배열을 any[]로 취급하고 모든 콘텐츠를 받을 수 있다. 하지만 any 변수가 변경되는 것처럼 any[] 배열이 변경되는 것도 좋아하지 않는다. 타입 애너테이션이 없는 빈 배열은 잠재적으로 잘못된 값 추가를 허용해 타입스크립트의 검사기가 갖는 이점을 부분적으로 무력화한다.

```ts
// any[]
let values = [];

// string[]
values.push('');

// (number | string)[]
values[0] = 0;
```

### 6.1.4 다차원 배열

2차원 배열 또는 배열의 배열은 두 개의 `[]`(대괄호)를 갖는다.

```ts
let arrayOfArraysOfNumbers: number[][];

arrayOfArraysOfNumbers = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9],
];
```

다차원 배열 타입은 배열 타입에 새로운 개념을 도입한 게 아니다. 2차원 배열은 원래의 타입을 가지며 끝에 []가 있고 그 뒤에 []를 추가한다고 생각하면 쉽다.

## 6.2 배열 멤버

타입스크립트는 배열의 멤버를 찾아서 해당 배열의 타입 요소를 되돌려주는 전형적인 인덱스 기반 접근 방식을 이해하는 언어이다.

```ts
const defenders = ['Clarenza', 'Dina'];

// string
const defender = defenders[0];
```

유니언 타입으로 된 배열의 멤버는 그 자체로 동일한 유니언 타입니다.

```ts
const soldiersOrDates = ['Deborah Sampson', new Date(1782, 6, 3)];

// string | Date
const soldierOrDate = soldiersOrDates[0];
```

### 6.2.1 주의 사항: 불안정한 멤버

배열은 타입 시스템에서 불안정한 소스이다. 기본적으로 타입스크립트는 모든 배열의 멤버에 대한 접근이 해당 배열의 멤버를 반환한다고 가정하지만 자바스크립트에서조차도 배열의 길이보다 큰 인덱스로 배열 요소에 접근하면 undefined를 제공한다.

```ts
function withElements(elements: string[]) {
  console.log(elements[9001].length); // 오류 없음
}

withElements(["It's", 'over']);
```

타입스크립트는 검색된 배열의 멤버가 존재하는지 의도적으로 확인하지 않는다.

타입스크립트에는 배열 조회를 더 제한하고 타입을 안전하게 만드는 noUncheckedIndexedAccess 플래그가 있지만 이 플래그는 매우 엄격해서 대부분의 프로젝트에서 사용하지 않는다.

:::note

**noUncheckedIndexedAccess 옵션을 default로 사용하지 않는 이유**

- [noUncheckedIndexedAccess should be enabled by default in strict mode](https://github.com/microsoft/TypeScript/issues/49169)

:::

## 6.3 스프레드와 나머지 매개변수

### 6.3.1 스프레드

`...` 스프레드 연산자를 사용해 배열을 결합한다. 타입스크립트는 입력된 배열 중 하나의 값이 결과 배열에 포함될 것임을 이해한다.

입력된 배열이 동일한 타입이면 출력 배열도 동일한 타입이다. 서로 다른 타입의 두 배열을 함께 스프레드해 새 배열을 생성하면 새 배열은 두 개의 원래 타입 중 어느 하나의 요소인 유니언 타입 배열로 이해된다.

```ts
// string[]
const soldiers = ['Harriet Tubman', 'Joan of Arc', 'Khutulun'];

// number[]
const soldierAges = [90, 19, 45];

// (string | number)[]
const conjoined = [...soldiers, ...soldierAges];
```

### 6.3.2 나머지 매개변수 스프레드

타입스크립트는 나머지 매개변수로 배열을 스프레드하는 자바스크립트 실행을 인식하고 이에 대해 타입 검사를 수행한다. 나머지 매개변수를 위한 인수로 사용되는 배열은 나머지 매개변수와 동일한 배열 타입을 가져야 한다.

```ts
function logWarriors(greeting: string, ...names: string[]) {
  for (const name of names) {
    console.log(`${greeting}, ${name}!`);
  }
}

const warriors = ['Cathay Williams', 'Lozen', 'Nzinga'];

logWarriors('Hello', ...warriors);

const birthYears = [1844, 1840, 1583];

logWarriors('Born in', ...birthYears); // ERROR
```

## 6.4 튜플

튜플 배열은 각 인덱스에 알려진 특정 타입을 가지며 배열의 모든 가능한 멤버를 갖는 유니언 타입보다 더 구체적이다. 튜플 타입을 선언하는 구문은 배열 리터럴처럼 보이지만 요소의 값 대신 타입을 적는다.

```ts
const pairLoose = [false, 123];

let yearAndWarrior: [number, string];

yearAndWarrior = [530, 'Tomyris']; // OK

yearAndWarrior = [false, 'Tomyris']; // ERROR

yearAndWarrior = [530]; // ERROR
```

자바스크립트에서는 단일 조건을 기반으로 두 개의 변수에 초깃값을 설정하는 것처럼 한 번에 여러 값을 할당하기 위해 튜플과 배열 구조 분해 할당을 함께 자주 사용한다.

```ts
let [year, warrior] = Math.random() > 0.5 ? [340, 'Archidamia'] : [1828, 'Rani of Jhansi'];
```

### 6.4.1 튜플 할당 가능성

타입스크립트에서 튜플 타입은 가변 길이의 배열 타입보다 더 구체적으로 처리된다. 가변 길이의 배열 타입은 튜플 타입에 할당할 수 없다.

```ts
// (boolean | number)[]
const pairLoose = [false, 123];

const pairTupleLoose: [boolean, number] = pairLoose; // ERROR
```

튜플 타입의 튜플에 얼마나 많은 멤버가 있는지 알고 있기 때문에 길이가 다른 튜플은 서로 할당할 수 없다.

```ts
const tupleThree: [boolean, number, string] = [false, 1583, 'Nzinga'];

const tupleTwoExact: [boolean, number] = [tupleThree[0], tupleThree[1]];

const tupleTwoExtra: [boolean, number] = tupleThree; // ERROR
```

**나머지 매개변수로서의 튜플**

튜플은 구체적인 길이와 요소 타입 정보를 가지는 배열로 간주되므로 함수에 전달할 인수를 저장하는 데 특히 유용하다. 타입스크립트는 `...` 나머지 매개변수로 전달된 튜플에 정확한 타입 검사를 제공할 수 있다.

```ts
function logPair(name: string, value: number) {
  console.log(`${name} has ${value}`);
}

const pairArray = ['Amage', 1];

logPair(...pairArray); // ERROR

const pairTupleIncorrect: [number, string] = [1, 'Amage'];

logPair(...pairTupleIncorrect); // ERROR

const pairTupleCorrect: [string, number] = ['Amage', 1];

logPair(...pairTupleCorrect); // OK
```

나머지 매개변수 튜플을 사용하고 싶다면 여러 번 함수를 호출하는 인수 목록을 배열에 저장해 함께 사용할 수 있다.

```ts
function logTrio(name: string, value: [number, boolean]) {
  console.log(`${name} has ${value[0]} (${value[1]})`);
}

const trios: [string, [number, boolean]][] = [
  ['Amanitore', [1, true]],
  ['Amanitores', [2, false]],
  ['Ann E. Dunwoody', [3, false]],
];

trios.forEach(trio => logTrio(...trio)); // OK

trios.forEach(logTrio); // ERROR
```

### 6.4.2 튜플 추론

타입스크립트는 생성된 배열을 튜플이 아닌 가변 길이의 배열로 취급한다.

```ts
// 반환 타입: (string | number)[]
function firstCharAndSize(input: string) {
  return [input[0], input.length];
}

// firstChar 타입: string | number
// size 타입: string | number
const [firstChar, size] = firstCharAndSize('Gudit');
```

**명시적 튜플 타입**

함수에 대한 반환 타입 애너테이션처럼 튜플 타입도 타입 애너테이션에 사용할 수 있다.

```ts
// 반환 타입: [string, number]
function firstCharAndSizeExplicit(input: string): [string, number] {
  return [input[0], input.length];
}

// firstChar 타입: string | number
// size 타입: string | number
const [firstChar, size] = firstCharAndSize('Cathay Williams');
```

**const 어서션**

명시적 타입 애너테이션에 튜플 타입을 입력하는 작업은 명시적 타입 애너테이션을 입력할 때와 동일한 이유로 고통스러울 수 있다.

타입스크립트는 값 뒤에 넣을 수 있는 const 어서션인 `as const` 연산자를 제공한다. const 어서션은 타입스크립트에 타입을 유추할 때 읽기 전용이 가능한 값 형식을 사용하도록 지시한다.

```ts
// 타입: (string | number)[]
const unionArray = [1157, 'Tomoe'];

// 타입: readonly [1157, "Tomoe"]
const readonlyTuple = [1157, 'Tomoe'] as const;
```

const 어서션은 유연한 크기의 배열을 고정된 크기의 튜플로 전환하는 것을 넘어서 해당 튜플이 읽기 전용이고 값 수정이 예상되는 곳에서 사용할 수 없음을 나타낸다.

```ts
const pairMutable: [number, string] = [1157, 'Tomoe'];
pairMutable[0] = 1247; // OK

const pairAlsoMutable: [number, string] = [1157, 'Tomoe'] as const; // ERROR

const pairConst = [1157, 'Tomoe'] as const;
pairConst[0] = 1247; // ERROR
```

튜플은 반환하는 함수로부터 반환된 값은 보통 즉시 구조화되지 않으므로 읽기 전용인 튜플은 함수를 사용하는 데 방해가 되지 않는다.

```ts
// 반환 타입: readonly [string, number]
function firstCharAndSizeAsConst(input: string) {
  return [input[0], input.length] as const;
}

// firstChar 타입: string
// size 타입: number
const [firstChar3, size3] = firstCharAndSizeAsConst('Ching Shih');
```
