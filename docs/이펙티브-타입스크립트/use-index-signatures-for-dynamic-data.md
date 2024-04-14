---
sidebar_position: 15
---

# 아이템 15 동적 데이터에 인덱스 시그니처 사용하기

타입에 ‘인덱스 시그니처’를 명시하여 유연하게 매핑을 표현할 수 있다.

```ts
type Rocket = { [property: string]: string };

const rocket: Rocket = {
  name: 'Falcon 9',
  variant: 'v1.0',
  thrust: '4,940 kN',
}; // OK
```

`[property: string]: string` 이 인덱스 시그니처이며, 다음 세 가지 의미를 담고 있다.

- **키의 이름**: 키의 위치만 표시하는 용도이다. 타입 체커에서는 사용하지 않는다.
- **키의 타입**: `string` 이나 `number` 또는 `symbol` 의 조합이어야 하지만, 보통은 `string` 을 사용한다.
- **값의 타입**: 어떤 것이든 될 수 있다.

이렇게 타입 체크를 수행하면 네 가지 단점이 드러난다.

- 잘못된 키를 포함해 모든 키를 허용한다. `name` 대신 `Name` 으로 작성해도 유효한 `Rocket` 타입이 된다.
- 특정 키가 필요하지 않다. `{ }` 도 유효한 `Rocket` 타입이다.
- 키마다 다른 타입을 가질 수 없다. `thrust` 는 `string` 이 아니라 `number` 여야 할 수 있다.
- `name:` 을 입력할 때, 키는 무엇이든 가능하기 때문에 자동 완성 기능이 동작하지 않는다.

인덱스 시그니처는 부정확하므로 더 나은 방법을 적용해야 한다.

```ts
interface Rocket {
  name: string;
  variant: string;
  thrust_kN: number;
}

const falconHeavy: Rocket = {
  name: 'Falcon Heavy',
  variant: 'v1',
  thrust_kN: 15_200,
};
```

## 요약

- 런타임 때까지 객체의 속성을 알 수 없을 때만 인덱스 시그니처를 사용한다.
- 안전한 접근을 위해 인덱스 시그니처의 값 타입에 `undefined` 를 추가하는 것을 고려해야 한다.
