---
sidebar_position: 16
---

# 아이템 16 number 인덱스 시그니처보다는 Array, 튜플, ArrayLike 를 사용하기

인덱스 시그니처가 `number` 로 표현되어 있다면 입력한 값이 `number` 여야 한다는 것을 의미하지만, 실제 런타임에 사용되는 키는 `string` 타입이다. 일반적으로 `string` 대신 `number` 를 타입의 인덱스 시그니처로 사용할 이유는 많지 않다. 숫자를 사용하여 인덱스할 항목을 지정한다면 `Array` 또는 튜플 타입을 대신 사용하게 될 것이다. `number` 를 인덱스 타입으로 사용하면 숫자 속성이 어떤 특별한 의미를 지닌다는 오해를 불러 일으킬 수 있다.

`Array` 타입이 사용하지도 않을 `push` 나 `concat` 같은 다른 속성을 가지는 게 납득하기 어려울 수 있다. 납득하기 어렵다는 것은 구조적인 고려를 하고 있다는 뜻이기 때문에 타입스크립트를 잘 이해하고 있는 것이다.

어떤 길이를 가지는 배열과 비슷한 형태의 튜플을 사용하고 싶다면 타입스크립트에 있는 `ArrayLike` 타입을 사용한다.

```ts
const xs = [1, 2, 3];

function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
  if (i < xs.length) {
    return xs[i];
  }

  throw new Error(`Attempt to access ${i} which is past end of array.`);
}
```

길이와 숫자 인덱스 시그니처만 있는 경우는 드물지만 필요하면 `ArrayLike` 를 사용해야 한다.

```ts
const tupleLike: ArrayLike<string> = {
  '0': 'A',
  '1': 'B',
  length: 2,
}; // OK
```

## 요약

- 인덱스 시그니처로 사용하는 `number` 타입은 버그를 잡기 위한 순수 타입스크립트 코드이다.
- 인덱스 시그니처에 `number` 를 사용하기보다 `Array` , 튜플, `ArrayLike` 타입을 사용하는 것이 좋다.
