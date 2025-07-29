---
sidebar_position: 6
---

# 6장 이미지 성능

## 1. 이미지 성능 개요

> **이미지 최적화**: 웹사이트에서 가장 무겁고 흔한 리소스인 이미지를 최적화하여 성능을 향상시키는 방법

이미지는 웹에서 가장 무겁고 흔한 리소스이므로 이미지를 최적화하면 웹사이트 성능을 크게 향상할 수 있다.

### 1-1. 이미지 추가 방법

```html
<!-- HTML img 요소 사용 -->
<img src="image.jpg" alt="설명" />

<!-- picture 요소 사용 -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="설명" />
</picture>

<!-- CSS background-image 사용 -->
<div style="background-image: url('image.jpg')"></div>
```

### 1-2. SVG 이미지 사용

```html
<!-- SVG 인라인 삽입 -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
```

- SVG는 벡터 이미지 형식으로 선화, 다이어그램, 차트 등에 유용하다.
- SVG는 텍스트 기반이므로 압축과 최소화 기법을 적용할 수 있다.

## 2. 이미지 크기 최적화

### 2-1. 올바른 크기 선택

> **이미지 크기**: 이미지의 차원을 의미하며 표시하는 컨테이너 크기에 맞춰야 한다.

```html
<!-- 500x500 컨테이너에 표시하는 이미지 -->
<img src="image-500.jpg" width="500" height="500" alt="이미지" />
```

- 500x500 컨테이너에는 500x500 이미지가 최적이다.
- 1000x1000 이미지를 사용하면 필요 이상으로 큰 크기이다.

### 2-2. 디바이스 픽셀 비율 (DPR)

| 디바이스            | DPR | 최적 이미지 크기 |
| ------------------- | --- | ---------------- |
| iPhone 3            | 1   | 500x500          |
| iPhone 4+           | 2   | 1000x1000        |
| 고해상도 디스플레이 | 3   | 1500x1500        |

- DPR이 2 인 디바이스에서 500px 인 컨테이너는 1000px 이미지가 필요하다.
- DPR이 3 인 디바이스에서 500px 인 컨테이너는 1500px 이미지가 필요하다.
- 대부분의 경우 DPR 3 이상은 인간의 눈으로 차이를 구분하기 어렵다.

## 3. 반응형 이미지

### 3-1. srcset 속성

```html
<img
  alt="이미지"
  width="500"
  height="500"
  src="/image-500.jpg"
  srcset="/image-500.jpg 1x, /image-1000.jpg 2x, /image-1500.jpg 3x"
/>
```

### 3-2. sizes 속성

```html
<img
  alt="이미지"
  width="500"
  height="500"
  src="/image-500.jpg"
  srcset="/image-500.jpg 500w, /image-1000.jpg 1000w, /image-1500.jpg 1500w"
  sizes="(min-width: 768px) 500px, 100vw"
/>
```

### 3-3. picture 요소

```html
<picture>
  <source media="(min-width: 768px)" srcset="/image-500.jpg 1x, /image-1000.jpg 2x" />
  <source media="(max-width: 767px)" srcset="/image-300.jpg 1x, /image-600.jpg 2x" />
  <img alt="이미지" width="500" height="500" src="/image-500.jpg" />
</picture>
```

## 4. 이미지 형식 최적화

### 4-1. Accept 헤더 기반 서빙

```javascript
if (request.headers.accept) {
  if (request.headers.accept.includes('image/avif')) {
    return reply.from('image.avif');
  } else if (request.headers.accept.includes('image/webp')) {
    return reply.from('image.webp');
  }
}

return reply.from('image.jpg');
```

- 브라우저가 지원하는 이미지 형식에 따라 최적의 형식을 제공한다.
- AVIF → WebP → JPEG 순서로 우선 순위를 갖고 있다.
- `Vary` 응답 헤더 설정이 필요하다.

### 4-2. 이미지 형식 비교

| 형식 | 압축 방식   | 용도                     |
| ---- | ----------- | ------------------------ |
| JPEG | 손실 압축   | 사진, 복잡한 이미지      |
| PNG  | 무손실 압축 | 투명도가 필요한 이미지   |
| WebP | 손실/무손실 | 현대적 웹 이미지         |
| AVIF | 손실/무손실 | 최신 고효율 형식         |
| SVG  | 벡터        | 아이콘, 로고, 다이어그램 |

## 5. 지연 로딩 (Lazy Loading)

```html
<img src="image.jpg" alt="이미지" loading="lazy" />
```

- `loading="lazy"`: 뷰포트에 들어올 때까지 이미지 로딩을 지연시킨다.
- 대역폭을 절약하고 초기 로딩 성능을 향상할 수 있다.
- 뷰포트에 가까워질 때 이미지 다운로드를 시작한다.

## 6. 디코딩 최적화

```html
<img src="large-image.jpg" alt="큰 이미지" decoding="async" />
```

| 값      | 의미          | 사용 시기                       |
| ------- | ------------- | ------------------------------- |
| `async` | 비동기 디코딩 | 큰 이미지, 다른 콘텐츠 우선순위 |
| `sync`  | 동기 디코딩   | 이미지와 다른 콘텐츠 동시 표시  |
| `auto`  | 브라우저 결정 | 기본값                          |

- 매우 큰 고해상도 이미지에서만 효과가 두드러진다.
- JavaScript 에서 `decode()` 메서드로 프로그래밍 방식을 제어할 수 있다.

## 7. 복잡성 관리

### 7-1. 이미지 변형 수 고려사항

| 변형 수 | 장점             | 단점                             |
| ------- | ---------------- | -------------------------------- |
| 적음    | 캐시 효율성 높음 | 최적화 부족                      |
| 많음    | 최적화 높음      | 캐시 효율성 저하, HTML 크기 증가 |

### 7-2. 균형점 찾기

- 이미지 크기와 사용자 디바이스에 따라 변형 수를 결정한다.
- 히어로 이미지는 많은 변형이 필요하다.
- 썸네일 이미지는 적은 변형으로 충분하다.
- 성능 측정을 통해 최적화를 검증해야 한다.

## 8. 이미지 CDN 활용

- 이미지 CDN 은 자동 최적화를 제공한다.
- 사용자 디바이스와 브라우저에 최적의 형식을 자동으로 선택한다.
- 서버의 비용을 절약할 수 있고 성능을 향상할 수 있다.
- Cloudinary, ImageKit, Cloudflare Images 등을 활용할 수 있다.
