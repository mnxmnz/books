---
sidebar_position: 34
---

# 아이템 34 부정확한 타입보다는 미완성 타입을 사용하기

실수가 발생하기 쉽고 잘못된 타입은 차라리 타입이 없는 것보다 못할 수 있다.

타입은 구체적으로 만들수록 정밀도가 손상되는 것을 방지하는 데 도움이 된다.

```ts
type Expression1 = any;
type Expression2 = number | string | any[];
type Expression4 = number | string | CallExpression;

type CallExpression = MathCall | CaseCall | RGBCall;

interface MathCall {
  0: '+' | '-' | '/' | '*' | '>' | '<';
  1: Expression4;
  2: Expression4;
  length: 3;
}

interface CaseCall {
  0: 'case';
  1: Expression4;
  2: Expression4;
  3: Expression4;
  length: 4 | 6 | 8 | 10 | 12 | 14 | 16;
}

interface RGBCall {
  0: 'rgb';
  1: Expression4;
  2: Expression4;
  3: Expression4;
  length: 4;
}

const tests: Expression4[] = [
  10,
  'red',
  true,
  // 'boolean' 형식은 'Expression4' 형식에 할당할 수 없습니다.
  ['+', 10, 5],
  ['case', ['>', 20, 10], 'red', 'blue', 'green'],
  // '["case", [">", number, number], string, string, string]' 형식은 'Expression4' 형식에 할당할 수 없습니다.
  // '["case", [">", number, number], string, string, string]' 형식은 'CaseCall' 형식에 할당할 수 없습니다.
  // 'length' 속성의 형식이 호환되지 않습니다.
  // '5' 형식은 '4 | 6 | 8 | 10 | 12 | 14 | 16' 형식에 할당할 수 없습니다.
  ['**', 2, 31],
  // '"**"' 형식은 '"+" | "-" | "/" | "*" | ">" | "<"' 형식에 할당할 수 없습니다.
  ['rgb', 255, 128, 64],
  ['rgb', 255, 128, 64, 73],
  // '["rgb", number, number, number, number]' 형식은 'Expression4' 형식에 할당할 수 없습니다.
  // '["rgb", number, number, number, number]' 형식은 'RGBCall' 형식에 할당할 수 없습니다.
  // 'length' 속성의 형식이 호환되지 않습니다.
  // '5' 형식은 '4' 형식에 할당할 수 없습니다.
];

const okExpressions: Expression4[] = [
  ['-', 12],
  // '["-", number]' 형식은 'Expression4' 형식에 할당할 수 없습니다.
  // '2' 속성이 '["-", number]' 형식에 없지만 'MathCall' 형식에서 필수입니다.
  ['+', 1, 2, 3],
  // '["+", number, number, number]' 형식은 'Expression4' 형식에 할당할 수 없습니다.
  // '["+", number, number, number]' 형식은 'MathCall' 형식에 할당할 수 없습니다.
  // 'length' 속성의 형식이 호환되지 않습니다.
  // '4' 형식은 '3' 형식에 할당할 수 없습니다.
  ['*', 2, 3, 4],
  // '["*", number, number, number]' 형식은 'Expression4' 형식에 할당할 수 없습니다.
  // '["*", number, number, number]' 형식은 'MathCall' 형식에 할당할 수 없습니다.
  // 'length' 속성의 형식이 호환되지 않습니다.
  // '4' 형식은 '3' 형식에 할당할 수 없습니다.
];
```

- 위 코드는 오류에 대해 엉뚱한 메시지를 출력한다.
- 타입 정보가 더 정밀해졌지만 결과적으로 이전 버전보다 개선되었다고 보기는 어렵다. 잘못 사용한 코드에서 오류가 발생하기는 하지만 오류 메시지는 더 난해해졌다.
- 언어 서비스는 타입 체크 못지 않게 타입스크립트 경험에서 중요한 부분이므로 타입 선언으로 인한 오류 메시지를 살펴보고 타입 선언이 동작해야 하는 곳에는 자동 완성을 적용하는 것이 좋다. 새 타입 선언은 더 구체적이지만 자동 완성을 방해하므로 타입스크립트 개발 경험을 해치게 된다.

코드를 더 정밀하게 만들려던 시도가 너무 과했고 그로 인해 코드가 오히려 더 부정확해졌다. 이렇게 부정확함을 바로잡는 방법을 쓰는 대신, 테스트 세트를 추가하여 놓친 부분이 없는지 확인해도 된다. 일반적으로 복잡한 코드는 더 많은 테스트가 필요하고 타입의 관점에서도 마찬가지이다.

타입을 정제할 때, ‘불쾌한 골짜기’ 은유를 생각해보면 도움이 될 수 있다. 일반적으로 any 같은 매우 추상적인 타입은 정제하는 것이 좋다. 그러나 타입이 구체적으로 정제된다고 해서 정확도가 무조건 올라가지는 않는다. 타입에 의존하기 시작하면 부정확함으로 인해 발생하는 문제는 더 커질 것이다.

## 요약

- 타입 안전성에서 불쾌한 골짜기는 피해야 한다. 타입이 없는 것보다 잘못된 게 더 나쁘다.
- 타입을 정확하게 모델링할 수 없다면 부정확하게 모델링하지 말아야 한다. 또한 any 와 unknown 를 구별해서 사용해야 한다.

:::note

튜플은 유한하다.

```ts
type CallExpression = [FnName, …any[]];
```

위와 같은 형태는 무한할 거 같아 보이지만 실제로는 유한하다.

:::
