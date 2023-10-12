---
sidebar_position: 7
---

# 7장 인터페이스

## 7.1 타입 별칭 vs 인터페이스

인터페이스와 타입 별칭 사이에는 몇 가지 주요 차이점이 있다.

- 인터페이스는 속성 증가를 위해 병합할 수 있다. 내장된 전역 인터페이스 또는 npm 패키지와 같은 외부 코드를 사용할 때 유용하다.
- 인터페이스는 클래스가 선언된 구조의 타입을 확인하는 데 사용할 수 있지만 타입 별칭은 사용할 수 없다.
- 일반적으로 인터페이스에서 타입 검사기가 더 빨리 작동한다. 인터페이스는 타입 별칭이 하는 것처럼 새로운 객체 리터럴의 동적인 복사 붙여넣기보다 내부적으로 더 쉽게 캐시할 수 있는 명명된 타입을 선언한다.
- 인터페이스는 이름 없는 객체 리터럴의 별칭이 아닌 이름 있는(명명된) 객체로 간주되므로 어려운 특이 케이스에서 나타나는 오류 메시지를 좀 더 쉽게 읽을 수 있다.

:::note

**Type vs Interface**

- 인터페이스를 사용하면 라이브러리와 같은 외부 코드를 사용할 때 편리하다.
- 유의미한 속도 차이는 없고 팀에서 사용하는 것이 정답이다.

:::

## 7.2 속성 타입

인터페이스와 타입 별칭은 비슷하게 작동해서 이 장에서 소개하는 속성 타입은 별칭 객체 타입에도 사용할 수 있다.

### 7.2.1 선택적 속성

타입 애너테이션 `:` 앞에 `?`를 사용해 인터페이스의 속성이 선택적 속성임을 나타낼 수 있다.

### 7.2.2 읽기 전용 속성

속성 이름 앞에 `readonly` 키워드를 추가해 다른 값으로 설정될 수 없음을 나타낸다. `readonly` 속성은 평소대로 읽을 수 있지만 새로운 값으로 재할당하지 못한다.

```ts
interface Page {
  readonly text: string;
}

function read(page: Page) {
  console.log(page.text); // OK

  page.text += '!'; // ERROR: 읽기 전용 속성이므로 'text'에 할당할 수 없습니다.
}
```

`readonly` 제한자는 타입 시스템에만 존재하며 인터페이스에서만 사용할 수 있다. `readonly` 제한자는 객체의 인터페이스를 선언하는 위치에서만 사용되고 실제 객체에는 적용되지 않는다.

```ts
interface Page {
  readonly text: string;
}

function read(page: Page) {
  // ...
}

const pageIsh = {
  text: 'Hello, world!',
};

pageIsh.text += '!'; // OK

read(pageIsh); // OK
```

`readonly` 인터페이스 멤버는 코드 영역에서 객체를 의도치 않게 수정하는 것을 막는 편리한 방법이다. 그러나 `readonly`는 타입 시스템 구성 요소일 뿐 컴파일된 자바스크립트 출력 코드에는 존재하지 않는다. `readonly`는 단지 타입스크립트 타입 검사기를 사용해 개발 중에 그 속성이 수정되지 못하도록 보호하는 역할을 한다.

### 7.2.3 함수와 메서드

타입스크립트는 인터페이스 멤버를 함수로 선언하는 두 가지 방법을 제공한다.

- **메서드 구문**: 인터페이스 멤버를 `member(): void`와 같이 객체 멤버로 호출되는 함수로 선언
- **속성 구문**: 인터페이스의 멤버를 `member: () => void`와 같이 독립 함수와 동일하게 선언

```ts
interface HasBothFunctionTypes {
  property: () => string;
  method(): string;
}

const hasBoth: HasBothFunctionTypes = {
  property: () => '',
  method() {
    return '';
  },
};

hasBoth.property(); // OK
hasBoth.method(); // OK
```

**메서드와 속성의 주요 차이점은 다음과 같다.**

- 메서드는 `readonly`로 선언할 수 없지만 속성은 가능하다.
- 인터페이스 병합은 메서드와 속성을 다르게 처리한다.
- 타입에서 수행되는 일부 작업은 메서드와 속성을 다르게 처리한다.

현시점에서 추천하는 스타일 가이드는 다음과 같다.

- 기본 함수가 `this`를 참조할 수 있다는 것을 알고 있다면 메서드 함수를 사용한다. 일반적으로 클래스의 인스턴스에서 사용된다.
- 반대의 경우는 속성 함수를 사용한다.

:::note

**메서드와 속성의 차이**

- 주로 속성을 사용하지만 둘의 차이점을 미리 알아두는 것이 좋다.
- 차이점을 미리 알아두면 다른 사람이 작성한 코드를 읽을 때 도움이 된다.

:::

### 7.2.4 호출 시그니처

인터페이스와 객체 타입은 호출 시그니처로 선언할 수 있다. 호출 시그니처는 값을 함수처럼 호출하는 방식에 대한 타입 시스템의 설명이다. 호출 시그니처가 선언한 방식으로 호출되는 값만 인터페이스에 할당할 수 있다. 할당 가능한 매개변수와 반환 타입을 가진 함수이다.

```ts
type FunctionAlias = (input: string) => number;

interface CallSignature {
  (input: string): number;
}

// 타입: (input: string) => number
const typedFunctionAlias: FunctionAlias = input => input.length; // OK

// 타입: (input: string) => number
const typedCallSignature: CallSignature = input => input.length; // OK
```

호출 시그니처는 사용자 정의 속성을 추가로 갖는 함수를 설명하는 데 사용할 수 있다. 타입스크립트는 함수 선언에 추가된 속성을 해당 함수 선언의 타입에 추가하는 것으로 인식한다.

```ts
interface FunctionWithCount {
  count: number;
  (): void;
}

let hasCallCount: FunctionWithCount;

function keepsTrackOfCalls() {
  keepsTrackOfCalls.count += 1;
  console.log(`I've been called ${keepsTrackOfCalls.count} times!`);
}

keepsTrackOfCalls.count = 0;

hasCallCount = keepsTrackOfCalls; // OK

function doesNotHaveCount() {
  console.log('No idea!');
}

hasCallCount = doesNotHaveCount; // ERROR: 'count' 속성이 '() => void' 형식에 없지만 'FunctionWithCount' 형식에서 필수입니다.
```

### 7.2.5 인덱스 시그니처

인덱스 시그니처 구문을 제공해 인터페이스의 객체가 임의의 키를 받고 해당 키 아래의 특정 타입을 반환할 수 있음을 나타낸다. 자바스크립트 객체 속성 조회는 암묵적으로 키를 문자열로 변환하기 때문에 인터페이스의 객체는 문자열 키와 함께 가장 일반적으로 사용된다.

```ts
interface WordCounts {
  [i: string]: number;
}

const counts: WordCounts = {};

counts.apple = 0; // OK
counts.banana = 1; // OK

counts.cherry = false; // ERROR: 'boolean' 형식은 'number' 형식에 할당할 수 없습니다.
```

인덱스 시그니처는 객체에 값을 할당할 때 편리하지만 타입 안정성을 완벽하게 보장하지 않는다. 인덱스 시그니처는 객체가 어떤 속성에 접근해도 값을 반환해야 함을 나타낸다.

```ts
interface DatesByName {
  [i: string]: Date;
}

const publishDates: DatesByName = {
  Frankenstein: new Date('1 January 1818'),
};

publishDates.Frankenstein; // 타입: Date
console.log(publishDates.Frankenstein.toString()); // OK

publishDates.Beloved; // 타입: Date, 런타임: undefined
console.log(publishDates.Beloved.toString()); // 타입: OK, 런타임: ERROR
```

키/값 쌍을 저장하려고 하는데 키를 미리 알 수 없다면 `Map`을 사용하는 편이 더 안전하다.

**속성과 인덱스 시그니처 혼합**

인터페이스는 명시적으로 명명된 속성과 포괄적인 용도의 string 인덱스 시그니처를 한 번에 포함할 수 있다. 각각의 명명된 속성의 타입은 포괄적인 용도의 인덱스 시그니처로 할당할 수 있어야 한다. 명명된 속성이 더 구체적인 타입을 제공하고 다른 모든 속성은 인덱스 시그니처의 타입으로 대체하는 것으로 혼합해서 사용할 수 있다.

```ts
interface HistoricalNovels {
  Oroonoko: number;
  [i: string]: number;
}

// OK
const novels: HistoricalNovels = {
  Outlander: 1991,
  Oroonoko: 1688,
};

const missingOroonoko: HistoricalNovels = {
  // ERROR
  // 'Oroonoko' 속성이 '{ Outlander: number; }' 형식에 없지만 'HistoricalNovels' 형식에서 필수입니다.
  Outlander: 1991,
};
```

속성과 인덱스 시그니처를 혼합해서 사용하는 일반적인 타입 시스템 기법 중 하나는 인덱스 시그니처의 원시 속성보다 명명된 속성에 대해 더 구체적인 속성 타입 리터럴을 사용하는 것이다. 명명된 속성의 타입이 인덱스 시그니처에 할당될 수 있는 경우 타입스크립트는 더 구체적인 속성 타입 리터럴을 사용하는 것을 허용한다.

```ts
interface ChapterStarts {
  preface: 0;
  [i: string]: number;
}

const correctPreface: ChapterStarts = {
  preface: 0,
  night: 1,
  shopping: 5,
};

const wrongPreface: ChapterStarts = {
  preface: 1, // ERROR: '1' 형식은 '0' 형식에 할당할 수 없습니다.
};
```

**숫자 인덱스 시그니처**

인덱스 시그니처는 키로 string 대신 number 타입을 사용할 수 있지만 명명된 속성은 그 타입을 포괄적인 용도의 string 인덱스 시그니처의 타입으로 할당할 수 있어야 한다.

```ts
// OK
interface MoreNarrowNumbers {
  [i: number]: string;
  [i: string]: string | undefined;
}

// OK
const mixesNumbersAndStrings: MoreNarrowNumbers = {
  0: '',
  key1: '',
  key2: undefined,
};

interface MoreNarrowStrings {
  [i: number]: string | undefined; // ERROR: 'number' 인덱스 유형 'string | undefined'을(를) 'string' 인텍스 유형 'string'에 할당할 수 없습니다.
  [i: string]: string;
}
```

### 7.2.6 중첩 인터페이스

자체 인터페이스 타입 혹은 객체 타입을 속성으로 가질 수 있다.

## 7.3 인터페이스 확장

다른 인터페이스의 모든 멤버를 복사해서 선언할 수 있는 **확장된** 인터페이스를 허용한다. 확장할 인터페이스의 이름 뒤에 `extends` 키워드를 추가해서 다른 인터페이스를 확장한 인터페이스라는 걸 표시한다.

인터페이스 확장은 프로젝트의 한 엔티티 타입이 다른 엔티티의 모든 멤버를 포함하는 상위 집합을 나타내는 실용적인 방법이다.

### 7.3.1 재정의된 속성

파생 인터페이스는 다른 타입으로 속성을 다시 선언해 기본 인터페이스의 속성을 재정의하거나 대체할 수 있다.

속성을 재선언하는 대부분의 파생 인터페이스는 해당 속성을 유니언 타입의 더 구체적인 하위 집합으로 만들거나 속성을 기본 인터페이스의 타입에서 확장된 타입으로 만들기 위해 사용한다.

```ts
interface WithNullableName {
  name: string | null;
}

interface WithNonNullableName extends WithNullableName {
  name: string;
}

interface WithNumericName extends WithNullableName {
  // ERROR
  // 'WithNumericName' 인터페이스가 'WithNullableName' 인터페이스를 잘못 확장합니다.
  // 'name' 속성의 형식이 호환되지 않습니다.
  // 'string | number' 형식은 'string | null' 형식에 할당할 수 없습니다.
  // 'number' 형식은 'string' 형식에 할당할 수 없습니다.
  name: number | string;
}
```

### 7.3.2 다중 인터페이스 확장

타입스크립트의 인터페이스는 여러 개의 다른 인터페이스를 확장해서 선언할 수 있다. 파생 인터페이스 이름에 있는 `extends` 키워드 뒤에 쉼표로 인터페이스 이름을 구분해 사용하면 된다.

```ts
interface GivesNumber {
  giveNumber(): number;
}

interface GiveString {
  giveString(): string;
}

interface GivesBothAndEither extends GivesNumber, GiveString {
  giveEither(): number | string;
}

function useGivesBoth(instance: GivesBothAndEither) {
  instance.giveEither(); // 타입: number | string
  instance.giveNumber(); // 타입: number
  instance.giveString(); // 타입: string
}
```

## 7.4 인터페이스 병합

두 개의 인터페이스가 동일한 이름으로 동일한 스코프에 선언된 경우, 선언된 모든 필드를 포함하는 더 큰 인터페이스가 코드에 추가된다.

```ts
interface Merged {
  fromFirst: string;
}

interface Merged {
  fromSecond: number;
}
```

위 코드는 다음과 같다.

```ts
interface Merged {
  fromFirst: string;
  fromSecond: number;
}
```

인터페이스가 여러 곳에 선언되면 코드를 이해하기가 어려워지므로 가능하면 인터페이스 병합을 사용하지 않는 것이 좋다.

그러나 인터페이스 병합은 외부 패키지 또는 Window 같은 내장된 전역 인터페이스를 보강하는 데 유용하다.

```ts
interface Window {
  myEnvironmentVariable: string;
}

window.myEnvironmentVariable; // 타입: string
```

:::note

**globalThis**

```ts
interface Window {
  myEnvironmentVariable: string;
}

window.myEnvironmentVariable;
// ERROR: 'Window & typeof globalThis' 형식에 'myEnvironmentVariable' 속성이 없습니다.
```

오류가 발생하는 이유는 브라우저 실행 환경과 노드 실행 환경의 `globalThis` 차이 때문이다.

```ts
// Browser
globalThis === window; // true

// Node.js
globalThis === global; // true
```

- [자바스크립트에서 globalThis의 소름끼치는 폴리필](https://ui.toast.com/weekly-pick/ko_20190503)

:::

### 7.4.1 이름이 충돌되는 멤버

병합된 인터페이스는 타입이 다른 동일한 이름의 속성을 여러 번 선언할 수 없다.

```ts
interface MergedProperties {
  same: (input: boolean) => string;
  different: (input: string) => string;
}

interface MergedProperties {
  same: (input: boolean) => string; // OK
  different: (input: number) => string; // ERROR: 후속 속성 선언에 같은 형식이 있어야 합니다. 'different' 속성이 '(input: string) => string' 형식이어야 하는데 여기에는 '(input: number) => string' 형식이 있습니다.
}
```

병합된 인터페이스는 동일한 이름과 다른 시그니처를 가진 메서드는 정의할 수 있다. 이렇게 하면 메서드에 대한 함수 오버로드가 발생한다.

```ts
interface MergedMethods {
  different(input: string): string;
}

interface MergedMethods {
  different(input: number): string; // OK
}
```

:::note

**Overloading VS Overriding**

- [오버라이딩 오버로딩](https://www.zerocho.com/category/JavaScript/post/59c17a58f40d2800197c65d6)

:::
