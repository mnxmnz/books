---
sidebar_position: 7
---

# 7장 동영상 성능

## 1. 동영상 소스 파일

> **컨테이너**: 운영체제에서 인식하는 파일 형식 (`.mp4`, `.webm` 등)
> **스트림**: 컨테이너 안에 포함된 비디오/오디오 데이터
> **코덱**: 각 스트림을 압축하는 방식

동영상 파일은 컨테이너와 코덱으로 구성된다.

- `video.webm` 은 WebM 컨테이너에 VP9 로 압축된 비디오 스트림과 Vorbis 로 압축된 오디오 스트림을 포함할 수 있다.

### 1-1. FFmpeg를 사용한 압축

```bash
# 기본 압축
ffmpeg -i input.mov output.webm

# 오디오 제거 (GIF 대체용)
ffmpeg -i input.mov -an output.webm
```

- `-an` 플래그는 모든 오디오 스트림을 제거한다.
- GIF 대체용 동영상에는 오디오가 필요 없으므로 파일 크기를 줄일 수 있다.

### 1-2. CRF (Constant Rate Factor)

```bash
# H.264/VP9 코덱에서 압축 수준 조정
ffmpeg -i input.mov -crf 23 output.webm
```

- `-crf` 는 압축 수준을 조정하는 설정이다.
- 정수 범위 내에서 값을 받아 압축률을 조정한다.

## 2. 다중 형식 지원

```html
<video>
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
</video>
```

- 브라우저가 지원하지 않는 형식을 위한 폴백을 제공한다.
- 모든 최신 브라우저가 H.264 코덱을 지원하므로 MP4 를 폴백으로 사용한다.
- `<source>` 순서가 우선순위를 결정한다.

## 3. poster 속성

```html
<video poster="poster.jpg">
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
</video>
```

- 재생 전 사용자에게 동영상 내용을 미리 보여주는 이미지이다.
- LCP 후보로 고려되므로 최적화가 중요하다.

## 4. 자동 재생

```html
<!-- 자동 재생, 루프, 음소거 -->
<video autoplay muted loop playsinline>
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
</video>
```

### 4-1. 자동 재생 주의사항

- `autoplay` 속성이 있으면 뷰포트 밖에 있어도 즉시 다운로드를 시작한다.
- 오디오가 포함된 자동 재생은 사용자에게 불쾌감을 줄 수 있다.
- 브라우저마다 자동 재생 정책이 다르다.

### 4-2. Intersection Observer API 활용

```javascript
// 뷰포트에 들어왔을 때만 동영상 다운로드
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 동영상 로드 시작
    }
  });
});
```

## 5. 사용자 시작 재생

### 5-1. preload 속성

| 값         | 설명                                 |
| ---------- | ------------------------------------ |
| `none`     | 동영상 내용을 미리 로드하지 않음     |
| `metadata` | 동영상 메타데이터만 가져옴 (길이 등) |
| `auto`     | 브라우저가 결정 (기본값)             |

```html
<video preload="none" poster="poster.jpg">
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
</video>
```

### 5-2. poster 이미지 최적화

```html
<!-- LCP 요소인 경우 우선순위 높임 -->
<link rel="preload" as="image" href="poster.jpg" fetchpriority="high" />
```

## 6. 임베드 최적화

### 6-1. 서드파티 임베드의 문제점

- YouTube 임베드는 메인 스레드를 1.7초 이상 차단한다.
- 많은 JavaScript 리소스를 로드하여 성능에 영향을 끼친다.
- INP (Interaction to Next Paint) 지표에 부정적인 영향을 끼친다.

### 6-2. Facade 패턴 활용

```html
<!-- 실제 임베드 대신 플레이스홀더 사용 -->
<div class="video-facade">
  <img src="thumbnail.jpg" alt="Video thumbnail" />
  <button class="play-button">재생</button>
</div>
```

- 초기 페이지 로드 시 임베드를 로드하지 않는다.
- 사용자가 상호작용할 때만 실제 임베드를 로드한다.
- 성능 향상과 사용자 경험을 개선할 수 있다.

## 7. 핵심 최적화 기법

| 기법                  | 설명                         | 사용 시기                     |
| --------------------- | ---------------------------- | ----------------------------- |
| 적절한 코덱 선택      | WebM (VP9/AV1) + MP4 (H.264) | 모든 동영상                   |
| 오디오 제거           | `-an` 플래그 사용            | GIF 대체용                    |
| poster 이미지         | 재생 전 미리보기             | 자동 재생하지 않는 동영상     |
| preload="none"        | 사용자 시작 재생             | 사용자가 클릭해야 하는 동영상 |
| Facade 패턴           | 임베드 지연 로드             | 서드파티 동영상               |
| Intersection Observer | 뷰포트 진입 시 로드          | 뷰포트 밖의 동영상            |
