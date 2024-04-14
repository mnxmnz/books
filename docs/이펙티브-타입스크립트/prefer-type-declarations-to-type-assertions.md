---
sidebar_position: 9
---

# 아이템 9 타입 단언보다는 타입 선언을 사용하기

타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사한다. 타입 단언은 강제로 타입을 지정했으니 타입 체커에게 오류를 무시하라고 하는 것이다.

타입 선언문에서는 잉여 속성 체크가 동작했지만, 단언문에서는 적용되지 않는다.

화살표 함수의 타입 선언은 추론된 타입이 모호할 때가 있다.

```ts
interface Person {
  name: string;
}

const people = ['alice', 'bob', 'jan'].map(name => ({ name })); // { name: string; }[]...
```

`{ name }` 에 타입 단언을 사용하면 문제가 해결된 것처럼 보일 수 있다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => ({ name } as Person)); // Person[]
```

그러나 타입 단언을 사용하면 런타임에 문제가 발생한다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => ({} as Person));
```

단언문을 사용하지 않고, 다음과 같이 화살표 함수 안에서 타입과 함께 변수를 선언하는 것이 가장 직관적이다.

```ts
const people = ['alice', 'bob', 'jan'].map(name => {
  const person: Person = { name };
  return person;
}); // Person[]
```

화살표 함수의 반환 타입을 선언하여 코드를 간결하게 작성할 수 있다.

```ts
const people = ['alice', 'bob', 'jan'].map((name): Person => ({ name })); // Person[]
```

다음과 같이 작성해서 원하는 타입을 직접 명시하고 타입스크립트가 할당문의 유효성을 검사하게 할 수 있다.

```ts
const people: Person[] = ['alice', 'bob', 'jan'].map((name): Person => ({ name }));
```

타입 단언이 필요한 경우는 다음과 같다. 타입 단언은 타입 체커가 추론한 타입보다 직접 판단한 타입이 더 정확할 때 의미있다.

```ts
document.querySelector('#myButton').addEventListener('click', e => {
  e.currentTarget; // EventTarget
  const button = e.currentTarget as HTMLButtonElement;
  button; // HTMLButtonElement
});
```

`!` 을 사용해서 null 이 아님을 단언할 수 있다.

```ts
const elNull = document.getElementById('foo'); // HTMLElement | null
const el = document.getElementById('foo')!; // HTMLElement
```

접미사로 사용하는 `!` 는 그 값이 `null` 이 아니라는 단언문으로 해석된다. `null` 이 아니라고 확신할 수 있는 경우가 아니라면 `null` 인 경우를 체크하는 조건문을 사용하는 것이 좋다.

타입 단언문으로 임의의 타입 간에 변환을 할 수는 없다. 서로의 서브타입이 아니면 변환할 수 없다.

모든 타입은 `unknown` 의 서브타입이기 때문에 `unknown` 이 포함된 단언문은 항상 동작한다.

:::note

💡 `!` 보다는 `?` 를 활용하자

:::

## 요약

- 타입 단언(`as Type`)보다 타입 선언(`: Type`)을 사용해야 한다.
- 화살표 함수의 반환 타입을 명시하는 방법을 터득해야 한다.
- 타입스크립트보다 타입 정보를 더 잘 알고 있는 상황에서는 타입 단언문과 `null` 아님 단언문을 사용하면 된다.
