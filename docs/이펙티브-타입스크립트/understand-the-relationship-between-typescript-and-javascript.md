---
sidebar_position: 1
---

# 아이템 1 타입스크립트와 자바스크립트의 관계 이해하기

타입스크립트는 자바스크립트의 상위 집합이다.

자바스크립트 프로그램에 어떤 이슈가 존재하면 문법 오류가 아니더라도 타입 체커에게 지적당할 가능성이 높다. 그러나 문법의 유효성과 동작의 이슈는 독립적인 문제로 타입스크립트는 여전히 작성된 코드를 파싱하고 자바스크립트로 변환할 수 있다.

모든 자바스크립트 프로그램이 타입스크립트라는 명제는 참이지만, 그 반대는 성립하지 않는다. 타입스크립트가 타입을 명시하는 추가적인 문법을 가지기 때문이다.

타입스크립트는 자바스크립트 런타임 동작을 모델링하는 타입 시스템을 가지고 있기 때문에 런타임 오류를 발생시키는 코드를 찾아내려고 한다. 그러나 모든 오류를 찾아내리라 기대하면 안 된다. 타입 체커를 통과하면서도 런타임 오류를 발생시키는 코드는 충분히 존재할 수 있다.

타입스크립트 타입 시스템은 전반적으로 자바스크립트 동작을 모델링한다.

:::note

책에 나와있는 예제만 보면 법칙이 모호해 보이지만 모든 자료형에 대해서 열거해보면 법칙은 명확하다.

```ts
const a = null + 7;
const b = [] + 12;
```

연산자가 문자열을 이어붙이는 경우(피연산자가 하나라도 String 타입)는 Symbol 을 제외하고 모두 가능하다. Symbol 을 붙일 수 없는 이유는 spec 상에 잘 정의되어 있다.

요약하자면 + 연산자의 피연산자가 하나라도 String 이면 ToString(피연산자) 을 수행하여 값을 가져오는데 피연산자가 Symbol 인 경우만 TypeError exception 을 throw 한다.

그 외에는 산술연산자로 동작하기 때문에 Numeric types(Number, BigInt) 만 가능하다.

- [ECMAScript® 2025 Language Specification](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-data-types-and-values)
- [ECMAScript® 2025 Language Specification](https://tc39.es/ecma262/#prod-AdditiveExpression)
- [ECMAScript® 2025 Language Specification](https://tc39.es/ecma262/#sec-applystringornumericbinaryoperator)
- [ECMAScript® 2025 Language Specification](https://tc39.es/ecma262/#sec-tostring)

:::
