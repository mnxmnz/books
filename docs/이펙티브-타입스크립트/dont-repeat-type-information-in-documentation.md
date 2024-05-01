---
sidebar_position: 30
---

# 아이템 30 문서에 타입 정보를 쓰지 않기

```ts
type Color = { r: number; g: number; b: number };

function getForegroundColor(page?: string): Color {
  return page === 'login' ? { r: 127, g: 127, b: 127 } : { r: 0, g: 0, b: 0 };
}
```

```ts
function sort(nums: readonly number[]) {
  /* ... */
}
```

## 요약

- 주석과 변수명에 타입 정보를 적는 것은 피해야 한다. 타입 선언이 중복되는 것으로 끝나면 다행이지만 최악의 경우는 타입 정보에 모순이 발생하게 된다.
- 타입이 명확하지 않은 경우는 변수명에 단위 정보를 포함하는 것을 고려하는 것이 좋다.
