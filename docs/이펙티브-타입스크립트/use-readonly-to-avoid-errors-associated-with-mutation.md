---
sidebar_position: 17
---

# 아이템 17 변경 관련된 오류 방지를 위해 readonly 사용하기

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

readonly number[] 는 **‘타입’** 이고 number[] 와 구분되는 몇 가지 특징이 있다.

- 배열의 요소를 읽을 수 있지만 쓸 수는 없다.
- `length` 를 읽을 수 있지만 바꿀 수 없다.
- 배열을 변경하는 `pop` 을 비롯한 다른 메서드를 호출할 수 없다.

매개변수를 readonly 로 선언하면 다음과 같은 일이 발생한다.

- 타입스크립트는 매개변수가 함수 내에서 변경이 일어나는지 체크한다.
- 호출하는 쪽에서 함수가 매개변수를 변경하지 않는다는 보장을 받게 된다.
- 호출하는 쪽에서 함수에 readonly 배열을 매개변수로 넣을 수 있다.
- `parseTaggedText` 예시 (소설에 여러 처리를 하는 프로그램)
  연속된 행을 가져와서 빈 줄을 기준으로 구분되는 단락으로 나누는 기능을 하는 프로그램이다.

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

## 요약

- 함수가 매개변수를 수정하지 않는다면 readonly 로 선언하는 것이 좋다. readonly 매개변수는 인터페이스를 명확하게 하고 매개변수가 변경되는 것을 방지한다.
- readonly 를 사용하면 변경해서 발생하는 오류를 방지할 수 있고 변경이 발생하는 코드도 쉽게 찾을 수 있다.
- const 와 readonly 의 차이를 이해해야 한다.
- readonly 는 얕게 동작한다.

## 참고 자료

[읽기 전용(readonly)](https://radlohead.gitbook.io/typescript-deep-dive/type-system/readonly)

- `ReadonlyArray<T>` 인터페이스
- `const`/`readonly` 차이점
