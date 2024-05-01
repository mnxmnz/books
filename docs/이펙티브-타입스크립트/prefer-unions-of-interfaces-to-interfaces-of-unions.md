---
sidebar_position: 32
---

# 아이템 32 유니온의 인터페이스보다는 인터페이스의 유니온을 사용하기

```ts
type FillPaint = unknown;
type LinePaint = unknown;
type PointPaint = unknown;
type FillLayout = unknown;
type LineLayout = unknown;
type PointLayout = unknown;

interface Layer {
  type: 'fill' | 'line' | 'point';
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```

```ts
type FillPaint = unknown;
type LinePaint = unknown;
type PointPaint = unknown;
type FillLayout = unknown;
type LineLayout = unknown;
type PointLayout = unknown;

interface FillLayer {
  type: 'fill';
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  type: 'line';
  layout: LineLayout;
  paint: LinePaint;
}

interface PointLayer {
  type: 'paint';
  layout: PointLayout;
  paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;

function drawLayer(layer: Layer) {
  if (layer.type === 'fill') {
    const { paint } = layer;
    const { layout } = layer;
  } else if (layer.type === 'line') {
    const { paint } = layer;
    const { layout } = layer;
  } else {
    const { paint } = layer;
    const { layout } = layer;
  }
}
```

```ts
interface Name {
  name: string;
}

interface PersonWithBirth extends Name {
  placeOfBirth: string;
  dateOfBirth: Date;
}

type Person = Name | PersonWithBirth;

function eulogize(p: Person) {
  if ('placeOfBirth' in p) {
    p;
    const { dateOfBirth } = p;
  }
}
```

## 요약

- 유니온 타입의 속성을 여러 개 가지는 인터페이스에서는 속성 간의 관계가 분명하지 않기 때문에 실수가 자주 발생하므로 주의해야 한다.
- 유니온의 인터페이스보다 인터페이스의 유니온이 더 정확하고 타입스크립트가 이해하기도 좋다.
- 타입스크립트가 제어 흐름을 분석할 수 있도록 타입에 태그를 넣는 것을 고려해야 한다. 태그된 유니온은 타입스크립트와 매우 잘 맞기 때문에 자주 볼 수 있는 패턴이다.
