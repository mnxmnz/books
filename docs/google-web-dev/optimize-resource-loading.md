---
sidebar_position: 4
---

# 4장 리소스 로드 최적화

## 1. 렌더 블로킹

> **렌더 블로킹**: CSS 가 브라우저가 콘텐츠를 렌더링하는 것을 차단하는 현상

CSS 는 CSS Object Model(CSSOM)이 구성될 때까지 브라우저가 콘텐츠를 렌더링하는 것을 차단한다. 이는 Flash of Unstyled Content(FOUC)를 방지하기 위함이다.

```html
<!-- 렌더 블로킹 CSS -->
<link rel="stylesheet" href="styles.css" />
```

- FOUC 는 스타일이 적용되기 전에 스타일이 없는 페이지가 잠깐 보이는 현상한다.
- 렌더 블로킹 자체는 나쁘지 않지만 최소화하는 것이 중요하다.

## 2. 파서 블로킹

> **파서 블로킹**: HTML 파서를 중단시키는 리소스

`async` 또는 `defer` 속성이 없는 `<script>` 요소는 HTML 파서를 중단시킨다.

```html
<!-- 파서 블로킹 스크립트 -->
<script src="/script.js"></script>
```

- 브라우저는 스크립트를 발견하면 HTML 파싱을 중단하고 스크립트를 다운로드하고 파싱하고 실행한 후 나머지 HTML 파싱을 계속한다.
- 인라인 스크립트도 마찬가지로 파서를 차단한다.

## 3. 프리로드 스캐너

> **프리로드 스캐너**: 브라우저 최적화로 원시 HTML 응답을 스캔하여 리소스를 사전에 가져오는 보조 HTML 파서

프리로드 스캐너가 발견할 수 없는 리소스 로딩 패턴은 다음과 같다.

- CSS 의 `background-image` 속성으로 로드한 이미지
- JavaScript 로 동적으로 주입한 `<script>` 요소
- JavaScript 로 클라이언트에서 렌더링한 HTML
- CSS `@import` 선언

이러한 패턴은 늦게 발견되는 리소스로 프리로드 스캐너의 이점을 받지 못한다.

## 4. CSS 최적화

### 4-1. CSS 미니피케이션

CSS 파일의 크기를 줄여 다운로드 시간을 단축한다.

```css
/* 미니피케이션 전 */
h1 {
  font-size: 2em;
  color: #000000;
}

h2 {
  font-size: 1.5em;
  color: #000000;
}
```

```css
/* 미니피케이션 후 */
h1,
h2 {
  color: #000;
}
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
```

### 4-2. 사용하지 않는 CSS 제거

Chrome DevTools 의 Coverage 도구를 사용하여 현재 페이지에서 사용하지 않는 CSS 를 확인할 수 있다.

- 다운로드 시간 단축
- 렌더 트리 구성 최적화

### 4-3. 크리티컬 CSS

> **크리티컬 CSS**: 페이지의 첫 번째 뷰포트에 표시하는 콘텐츠에 필요한 최소한의 CSS

```html
<!-- 크리티컬 CSS를 인라인으로 포함 -->
<style>
  /* 첫 번째 뷰포트에 필요한 스타일만 */
  body {
    font-family: Arial, sans-serif;
  }
  .header {
    background: #333;
    color: white;
  }
</style>
<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
```

**주의사항**

- 크리티컬 CSS 추출과 유지보수가 어려울 수 있다.
- 인라인 CSS 는 HTML 응답 크기를 증가시킨다.
- HTML 은 오래 캐시되지 않으므로 인라인 CSS 도 캐시되지 않는다.

## 5. JavaScript 최적화

### 5-1. 렌더 블로킹 JavaScript

`defer` 또는 `async` 속성이 없는 스크립트는 파싱과 렌더링을 차단한다.

```html
<!-- 렌더 블로킹 스크립트 -->
<script src="app.js"></script>
```

### 5-2. async vs defer

| 속성    | 실행 시점          | 실행 순서      |
| ------- | ------------------ | -------------- |
| `async` | 다운로드 완료 즉시 | 순서 보장 안됨 |
| `defer` | HTML 파싱 완료 후  | 순서 보장됨    |

```html
<!-- async: 다운로드 완료 즉시 실행 -->
<script async src="analytics.js"></script>

<!-- defer: HTML 파싱 완료 후 실행 -->
<script defer src="app.js"></script>

<!-- type="module"은 자동으로 defer됨 -->
<script type="module" src="app.js"></script>
```

### 5-3. 클라이언트 사이드 렌더링 피하기

JavaScript 로 중요한 콘텐츠나 LCP 요소를 렌더링하는 것을 피해야 한다.

```javascript
// 피해야 할 패턴
document.body.innerHTML = '<img src="hero.jpg" alt="Hero">';
```

**문제점**

- 프리로드 스캐너가 리소스를 발견할 수 없다.
- LCP 이미지 다운로드가 지연된다.
- 긴 작업을 생성할 수 있다.

### 5-4. JavaScript 미니피케이션

JavaScript 미니피케이션은 공백 제거뿐만 아니라 심볼 축약도 포함한다.

```javascript
// 미니피케이션 전
export function injectScript() {
  const scriptElement = document.createElement('script');
  scriptElement.src = '/js/scripts.js';
  scriptElement.type = 'module';
  document.body.appendChild(scriptElement);
}
```

```javascript
// 미니피케이션 후
export function injectScript() {
  const t = document.createElement('script');
  (t.src = '/js/scripts.js'), (t.type = 'module'), document.body.appendChild(t);
}
```

## 6. 리소스 로딩 패턴 비교

| 패턴                        | 프리로드 스캐너 | 권장도 |
| --------------------------- | --------------- | ------ |
| HTML의 `<img>` 태그         | ✅              | ✅     |
| CSS `background-image`      | ❌              | ❌     |
| 동적 `<script>` 주입        | ❌              | ❌     |
| JavaScript 로 렌더링한 HTML | ❌              | ❌     |
| CSS `@import`               | ❌              | ❌     |
