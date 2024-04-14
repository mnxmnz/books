---
sidebar_position: 13
---

# 아이템 13 타입과 인터페이스의 차이점 알기

인터페이스는 유니온 타입과 같은 복잡한 타입을 확장하지 못한다. 복잡한 타입을 확장하고 싶으면 타입과 `&` 를 사용해야 한다.

유니온 타입을 확장하는 게 필요할 땐 다음과 같이 할 수 있다.

```ts
type Input = {
  /* ... */
};
type Output = {
  /* ... */
};
interface VariableMap {
  [name: string]: Input | Output;
}
```

유니온 타입에 `name` 속성을 붙인 타입을 만들 수 있다.

```ts
type NamedVariable = (Input | Output) & { name: string };
```

이러한 타입은 인터페이스로 표현할 수 없다.

튜플과 배열 타입도 type 키워드를 이용해 더 간결하게 표현할 수 있다.

```ts
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];
```

인터페이스로 튜플과 비슷하게 구현하면 튜플에서 사용할 수 있는 `concat` 같은 메서드를 사용할 수 없다.

인터페이스는 보강(augment)이 가능하다.

```ts
interface IState {
  name: string;
  capital: string;
}
interface IState {
  population: number;
}
const wyoming: IState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population: 500_000,
}; // OK
```

이렇게 속성을 확장하는 것을 ‘선언 병합’이라고 한다. 선언 병합은 주로 타입 선언 파일에서 사용한다.

`Array` 인터페이스는 `lib.es5.d.ts` 에 정의되어 있다. 기본적으로는 `lib.es5.d.ts` 에 선언한 인터페이스를 사용한다. 그러나 `tsconfig.json` 의 `lib` 목록에 ES2015 를 추가하면 타입스크립트는 `lib.es2015.d.ts` 에 선언한 인터페이스를 병합한다. 여기에는 ES2015 에 추가한 또 다른 `Array` 선언의 `find` 같은 메서드가 포함된다. 병합을 통해 다른 `Array` 인터페이스에 추가된다. 각 선언이 병합되어 전체 메서드를 가지는 하나의 `Array` 타입을 얻게 된다.

## 요약

- 프로젝트에서 어떤 문법을 사용할지 결정할 때 한 가지 일관된 스타일을 확립하고, 보강 기법이 필요한지 고려해야 한다.
