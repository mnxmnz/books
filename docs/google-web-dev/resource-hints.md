---
sidebar_position: 5
---

# 5장 리소스 힌트로 브라우저 지원

리소스 힌트는 개발자가 브라우저에게 리소스를 어떻게 로드하고 우선순위를 정할지 알려줌으로써 페이지 로드 시간을 더욱 최적화할 수 있게 한다. 리소스 힌트는 브라우저가 일반적으로 발견하기 전에 DNS 조회, 서버 연결, 리소스 가져오기 등의 작업을 미리 수행하도록 지시한다.

## 1. preconnect

### 1-1. 기본 개념

`preconnect` 힌트는 다른 오리진에서 중요한 리소스를 가져올 때 연결을 설정하는 데 사용한다.

```html
<link rel="preconnect" href="https://example.com" />
```

### 1-2. 동작 방식

- 브라우저가 특정 크로스 오리진 서버에 곧 연결할 계획임을 예상한다.
- 브라우저가 HTML 파서나 프리로드 스캐너가 하기 전에 가능한 한 빨리 연결을 열도록 지시한다.
- 페이지에 많은 크로스 오리진 리소스가 있는 경우 현재 페이지에 가장 중요한 리소스에만 `preconnect` 를 사용한다.

### 1-3. Google Fonts 예시

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

- `crossorigin` 속성을 생략하면 브라우저가 폰트 파일을 다운로드할 때 새로운 연결을 열고 `preconnect` 힌트로 열린 연결을 재사용하지 않는다.

## 2. dns-prefetch

### 2-1. 기본 개념

`dns-prefetch` 는 크로스 오리진 서버에 대한 DNS 조회만 미리 수행한다.

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
```

### 2-2. 특징

- 연결을 설정하지 않고 DNS 조회만 수행한다.
- DNS 조회는 상대적으로 비용이 적다.
- `preconnect` 보다 비용이 덜 드는 대안이다.
- 사용자가 따라갈 가능성이 높은 다른 웹사이트 링크에 적합하다.

## 3. preload

### 3-1. 기본 개념

`preload` 지시어는 페이지 렌더링에 필요한 리소스에 대한 초기 요청을 시작하는 데 사용한다.

```html
<link rel="preload" href="/lcp-image.jpg" as="image" />
```

### 3-2. 사용 사례

- 폰트 파일
- `@import` 선언을 통해 가져온 CSS 파일
- LCP(Largest Contentful Paint) 후보가 될 가능성이 높은 CSS `background-image` 리소스

### 3-3. 반응형 이미지 예시

```html
<link rel="preload" href="/hero-image.jpg" as="image" imagesrcset="hero-image-1x.jpg 1x, hero-image-2x.jpg 2x" />
```

- `as` 속성이 없으면 리소스를 두 번 다운로드한다.
- CORS 리소스의 경우 `crossorigin` 속성이 필요하다.
- 과도한 사용 시 대역폭 경합으로 인해 페이지 로드 속도에 부정적인 영향을 끼친다.

## 4. prefetch

### 4-1. 기본 개념

`prefetch` 지시어는 미래 네비게이션에 사용될 가능성이 높은 리소스에 대한 낮은 우선순위 요청을 시작한다.

```html
<link rel="prefetch" href="/next-page.css" as="style" />
```

### 4-2. 특징

- 미래 네비게이션이 발생할 수도 안 할 수도 있다.
- 사용자가 완료까지 따라가는 플로우가 식별된 경우에 유용하다.
- 사용하지 않는 데이터로 인한 잠재적 단점이 존재한다.

### 4-3. 데이터 사용량 고려

```html
<link rel="prefetch" href="/next-page.css" as="style" media="print" onload="this.media='all'" />
```

- `Save-Data` 힌트를 사용하여 데이터 사용량 감소를 선호하는 사용자에 대해 프리패치를 선택 해제할 수 있다.

## 5. Fetch Priority API

### 5-1. 기본 개념

`fetchpriority` 속성을 사용하여 리소스의 우선순위를 높일 수 있다.

```html
<div class="gallery">
  <div class="poster">
    <img src="img/poster-1.jpg" fetchpriority="high" />
  </div>
  <div class="thumbnails">
    <img src="img/thumbnail-2.jpg" fetchpriority="low" />
    <img src="img/thumbnail-3.jpg" fetchpriority="low" />
    <img src="img/thumbnail-4.jpg" fetchpriority="low" />
  </div>
</div>
```

### 5-2. 우선순위 값

- `high`: 높은 우선순위
- `low`: 낮은 우선순위
- `auto`: 기본값 (브라우저가 자동으로 결정)

### 5-3. LCP 이미지 최적화

- `fetchpriority` 속성은 페이지의 LCP 이미지에 효과적이다. LCP 이미지의 우선순위를 높이면 상대적으로 적은 노력으로 페이지의 LCP 를 개선할 수 있다.

## 6. 리소스 힌트 사용 가이드

### 6-1. 언제 사용할까?

- **preconnect**: 중요한 크로스 오리진 리소스가 많은 경우
- **dns-prefetch**: 비용을 줄이고 싶은 경우
- **preload**: 늦게 발견되는 중요한 리소스
- **prefetch**: 사용자 플로우가 명확한 경우
- **fetchpriority**: LCP 이미지나 중요한 리소스 우선순위 조정

### 6-2. 주의사항

- 과도한 사용은 오히려 성능에 부정적인 영향을 끼친다.
- 사용자 데이터 사용량을 고려해야 한다.
- 실제 사용 시 패턴 분석을 통해 신중하게 적용해야 한다.
