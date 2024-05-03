---
sidebar_position: 37
---

# 아이템 37 공식 명칭에는 상표 붙이기

```ts
type SortedList<T> = T[] & { _brand: 'sorted' };

function isSorted<T>(xs: T[]): xs is SortedList<T> {
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] > xs[i - 1]) {
      return false;
    }
  }

  return true;
}

function binarySearch<T>(xs: SortedList<T>, x: T): boolean {
  return true;
}
```

- binarySearch 를 호출하려면 정렬되었다는 상표가 붙은 SortedList 타입의 값을 사용하거나 isSorted 를 호출하여 정렬되었음을 증명해야 한다. isSorted 에서 목록 전체를 루프 도는 것이 효율적인 방법은 아니지만 적어도 안전성은 확보할 수 있다.
- 앞의 예제는 타입 체커를 유용하게 사용하는 일반적인 패턴이다. 예를 들어 객체의 메서드를 호출하는 경우 null 이 아닌 객체를 받거나 조건문을 사용해서 해당 객체가 null 이 아닌지 체크하는 코드와 동일한 형태이다.

## 요약

- 타입스크립트는 구조적 타이핑을 사용하기 때문에 값을 세밀하게 구분하지 못하는 경우가 있다. 값을 구분하기 위해 공식 명칭이 필요하다면 상표를 붙이는 것을 고려해야 한다.
- 상표 기법은 타입 시스템에서 동작하지만 런타임에 상표를 검사하는 것과 동일한 효과를 얻을 수 있다.
