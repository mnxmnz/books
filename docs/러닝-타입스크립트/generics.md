---
sidebar_position: 10
---

# 10장 제네릭

타입스크립트는 **제네릭**을 사용해서 타입 간의 관계를 알아낸다.

함수와 같은 구조체는 **제네릭 타입 매개변수**를 원하는 수만큼 선언할 수 있다. 제네릭 타입 매개변수는 제네릭 구조체의 각 사용법에 따라 타입이 결정된다. 이러한 타입 매개변수는 구조체의 각 인스턴스에서 서로 다른 일부 타입을 나타내기 위해 구조체의 타입으로 사용된다. 타입 매개변수는 구조체의 각 인스턴스에 대해 **타입 인수**라고 하는 서로 다른 타입을 제공할 수 있지만 타입 인수가 제공된 인스턴스 내에서는 일관성을 유지한다.

## 10.1 제네릭 함수

매개변수 괄호 바로 앞 홑화살괄호(`<`, `>`)로 묶인 타입 매개변수에 별칭을 배치해 함수를 제네릭으로 만든다. 그러면 해당 타입 매개변수를 함수의 본문 내부의 매개변수 타입 애너테이션, 반환 타입 애너테이션, 타입 애너테이션에서 사용할 수 있다.

```ts
// input 매개변수에 대한 타입 매개변수 T 선언
function identity<T>(input: T) {
  return input; // 함수의 반환 타입이 T임을 유추
}

// 함수를 호출할 때마다 T에 대한 다른 타입 유추
const numeric = identity('me'); // 타입: "me"
const stringy = identity(123); // 타입: 123
```

### 10.1.1 명시적 제네릭 호출 타입

클래스 멤버와 변수 타입과 마찬가지로 타입 인수를 해석하기 위한 함수 호출 정보가 충분하지 않을 수 있다. 이러한 현상은 타입 인수를 알 수 없는 제네릭 구문을 다른 제네릭 구문에 제공할 때 주로 발생한다.

```ts
// Input처럼 변수에 의미를 담을 수 있을 땐 최대한 담는 것이 좋음
function logWrapper<Input>(callback: (input: Input) => void) {
  return (input: Input) => {
    console.log('Input: ', input);
    callback(input);
  };
}

// 매개변수 타입이 명시적으로 선언된 callback과 logWrapper가 함께 호출되는 경우
// 타입 인수를 유추할 수 있음
logWrapper((input: string) => {
  console.log(input.length);
});

// 매개변수 타입을 모르는 경우
// Input이 무엇이 되어야 하는지 알 수 없음
logWrapper(input => {
  console.log(input.length); // ERROR: 'input'은(는) 'unknown' 형식입니다.
});
```

기본값이 unknown으로 설정되는 것을 피하기 위해 타입스크립트에 해당 타입 인수가 무엇인지 명시적으로 알려주는 **명시적 제네릭 타입 인수**를 사용해 함수를 호출할 수 있다. 매개변수가 타입 인수로 제공된 것과 일치하는지 확인하기 위해 제네릭 호출에서 타입 검사를 수행한다.

```ts
// 타입: (input: string) => void
logWrapper<string>(input => {
  console.log(input.length);
});

logWrapper<string>((input: boolean) => {
  // ERROR: '(input: boolean) => void' 형식의 인수는 '(input: string) => void' 형식의 매개 변수에 할당될 수 없습니다.
  // 'input' 및 'input' 매개 변수의 형식이 호환되지 않습니다.
  // 'string' 형식은 'boolean' 형식에 할당할 수 없습니다.
});
```

### 10.1.2 다중 함수 타입 매개변수

제네릭 함수의 각 호출은 각 타입 매개변수에 대한 자체 값 집합을 확인할 수 있다.

```ts
// 두 개의 매개변수를 선언하고 입력된 값을 읽기 전용 튜플로 반환
function makeTuple<First, Second>(first: First, second: Second) {
  return [first, second] as const;
}

let tuple = makeTuple(true, 'abc'); // 타입: readonly [boolean, string]
```

함수가 여러 개의 타입 매개변수를 선언하면 해당 함수에 대한 호출은 명시적으로 제네릭 타입을 모두 선언하지 않거나 모두 선언해야 한다.

## 10.2 제네릭 인터페이스

인터페이스도 제네릭으로 선언할 수 있다. 인터페이스 이름 뒤 `<` 과 `>` 사이에 선언된 임의의 수의 타입 매개변수를 갖는다. 해당 제네릭 타입은 멤버 타입과 같이 선언의 다른 곳에서 사용할 수 있다.

타입스크립트에서 내장 Array 메서드는 제네릭 인터페이스로 정의된다. Array는 타입 매개변수 T를 사용해서 배열 안에 저장된 데이터의 타입을 나타낸다.

```ts
interface Array<T> {
  /**
   * 배열에서 마지막 요소를 제거하고 그 요소를 반환
   * 배열이 비어 있는 경우 undefined를 반환하고 배열은 수정되지 않음
   */
  pop(): T | undefined;

  /**
   * 배열의 끝에 새로운 요소를 추가하고 배열의 길이를 반환
   * @param items 배열에 추가된 새로운 요소
   */
  push(...items: T[]): number;
}
```

### 10.2.1 유추된 제네릭 인터페이스 타입

제네릭 타입을 취하는 것으로 선언된 위치에 제공된 값의 타입에서 타입 인수를 유추한다.

인터페이스가 타입 매개변수를 선언하는 경우 해당 인터페이스를 참조하는 모든 타입 애너테이션은 이에 상승하는 타입 인수를 제공해야 한다.

```ts
interface CrateLike<T> {
  contents: T;
}

let missingGeneric: CrateLike = {
  // 타입 인수를 포함하지 않은 채로 사용해서 오류 발생
  // ERROR: 'CrateLike<T>' 제네릭 형식에 1 형식 인수가 필요합니다.
  inside: '??',
};
```

## 10.3 제네릭 클래스

클래스도 멤버에서 사용할 임의의 수의 타입 매개변수를 선언할 수 있다. 클래스의 각 인스턴스는 타입 매개변수로 각자 다른 타입 인수 집합을 가진다.

제네릭 인터페이스와 마찬가지로 클래스를 사용하는 타입 애너테이션은 해당 클래스의 제네릭 타입이 무엇인지를 타입스크립트에 나타내야 한다.

### 10.3.1 명시적 제네릭 클래스 타입

제네릭 클래스 인스턴스화는 제네릭 함수를 호출하는 것과 동일한 타입 인수 유추 규칙을 따른다. 함수 생성자에 전달한 매개변수의 타입으로부터 타입 인수를 유추할 수 있다면 타입스크립트는 유추된 타입을 사용한다. 생성자에 전달된 인수에서 클래스 타입 인수를 유추할 수 없는 경우에는 타입 인수의 기본값은 unknown이 된다.

```ts
// CurriedCallback 클래스는 제네릭 함수를 받는 생성자 선언
// 제네릭 함수가 명시적 타입 인수의 타입 애너테이션과 같은 알려진 타입을 갖는 경우
// 클래스 인스턴스의 Input 타입 인수는 이를 통해 타입을 알아냄
class CurriedCallback<Input> {
  #callback: (input: Input) => void;

  constructor(callback: (input: Input) => void) {
    this.#callback = (input: Input) => {
      console.log('Input: ', input);
      callback(input);
    };
  }

  call(input: Input) {
    this.#callback(input);
  }
}

// 타입: CurriedCallback<string>
new CurriedCallback((input: string) => {
  console.log(input.length);
});

// 타입: CurriedCallback<unknown>
new CurriedCallback(input => {
  console.log(input.length); // ERROR: 'input'은(는) 'unknown' 형식입니다.
});
```

클래스 인스턴스는 다른 제네릭 함수 호출과 동일한 방식으로 명시적 타입 인수를 제공해서 기본값 unknown이 되는 것을 피할 수 있다.

```ts
// Input 타입 인수를 string으로 명시적으로 제공하므로
// 해당 콜백의 Input 타입 매개변수가 string으로 해석됨을 유추할 수 있음
// 타입: CurriedCallback<string>
new CurriedCallback<string>(input => {
  console.log(input.length);
});

new CurriedCallback<string>((input: boolean) => {
  // ERROR: '(input: boolean) => void' 형식의 인수는 '(input: string) => void' 형식의 매개 변수에 할당될 수 없습니다.
  // 'input' 및 'input' 매개 변수의 형식이 호환되지 않습니다.
  // 'string' 형식은 'boolean' 형식에 할당할 수 없습니다.
  console.log(input.length);
});
```

### 10.3.2 제네릭 클래스 확장

제네릭 클래스는 extends 키워드 다음에 오는 기본 클래스로 사용할 수 있다. 타입스크립트는 기본 클래스에 대한 타입 인수를 유추하지 않는다. 기본값이 없는 모든 타입 인수는 명시적 타입 애너테이션을 사용해서 지정한다.

제네릭 파생 클래스는 자체 타입 인수를 기본 클래스에 번갈아 전달할 수 있다. 타입 이름은 일치하지 않아도 된다.

```ts
class Quote<T> {
  lines: T;

  constructor(lines: T) {
    this.lines = lines;
  }
}

// 다른 이름의 Value 타입 인수를 기본 클래스 Quote<T>에 전달
class AttributedQuote<Value> extends Quote<Value> {
  speaker: string;

  constructor(value: Value, speaker: string) {
    super(value);
    this.speaker = speaker;
  }
}

// 타입: AttributedQuote<string>
// (Quote<string> 확장하기)
new AttributedQuote('The road to Success is always under construction.', 'Lily Tomlin');
```

### 10.3.3 제네릭 인터페이스 구현

제네릭 클래스는 모든 필요한 매개변수를 제공함으로써 제네릭 인터페이스를 구현한다. 제네릭 인터페이스는 제네릭 기본 클래스를 확장하는 것과 유사하게 작동한다. 기본 인터페이스의 모든 타입 매개변수는 클래스에 선언되어야 한다.

### 10.3.4 메서드 제네릭

클래스 메서드는 클래스 인스턴스와 별개로 자체 제네릭 타입을 선언할 수 있다. 제네릭 클래스 메서드에 대한 각각의 호출은 각 타입 매개변수에 대해 다른 타입 인수를 갖는다.

### 10.3.5 정적 클래스 제네릭

클래스의 정적 멤버는 인스턴스 멤버와 구별되고 클래스의 특정 인스턴스와 연결되어 있지 않다. 클래스의 정적 멤버는 클래스 인스턴스에 접근할 수 없거나 타입 정보를 지정할 수 없다. 정적 클래스 메서드는 자체 타입 매개변수를 선언할 수 있지만 클래스에 선언된 어떤 타입 매개변수에도 접근할 수 없다.

## 10.4 제네릭 타입 별칭

타입 인수를 사용해 제네릭을 만드는 타입스크립트의 마지막 구조체는 타입 별칭이다. 각 타입 별칭에는 T를 받는 Nullish 타입과 같은 임의의 수의 타입 매개변수가 주어진다.

```ts
type Nullish<T> = T | null | undefined;
```

제네릭 타입 별칭은 일반적으로 제네릭 함수의 타입을 설명하는 함수와 함께 사용한다.

```ts
type CreatesValue<Input, Output> = (input: Input) => Output;

// 타입: (input: string) => number
let creator: CreatesValue<string, number>;

creator = text => text.length; // OK

// ERROR: 'string' 형식은 'number' 형식에 할당할 수 없습니다.
creator = text => text.toUpperCase();
```

### 10.4.1 제네릭 판별된 유니언

판별된 유니언을 사용하면 데이터의 성공적인 결과 또는 오류로 인한 실패를 나타내는 제네릭 결과 타입을 만들기 위해 타입 인수를 추가할 수 있다.

```ts
// Result 제네릭 타입은 성공 또는 실패 여부에 대한 결과를 좁히는 데(내로잉) 사용하는 succeeded 판별자를 포함
// Result를 반환하는 모든 작업은 오류 또는 데이터 결과를 나타내며 이를 사용하는 곳에서는 result의 succeeded가 true인지 false인지 여부를 확인
type Result<Data> = FailureResult | SuccessfulResult<Data>;

interface FailureResult {
  error: Error;
  succeeded: false;
}

interface SuccessfulResult<Data> {
  data: Data;
  succeeded: true;
}

function handleResult(result: Result<string>) {
  if (result.succeeded) {
    console.log(`We did it! ${result.data}`);
  } else {
    console.error(`Awww... ${result.error}`);
  }

  result.data;
  // ERROR: 'Result<string>' 형식에 'data' 속성이 없습니다.
  // 'FailureResult' 형식에 'data' 속성이 없습니다.
}
```

## 10.5 제네릭 제한자

### 10.5.1 제네릭 기본값

타입 매개변수 선언 뒤에 =와 기본 타입을 배치해 타입 인수를 명시적으로 제공할 수 있다. 기본값은 타입 인수가 명시적으로 선언되지 않고 유추할 수 없는 모든 후속 타입에 사용된다.

타입 매개변수는 동일한 선언 안의 앞선 타입 매개변수를 기본값으로 가질 수 있다. 각 타입 매개변수는 선언에 대한 새로운 타입을 도입하므로 해당 선언 이후의 타입 매개변수에 대한 기본값으로 이를 사용할 수 있다.

모든 기본 타입 매개변수는 기본 함수 매개변수처럼 선언 목록의 제일 마지막에 와야 한다. 기본값이 없는 제네릭 타입은 기본값이 있는 제네릭 타입 뒤에 오면 안 된다.

## 10.6 제한된 제네릭 타입

타입 매개변수가 타입을 확장해야 한다고 선언할 수 있으며 별칭 타입에만 허용되는 작업이다. 타입 매개변수를 제한하는 구문은 매개변수 이름 뒤에 extends 키워드를 배치하고 그 뒤에 이를 제한할 타입을 배치한다.

```ts
interface WithLength {
  length: number;
}

// 제네릭 함수가 T 제네릭에 대한 length를 가진 모든 타입을 받아들이도록 구현할 수 있음
function logWithLength<T extends WithLength>(input: T) {
  console.log(`Length: ${input.length}`);
  return input;
}

// 문자열, 배열 그리고 length: number를 가진 객체는 허용되지만
logWithLength('No one can figure out your worth but you.'); // 타입: string
logWithLength([false, true]); // 타입: boolean[]
logWithLength({ length: 123 }); // 타입: { length: number }

// Date와 같은 타입 형태에는 숫자형 length 멤버가 없으므로 타입 오류가 발생함
logWithLength(new Date());
// ERROR: 'Date' 형식의 인수는 'WithLength' 형식의 매개 변수에 할당될 수 없습니다.
// 'length' 속성이 'Date' 형식에 없지만 'WithLength' 형식에서 필수입니다.
```

### 10.6.1 keyof와 제한된 타입 매개변수

extends와 keyof를 함께 사용하면 타입 매개변수를 이전 타입 매개변수의 키로 제한할 수 있다. 또한 제네릭 타입의 키를 지정하는 유일한 방법이다.

```ts
// Lodash의 get 메서드의 간단한 버전
// T로 입력된 container 값과 container에서 검색할 수 있는 T의 key 중 하나의 key 이름을 받음
// Key 타입 매개변수는 keyof T로 제한되기 때문에 타입스크립트는 이 함수가 T[key]를 반환할 수 있음을 알고 있음
function get<T, Key extends keyof T>(container: T, key: Key) {
  return container[key];
}

const roles = {
  favorite: 'Fargo',
  others: ['Almose Famous', 'Burn After Reading', 'Nomadland'],
};

const favorite = get(roles, 'favorite'); // 타입: string
const others = get(roles, 'others'); // 타입: string[]

const missing = get(roles, 'extras');
// ERROR: '"extras"' 형식의 인수는 '"favorite" | "others"' 형식의 매개 변수에 할당될 수 없습니다.
```

keyof가 없었다면 제네릭 key 매개변수를 올바르게 입력할 방법이 없었을 것이다.

```ts
// 타입 매개변수로 T만 제공되고 key 매개변수가 모든 keyof T일 수 있는 경우라면 반환 타입은 Container에 있는 모든 속성값에 대한 유니언 타입이 된다.
// 이렇게 구체적이지 않은 함수 선언은 각 호출이 타입 인수를 통해 특정 key를 가질 수 있음을 타입스크립트에 나타낼 수 없음
function get<T>(container: T, key: keyof T) {
  return container[key];
}

const roles = {
  favorite: 'Fargo',
  others: ['Almose Famous', 'Burn After Reading', 'Nomadland'],
};

const found = get(roles, 'favorite'); // 타입: string | string[]
```

## 10.7 Promise

### 10.7.1 Promise 생성

타입스크립트에서 Promise 생성자는 단일 매개변수를 받도록 작성된다. 해당 매개변수의 타입은 제네릭 Promise 클래스에 선언된 타입 매개변수에 의존한다.

```ts
class PromiseLike<Value> {
  constructor(executor: (resolve: (value: Value) => void, reject: (reason: unknown) => void) => void) {
    // ...
  }
}
```

결과적으로 값을 resolve하려는 Promise를 만들려면 Promise의 타입 인수를 명시적으로 선언해야 한다. 타입스크립트는 명시적 제네릭 타입 인수가 없으면 기본적으로 매개변수 타입을 unknown으로 가정한다. Promise 생성자에 타입 인수를 명시적으로 제공하면 타입스크립트가 결과로서 생기는 Promise 인스턴스의 resolve된 타입을 이해할 수 있다.

```ts
// 타입: Promise<unknown>
const resolvesUnknown = new Promise(resolve => {
  setTimeout(() => resolve('Done!'), 1000);
});

// 타입: Promise<string>
const resolvesString = new Promise<string>(resolve => {
  setTimeout(() => resolve('Done!'), 1000);
});
```

Promise의 제네릭 .then 메서드는 반환되는 Promise의 resolve된 값을 나타내는 새로운 타입 매개변수를 받는다.

### 10.7.2 async 함수

자바스크립트에서 async 키워드를 사용해 선언한 모든 함수는 Promise를 반환한다. 자바스크립트에서 async 함수에 따라서 반환된 값이 Thenable(.then() 메서드가 있는 객체, 실제로는 거의 항상 Promise)이 아닌 경우 Promise.resolve가 호출된 것처럼 Promise로 래핑된다.

```ts
// lengthAfterSecond는 Promise<number>를 직접적으로 반환하는 반면
// lengthImmediately는 async 함수이고 직접 number를 반환하기 때문에 Promise<number>를 반환하는 것으로 간주됨

// 타입: (text: string): Promise<number>
async function lengthAfterSecond(text: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return text.length;
}

// 타입: (text: string): Promise<number>
async function lengthImmediately(text: string) {
  return text.length;
}
```

Promise를 명시적으로 언급하지 않더라고 async 함수에서 수동으로 선언된 반환 타입은 항상 Promise 타입이 된다.

```ts
// Promise를 명시적으로 언급하지 않더라도
// async 함수에서 수동으로 선언된 반환 타입은 항상 Promise 타입이 된다.
async function givesPromiseForString(): Promise<string> {
  return 'Done!';
}

async function givesString(): string {
  // ERROR: 비동기 함수 또는 메서드의 반환 형식은 전역 Promise<T> 형식이어야 합니다.
  return 'Done!';
}
```

## 10.8 제네릭 올바르게 사용하기

### 10.8.1 제네릭 황금률

함수에 타입 매개변수가 필요한지 여부를 판단할 수 있는 간단하고 빠른 방법은 타입 매개변수가 최소 두 번 이상 사용되었는지 확인하는 것이다. 제네릭은 타입 간의 관계를 설명하므로 제네릭 타입 매개변수가 한 곳에만 나타나면 여러 타입 간의 관계를 정의할 수 없다. 따라서 각 함수 타입 매개변수는 매개변수에 사용되어야 하고 그다음 적어도 하나의 다른 매개변수 또는 함수의 반환 타입에서도 사용되어야 한다.

```ts
// input 매개변수를 선언하기 위해 Input 타입 매개변수를 정확히 한 번 사용한다.
function logInput<Input extends string>(input: Input) {
  console.log('Hi', input);
}
```

Input 타입 매개변수를 사용하지 않고 logInput을 다시 작성할 수 있다.

```ts
function logInput(input: string) {
  console.log('Hi', input);
}
```

### 10.8.2 제네릭 명명 규칙

타입스크립트를 포함한 많은 언어가 지키는 타입 매개변수에 대한 표준 명명 규칙은 기본적으로 첫 번째 타입 인수로 T를 사용하고 후속 타입 매개변수가 존재하면 U, V 등을 사용하는 것이다.

타입 인수가 어떻게 사용되어야 하는지 맥락과 관련된 정보가 알려진 경우 명명 규칙은 경우에 따라 해당 용어의 첫 글자를 사용하는 것으로 확장된다.

상태 관리 라이브러리에서는 제네릭 상태를 S로, 데이터 구조의 키와 값은 K와 V로 나타내기도 한다.

제네릭의 의도가 단일 문자 T에서 명확하지 않은 경우에는 타입이 사용되는 용도를 가리키는 설명적인 제네릭 타입 이름을 사용하는 것이 가장 좋다.

````ts
function labelBox<Label, Value>(label: Label, value: Value) {
  // ...
}```
````
