---
sidebar_position: 29
---

# 아이템 29 사용할 때는 너그럽게, 생성할 때는 엄격하게

```ts
interface CameraOptions {
  center?: LngLat;
  zoom?: number;
  bearing?: number;
  pitch?: number;
}

type LngLat = { lng: number; lat: number } | { lon: number; lat: number } | [number, number];

type LngLatBounds = { northeast: LngLat; southwest: LngLat } | [LngLat, LngLat] | [number, number, number, number];

declare function setCamera(camera: CameraOptions): void;

declare function viewportForBounds(bounds: LngLatBounds): CameraOptions;

type Feature = any;

declare function calculateBoundingBox(f: Feature): [number, number, number, number];

function focusOnFeature(f: Feature) {
  const bounds = calculateBoundingBox(f);
  const camera = viewportForBounds(bounds);

  setCamera(camera);

  const {
    center: { lat, lng },
    zoom,
  } = camera;

  zoom;
  window.location.search = `?v=@${lat},${lng}z${zoom}`;
}
```

## 요약

- 보통 매개변수 타입은 반환 타입에 비해 범위가 넓은 경향이 있다. 선택적 속성과 유니온 타입은 반환 타입보다 매개변수 타입에 더 일반적이다.
- 매개변수와 반환 타입의 재사용을 위해서 기본 형태(반환 타입)와 느슨한 형태(매개변수 타입)를 도입하는 것이 좋다.
