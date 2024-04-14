---
sidebar_position: 18
---

# 아이템 18 매핑된 타입을 사용하여 값을 동기화하기

```ts
interface ScatterProps {
  xs: number[];
  ys: number[];
  xRange: [number, number];
  yRange: [number, number];
  color: string;
  onClick: (x: number, y: number, index: number) => void;
}

const REQUIRES_UPDATE: { [k in keyof ScatterProps]: boolean } = {
  xs: true,
  ys: true,
  xRange: true,
  yRange: true,
  color: true,
  onClick: false,
};

function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
  let k: keyof ScatterProps;

  for (k in oldProps) {
    if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
      return true;
    }
  }

  return false;
}
```

매핑된 타입은 한 객체가 또 다른 객체와 정확히 같은 속성을 가지게 할 때 이상적이다. 이번 예제처럼 매핑된 타입을 사용해 타입스크립트가 코드에 제약을 강제하도록 할 수 있다.

## 요약

- 매핑된 타입을 사용해서 관련된 값과 타입을 동기화하자. (개발자가 할 일이다. 개발자에게 강제하는 것이다.)
- 인터페이스에 새로운 속성을 추가할 때 선택을 강제하도록 매핑된 타입을 고려해야 한다.
