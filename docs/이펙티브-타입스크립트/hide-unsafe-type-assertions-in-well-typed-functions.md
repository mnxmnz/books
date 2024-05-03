---
sidebar_position: 40
---

# 아이템 40 함수 안으로 타입 단언문 감추기

함수의 모든 부분을 안전한 타입으로 구현하는 것이 이상적이지만, 불필요한 예외 상황까지 고려해 가며 타입 정보를 힘들게 구성할 필요는 없다. 함수 내부에는 타입 단언을 사용하고 함수 외부로 드러나는 타입 정의를 정확히 명시하는 정도로 끝내는 게 낫다. 프로젝트 전반에 위험한 타입 단언문이 드러나 있는 것보다, 제대로 타입이 정의된 함수 안으로 타입 단언문을 감추는 것이 더 좋은 설계이다.

어떤 함수든 캐싱할 수 있도록 래퍼 함수 cacheLast 를 만들면 다음과 같다.

```ts
declare function cacheLast<T extends Function>(fn: T): T;
```

```ts
function cacheLast<T extends Function>(fn: T): T {
  let lastArgs: any[] | null = null;
  let lastResult: any;

  return function (...args: any[]) {
    if (!lastArgs || !shallowEqual(lastArgs, args)) {
      lastResult = fn(...args);
      lastArgs = args;
    }

    return lastResult;
  } as unknown as T;
}
```

- 함수 내부에는 any 가 많이 보이지만 타입 정의에는 any 가 없기 때문에 cacheLast 를 호출하는 쪽에서는 any 가 사용됐는지 알지 못한다.

```ts
function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
  for (const [k, aVal] of Object.entries(a)) {
    if (!(k in b) || aVal !== (b as any)[k]) {
      return false;
    }
  }

  return Object.keys(a).length === Object.keys(b).length;
}
```

- b as any 타입 단언문은 안전하며(k in b 체크를 했으므로), 결국 정확한 타입으로 정의되고 제대로 구현된 함수가 된다. 객체가 같은지 체크하기 위해 객체 순회와 단언문이 코드에 직접 들어가는 것보다 앞의 코드처럼 별도의 함수로 분리해 내는 것이 훨씬 좋은 설계이다.

## 요약

- 타입 선언문은 일반적으로 타입을 위험하게 만들지만 상황에 따라 필요하기도 하고 현실적인 해결책이 되기도 한다. 불가피하게 사용해야 한다면 정확한 정의를 가지는 함수 안으로 숨기도록 하자.
