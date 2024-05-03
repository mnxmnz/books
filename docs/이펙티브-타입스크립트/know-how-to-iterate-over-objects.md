---
sidebar_position: 54
---

# 아이템 54 객체를 순회하는 노하우

```ts
const obj = {
  /* ... */
};

// const obj: {
//     one: string;
//     two: string;
//     three: string;
// }

for (const k in obj) {
  // const k: string
  // ...
}
```

- `k` 의 타입은 `string` 인 반면, `obj` 객체에는 `‘one’, ‘two’, ‘three’` 세 개의 키만 존재한다.
- `k` 와 `obj` 객체의 키 타입이 서로 다르게 추론되어 오류가 발생한 것이다.

```ts
let k: keyof typeof obj; // "one" | "two" | "three"

for (k in obj) {
  const v = obj[k];
}
```

- `k` 의 타입을 구체적으로 명시하여 오류를 해결할 수 있다.

```ts
interface ABC {
  a: string;
  b: string;
  c: number;
}

function foo(abc: ABC) {
  for (const [k, v] of Object.entries(abc)) {
    k; // string
    v; // any
  }
}
```

- `Object.entries` 를 사용해서 객체의 키와 값을 순회할 수 있다.

객체를 다룰 때에는 항상 ‘프로토타입 오염’의 가능성을 염두하자.

```
**> Object.prototype.z = 3;
> const obj = { x: 1, y: 2 };
> for (const k in obj) { console.log(k); }**
x
y
z
```

- `Object.prototype` 에 순회할 수 있는 속성을 절대로 추가하면 안 된다.
- `for-in` 루프에서 `k` 가 `string` 키를 가지게 된다면 프로토타입 오염의 가능성을 의심해 봐야 한다.
- 객체를 순회하며 키와 값을 얻으려면 (`let k: keyof T`) 같은 `keyof` 선언이나 `Object.entries` 를 사용하자.

## 요약

- 객체를 순회할 때 키가 어떤 타입인지 정확히 파악하고 있다면 `let k: keyof T` 와 `for-in` 루프를 사용하자. 함수의 매개변수로 쓰이는 객체에는 추가적인 키가 존재할 수 있다는 점을 명심하자.
- 객체를 순회하며 키와 값을 얻는 가장 일반적인 방법은 `Object.entries` 를 사용하는 것이다.
