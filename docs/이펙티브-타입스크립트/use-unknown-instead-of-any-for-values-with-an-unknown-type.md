---
sidebar_position: 42
---

# 아이템 42 모르는 타입의 값에는 any 대신 unknown 을 사용하기

```ts
function parseYAML(yaml: string): any {
  // ...
}

interface Foo {
  foo: string;
}

interface Bar {
  bar: string;
}

declare const foo: Foo;

let barAny = foo as any as Bar;
let barUnk = foo as unknown as Bar;
```

## 요약

- unknown 은 any 대신 사용할 수 있는 안전한 타입이다. 어떠한 값이 있지만 그 타입을 알지 못하는 경우라면 unknown 을 사용하면 된다.
- 사용자가 타입 단언문이나 타입 체크를 사용하도록 강제하려면 unknown 을 사용하면 된다.
- `{}`, object, unknown 의 차이점을 이해해야 한다.
