---
sidebar_position: 24
---

# 아이템 24 일관성 있는 별칭 사용하기

다각형을 표현하는 자료구조를 가정하면 다음과 같다. 다각형의 기하학적 구조는 `exterior` 와 `holes` 속성으로 정의된다. `bbox` 는 필수가 아닌 최적화 속성이다.

```ts
interface Coordinate {
  x: number;
  y: number;
}

interface BoundingBox {
  x: [number, number];
  y: [number, number];
}

interface Polygon {
  exterior: Coordinate[];
  holes: Coordinate[][];
  bbox?: BoundingBox;
}

function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  if (polygon.bbox) {
    if (pt.x < polygon.bbox.x[0] || pt.x > polygon.bbox.x[1] || pt.y < polygon.bbox.y[1] || pt.y > polygon.bbox.y[1]) {
      return false;
    }
  }

  // ...
}
```

- 임시 변수를 선언하여 중복을 줄이면 다음과 같다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const box = polygon.bbox;

  if (polygon.bbox) {
    if (
      pt.x < box.x[0] ||
      // ERROR: 'box'은(는) 'undefined'일 수 있습니다.
      pt.x > box.x[1] ||
      // ERROR: 'box'은(는) 'undefined'일 수 있습니다.
      pt.y < box.y[1] ||
      // ERROR: 'box'은(는) 'undefined'일 수 있습니다.
      pt.y > box.y[1]
      // ERROR: 'box'은(는) 'undefined'일 수 있습니다.
    ) {
      return false;
    }
  }

  // ...
}
```

속성 체크는 `polygon.bbox` 의 타입을 정제했지만, `box` 는 그렇지 않았기 때문에 오류가 발생했다. 이러한 오류는 속성 체크에 `box` 를 사용하도록 바꿔서 해결할 수 있다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const box = polygon.bbox;

  if (box) {
    if (pt.x < box.x[0] || pt.x > box.x[1] || pt.y < box.y[1] || pt.y > box.y[1]) {
      return false;
    }
  }

  // ...
}
```

객체 비구조화를 이용해서 일관된 이름을 사용할 수 있다.

```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const { bbox } = polygon;

  if (bbox) {
    const { x, y } = bbox;

    if (pt.x < x[0] || pt.x > x[1] || pt.y < x[0] || pt.y > y[1]) {
      return false;
    }
  }

  // ...
}
```

객체 비구조화를 사용할 땐 다음을 주의해야 한다.

- 전체 `bbox` 속성이 아니라 `x` 와 `y` 가 선택적 속성일 경우에 속성 체크가 더 필요하다. 따라서 타입의 경계에 `null` 값을 추가하는 것이 좋다.
- `bbox` 에는 선택적 속성이 적합했지만, `holes` 는 그렇지 않다. `holes` 가 선택적이라면 값이 없거나 빈 배열이었을 것이다. 차이가 없는데 이름을 구별한 것이다. 빈 배열은 “holes 없음”을 나타내는 좋은 방법이다.

```ts
function fn(p: Polygon) {
  /* ... */
}

polygon.bbox; // 타입: BoundingBox | undefined

if (polygon.bbox) {
  polygon.bbox; // 타입: BoundingBox
  fn(polygon);
  polygon.bbox; // 타입: BoundingBox
}
```

- `fn(polygon)` 호출은 `polygon.bbox` 를 제거할 가능성이 있으므로 타입을 `BoundingBox | undefined` 로 되돌리는 것이 안전할 것이다. 그러나 함수를 호출할 때마다 속성 체크를 반복해야 하므로 좋지 않다.
- 그래서 타입스크립트는 함수가 타입 정제를 무효로 하지 않는다고 가정한다. 그러나 실제로는 무효가 될 가능성이 있다. `polygon.bbox` 로 사용하는 대신 `bbox` 지역 변수로 사용하면 `bbox` 의 타입은 정확히 유지되지만, `polygon.bbox` 의 값과 같게 유지되지 않을 수 있다.

## 요약

- 별칭은 타입을 좁히는 것을 방해한다. 변수에 별칭을 사용할 때는 일관되게 사용하자.
- 비구조화 문법을 사용해서 일관된 이름을 사용하는 것이 좋다.
- 함수 호출이 객체 속성의 타입 정제를 무효화할 수 있다는 점을 주의해야 한다. 속성보다 지역 변수를 사용하면 타입 정제를 믿을 수 있다.
