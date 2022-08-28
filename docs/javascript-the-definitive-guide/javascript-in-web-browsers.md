---
sidebar_position: 15
---

# 15장 웹 브라우저의 자바스크립트

## 15.1 웹 프로그래밍 기본

### 15.1.1 HTML `<script>` 태그 속의 자바스크립트

#### `src` 속성의 장점

- 방대한 자바스크립트 코드를 HTML 파일에서 제거해 단순화한다. 즉, '내용'과 '동작'을 분리한다.
- 여러 개의 웹 페이지에서 같은 자바스크립트 코드를 공유할 때 `src` 속성을 쓰면 코드 하나만 관리해도 된다.
- 자바스크립트 코드를 여러 페이지에서 공유한다면 한 번만 내려받으면 된다. 첫 번째 페이지에서 코드를 내려받으면 다른 페이지는 브라우저 캐시에서 가져올 수 있다.
- `src` 속성은 임의의 URL을 값으로 받으므로 한 서버에 있는 자바스크립트 프로그램이나 웹 페이지가 다른 웹 서버에 있는 코드를 가져올 수 있다. 인터넷 광고는 대부분 이를 바탕으로 만들어진다.

#### 스크립트 실행 시점: async와 defer

스크립트의 기본 모드인 동기적 모드가 유일한 모드는 아니다. `<script>` 태그에 `defer`, `async` 속성을 써서 스크립트 실행 방식을 바꿀 수 있다. 이들은 불 속성이며 값은 없으므로 `<script>` 태그에 존재하기만 하면 된다. 단, `src` 속성과 함께 사용해야만 의미가 있다.

- **`defer`**: 문서를 완전히 내려받고 분석해서 조작할 준비가 끝날 때까지 스크립트 실행을 지연(defer)하라는 의미이다.
- **`async`**: 브라우저가 스크립트를 가능한 빨리 실행하되 스크립트를 내려받는 동안 문서 분석을 계속해도 된다는 뜻이다.
- `<script>` 태그에 두 속성 모두 존재한다면 `async` 속성이 우선순위를 갖는다.

`type="module"` 속성이 있는 스크립트는 기본적으로 `defer` 속성이 있는 것처럼 문서 로딩이 끝난 후 실행된다. `async` 속성을 쓰면 문서 로딩이 끝날 때까지 대기하지 않고 가져온 모듈 전부를 불러오는 즉시 실행을 시작한다.

`async`, `defer` 속성을 쓰지 않고 스크립트를 HTML 파일의 마지막에 불러오기만 해도 같은 효과를 볼 수 있다. 브라우저가 문서 로드와 분석을 이미 끝낸 상태이므로 스크립트에서 문서 콘텐츠를 조작해도 안전하다.

#### 필요에 따른 스크립트 로드

문서를 처음 불러올 때는 필요가 없지만 사용자가 버튼을 클릭하거나 메뉴를 여는 등 어떤 행동을 했을 때만 필요한 자바스크립트 코드도 있다.

모듈을 사용해 코드를 개발했다면 `import()`를 써서 필요한 모듈만 불러올 수 있다.

모듈을 사용하지 않는다면 스크립트를 불러올 때 문서에 `<script>` 태그를 추가해서 자바스크립트 파일을 불러올 수 있다.

```js
// 지정된 URL에서 비동기적으로 스크립트를 불러와서 실행한다.
// 스크립트를 불러오면 해석되는 프라미스를 반환한다.
function importScript(url) {
	return new Promise((resolve, reject) => {
		let s = document.createElement('script'); // <script> 요소 생성
		s.onload = () => {
			resolve();
		}; // 프라미스 해석
		s.onerror = e => {
			reject(e);
		}; // 실패 시 거부
		s.src = url; // 스크립트 URL 설정
		document.head.append(s); // 문서에 <script> 추가
	});
}
```

### 15.1.2 문서 객체 모델

Document 객체는 브라우저 창이나 탭에 표시되는 HTML 문서를 나타내는 객체이며 클라이언트 사이드 자바스크립트 프로그래밍에서 가장 중요한 객체 중 하나이다.

DOM API는 HTML 문서의 트리 구조를 반영한다. 문서에 존재하는 HTML 태그마다 그에 대응하는 자바스크립트 Element 객체가 있고, 문서에 존재하는 텍스트마다 그에 대응하는 Text 객체가 있다. Element, Text, Document 클래스는 모두 Node 클래스의 서브클래스이며 Node 객체는 트리 구조로 되어 있어, 자바스크립트에서 DOM API를 사용해 검색하고 이동할 수 있다.

### 15.1.3 웹 브라우저의 전역 객체

웹 브라우저에서 전역 객체는 내장 타입과 함수를 정의하기도 하지만 현재 웹 브라우저 창을 나타내기도 하며 그 창의 브라우징 히스토리를 나타내는 `history`, 창의 너비를 픽셀로 나타내는 `innerWidth` 같은 프로퍼티를 정의하기도 한다. 이 전역 객체에는 `window` 프로퍼티가 있으며 그 값은 전역 객체 자체이다.

### 15.1.4 네임스페이스를 공유하는 스크립트

스크립트의 최상위 코드가 상수, 변수, 함수, 클래스를 정의하면 그 선언은 같은 문서에서 실행된 모든 스크립트에서 볼 수 있다. 어떤 스크립트에서 함수 `f()`를 정의하고 다른 스크립트에서 클래스 `c`를 정의하면 세 번째 스크립트에서는 그들을 가져오지 않고도 함수를 호출하고 클래스의 인스턴스를 만들 수 있다.

최상위 레벨에서 `var`, `function` 선언을 사용하면 공유된 전역 객체에 프로퍼티가 생성된다. 스크립트 최상위 함수 `f()`를 정의하면 같은 문서에 있는 다른 스크립트는 그 함수를 `f()`로도, `window.f()`로도 호출할 수 있다. ES6의 `const`, `let`, `class`는 최상위 레벨에서 사용하더라도 전역 객체가 아니라 공유된 네임스페이스 안에 생성된다. 스크립트에서 클래스 `C`를 정의하면 다른 스크립트에서는 `new window.C()`가 아니라 `new C()`로 그 클래스의 인스턴스를 만든다.

### 15.1.5 자바스크립트 프로그램 실행

#### 클라이언트 사이드 자바스크립트 스레드 모델

자바스크립트는 싱글 스레드 언어이며, 싱글 스레드 실행 모델은 두 이벤트 핸들러가 절대 동시에 실행되지 않으므로 프로그래밍이 훨씬 단순하다. 콘텐츠를 수정할 때 다른 스레드가 같은 콘텐츠를 동시에 수정하게 될 일도 없고, 락(lock), 교착 상태(deadlock), 경합 조건(rece condition)을 걱정할 필요도 없다.

싱글 스레드는 웹 브라우저가 스크립트와 이벤트 핸들러를 실행하는 동안 사용자 입력에 반응하지 않는다는 의미이다. 따라서 자바스크립트 프로그래머는 스크립트와 이벤트 핸들러가 너무 오래 실행되게 만들어서는 안 된다. 스크립트에서 과도한 계산을 수행하면 문서 로딩이 지연되고 사용자는 스크립트 실행이 완료될 때까지 문서 콘텐츠를 볼 수 없다. 이벤트 핸들러에서 과도한 계산을 수행하면 브라우저의 응답이 멈추고 사용자는 브라우저가 다운됐다고 생각할 수도 있다.

웹 플랫폼은 '웹 워커'를 통해 동시성을 구현한다. 웹 워커는 사용자 인터페이스를 멈추지 않으면서 실행되는 백그라운드 스레드이다. 웹 워커 스레드에서 실행되는 코드는 문서 콘텐츠에 접근할 수 없고, 메인 스레드나 다른 워커와는 상태를 공유하지 않으면서 오로지 비동기 메시지 이벤트를 통해서만 통신한다.

<br />

## 15.2 이벤트

이벤트 타입

- 이벤트 종류를 지정하는 문자열이다. 예를 들어 `mousemove` 타입은 사용자가 마우스를 움직였다는 의미이다. `keydown` 타입은 사용자가 키보드의 키를 눌렀다는 뜻이다. `load` 타입은 문서나 기타 자원의 로딩이 끝났다는 의미이다. 이벤트 타입은 단순한 문자열이므로 이벤트 이름이라 부를 때도 있다.

이벤트 대상

- 이벤트가 일어난, 또는 이벤트와 연관된 객체이다. 이벤트를 지칭할 때는 'Window 객체의 `load` 이벤트'나 '`<button>` 요소의 `click` 이벤트'처럼 반드시 그 타입과 대상을 함께 지정해야 한다.

이벤트 핸들러 또는 이벤트 리스너

- 이 함수는 이벤트를 처리하거나 이벤트에 반응한다. 애플리케이션은 이벤트 타입과 이벤트 대상을 지정해 웹 브라우저에 이벤트 핸들러 함수를 등록한다.

<br />

## 15.3 문서 스크립트

### 15.3.4 요소 콘텐츠

요소의 `innerHTML` 프로퍼티는 요소 콘텐츠를 마크업 문자열로 반환한다. 이 프로퍼티의 값을 설정하면 웹 브라우저 파서를 호출해서 요소의 현재 콘텐츠를 새로운 문자열을 분석한 값으로 교체한다.

`outerHTML` 프로퍼티는 `innerHTML`과 비슷하지만 그 값에 요소 자체가 포함된다는 점이 다르다. `outerHTML`의 값에는 요소를 열고 닫는 태그가 포함된다. `outerHTML`을 설정하면 요소 자체가 새로운 콘텐츠로 교체된다.

관련된 메서드 `insertAdjacentHTML()`은 지정된 요소에 '인접한(adjacent)' 위치에 임의의 HTML 마크업을 삽입한다. 마크업은 두 번재 인자이며 '인접한'의 정확한 의미는 첫 번째 인자에 따라 다르다. 첫 번째 인자는 반드시 `beforebegin`, `afterbegin`, `beforeend`, `afterend` 중 하나의 문자열이어야 한다.

```html
"beforebegin"
<div id="target">"afterbegin"This is the element content"beforeend"</div>
"afterend"
```

<br />

## 15.4 CSS 스크립트

### 15.4.1 CSS 클래스

자바스크립트로 문서 콘텐츠의 스타일을 바꾸는 가장 단순한 방법은 HTML 태그의 `class` 속성에 CSS 클래스를 추가하거나 제거하는 것이다.

### 15.4.2 인라인 스타일

모든 Element 객체에는 `style` 속성에 대응하는 `style` 프로퍼티가 있다.

- `style` 프로퍼티는 문자열이 아니라 CSSStyleDeclaration 객체이다.
- CSSStyleDeclaration 객체는 `style` 속성에 텍스트 형태로 존재하는 CSS 스타일을 파싱한 결과이다.

### 15.4.3 계산된 스타일

요소의 계산된 스타일은 부라우저가 요소의 인라인 스타일과 모든 스타일시트에서 가져온 적용 가능한 스타일 규칙 전체를 합해 계산한 프로퍼티 값 집합이다. 다시 말해, 요소를 표시할 때 실제로 사용되는 프로퍼티 집합이다.

- 인라인 스타일과 마찬가지로 계산된 스타일 역시 CSSStyleDeclaration 객체로 표현된다.
- 인라인 스타일과 달리 계산된 스타일은 읽기 전용이다.

요소의 계산된 스타일을 구할 때는 Window 객체의 `getComputedStyle()` 메서드를 사용한다.

- 첫 번째 인자는 계산된 스타일을 가져올 요소이다.
- 선택 사항인 두 번째 인자는 `::before`, `::after` 같은 CSS 가상 요소를 지정한다.

`getComputedStyle()` 반환 값은 지정된 요소에 적용된 스타일 전체를 나타내는 CSSStyleDeclaration 객체이다. 인라인 스타일을 나타내는 CSSStyleDeclaration 객체와 계산된 스타일을 나타내는 CSSStyleDeclaration 객체 사이에는 몇 가지 중요한 차이가 있다.

- 계산된 스타일 프로퍼티는 읽기 전용이다.
- 계산된 스타일 프로퍼티는 절댓값이다.
- 단축 프로퍼티는 계산되지 않으며 베이스인 기본 프로퍼티만 계산된다.
- 계산된 스타일에는 `cssText` 프로퍼티가 존재하지 않는다.

> CSS로 요소의 위치와 크기를 정확히 지정할 수 있지만 계산된 스타일을 통해 요소의 위치와 크기를 가져오는 건 권하지 않는다.

### 15.4.4 스타일시트 스크립트

자바스크립트는 스타일시트 자체도 조작할 수 있다. 스타일시트는 `<style>` 태그 또는 `<link rel="stylesheet">` 태그로 HTML 문서에 연결된다.

DOM 조작 방법을 통해 새로운 스타일시트를 삽입할 수 있다.

```js
function setTheme(name) {
	// <link rel="stylesheet">를 새로 만들어 스타일시트를 불러온다.
	let link = document.createElement('link');
	link.id = 'theme';
	link.rel = 'stylesheet';
	link.href = `themes/${name}.css`;

	// id가 theme인 기존 링크를 찾는다.
	let currentTheme = document.querySelector('#theme');
	if (currentTheme) {
		// 기존 테마가 있으면 새 테마로 교체한다.
		currentTheme.replaceWith(link);
	} else {
		// 없다면 테마 스타일시트 링크를 삽입한다.
		document.head.append(link);
	}
}
```

`<style>` 태그가 들어 있는 HTML 문자열을 삽입하는 방법도 있다.

```js
document.head.insertAdjacentHTML('beforeend', '<style>body{transform:rotate(180deg)}</style>');
```

### 15.4.5 CSS 애니메이션과 이벤트

CSS 트랜지션과 마찬가지로 CSS 애니메이션 역시 자바스크립트 코드에서 주시할 수 있는 이벤트를 일으킨다.

- `animationstart`는 애니메이션이 시작할 때, `animationend`는 애니메이션이 끝날 때 일어난다.
- 애니메이션이 두 번 이상 반복된다면 마지막을 제외하고 반복마다 `animationiteration` 이벤트가 일어난다.
- 이벤트 대상은 애니메이션이 일어나는 요소이며 핸들러 함수에 전달되는 이벤트 객체는 애니메이션 이벤트(AnimationEvent) 객체이다.
- 이들 이벤트에는 애니메이션을 정의하는 CSS `animation-name` 프로퍼티에 대응하는 `animationName` 프로퍼티가 있고, 애니메이션이 시작된 후 경과한 시간을 나타내는 `elapsedTime` 프로퍼티가 있다.

<br />

## 15.5 문서 지오메트리와 스크롤

### 15.5.1 문서 좌표와 뷰포트 좌표

- `position:fixed`: `top`, `left` 프로퍼티는 뷰포트 좌표를 기준으로 해석된다.
- `position:relative`: 요소는 `position` 프로퍼티를 아예 사용하지 않은 경우에 위치했을 곳ㅇ르 기준으로 새 위치가 지정된다.
- `position:absolute`: `top`, `left` 프로퍼티는 포지션이 지정된 요소 중 가장 가까운 요소, 그런 것이 없다면 문서를 기준으로 해석된다.

### 15.5.2 요소의 위치 검색

`getBoundingClientRect()` 메서드를 호출해 요소의 크기와 위치를 파악할 수 있다.

- 이 메서드는 인자를 받지 않으며 `left`, `right`, `top`, `bottom`, `width`, `height` 프로퍼티가 있는 객체를 반환한다.

### 15.5.3 지정된 위치에 있는 요소 파악

Document 객체의 `elementFromPoint()` 메서드를 사용하면 뷰포트에서 특정 좌표에 있는 요소가 무엇인지 알 수 있다.

- 원하는 `x`, `y` 좌표로 이 메서드를 호출하면 지정된 위치에 있는 Element 객체가 반환된다.

### 15.5.4 스크롤

#### scrollTo()

Window 객체의 `scrollTo()` 메서드는 문서 좌표 기준인 `x`와 `y` 좌표를 받고 이 값을 스크롤 오프셋으로 설정한다. 다시 말해 브라우저 창을 스크롤해서 지정된 지점을 뷰포트의 좌측 상단 모서리로 만든다.

#### scrollBy()

Window의 `scrollBy()` 메서드는 `scrollTo()`와 비슷하지만 인자는 현재 스크롤 위치에 상대적이며 현재 스크롤 위치에 더해진다.

```js
// 500밀리초마다 50픽셀씩 아래로 무한히 스크롤한다.
setInterval(() => {
	scrollBy(0, 50);
}, 500);
```

`scrollTo()`, `scrollBy()`를 사용할 때 부드럽게 스크롤하려면 다음과 같이 숫자 대신 객체 인자를 전달한다.

```js
window.scrollTo({
	left: 0,
	top: documentHeight - viewportHeight,
	behavior: 'smooth',
});
```

#### scrollIntoView()

일정 픽셀만큼 스크롤하기보다는 원하는 요소가 보일 때까지 스크롤하는 경우가 더 많다. 원하는 HTML 요소에서 `scrollIntoView()` 메서드를 사용하면 된다. 이 메서드는 호출된 요소가 뷰포트에 나타날 때까지 스크롤한다.

### 15.5.5 뷰포트 크기, 콘텐츠 크기, 스크롤 위치

- 브라우저 창의 뷰포트 크기는 `window.innerWidth`, `window.innerHeight` 프로퍼티로 알 수 있다.
- 모바일 장치에 최적화된 웹 페이지는 `<head>`에 `<meta name="viewport">` 태그를 써서 원하는 뷰포트 너비를 설정할 때가 많다.
- 문서의 전체 크기는 `document.documentElement`, 즉 `<html>` 요소의 크기와 같다.
- `document.documentElement`의 `getBoundingClientRect()`를 호출하거나 `document.documentElement`의 `offsetWidth`, `offsetHeight` 프로퍼티에서 문서의 너비와 높이를 알 수 있다.
- 문서의 스크롤 오프셋은 `window.scrollX`, `window.scrollY`으로 알 수 있다.
- 이들은 읽기 전용 프로퍼티이므로 문서 스크롤에는 사용할 수 없다. 대신 `window.scrollTo()`를 사용해야 한다.

<br />

## 15.6 웹 컴포넌트

### 15.6.1 웹 컴포넌트 사용

웹 컴포넌트는 자바스크립트로 정의되므로 HTML 파일에서 웹 컴포넌트를 사용하려면 컴포넌트를 정의한 자바스크립트 파일을 불러와야 한다.

```js
<script type="module" src="components/search-box.js">
```

일반적인 HTML 요소와 마찬가지로 웹 컴포넌트도 특정한 타입의 자식 요소를 받기도 하고, 반대로 자식 요소를 받지 않기도 한다. 일부 웹 컴포넌트는 이름 붙은 '슬롯'에 특별한 라벨이 붙은 자식 요소를 선택적으로 받도록 작성되기도 한다.

- `<search-box>` 컴포넌트는 '슬롯'을 써서 아이콘을 표시한다.
- `<search-box>`에 다른 아이콘을 사용하고 싶다면 HTML을 다음과 같이 만들면 된다.

```html
<search-box>
	<img src="images/search-icon.png" slot="left" />
	<img src="images/cancel-icon.png" slot="right" />
</search-box>
```

`slot` 속성은 자식 요소를 어디에 표시할지 정하는 속성이다.

- 슬롯 이름(`left`, `right`)은 웹 컴포넌트에서 정의한다.

브라우저는 컴포넌트가 정의되기 전에 웹 컴포넌트 태그를 만날 경우 범용 HTMLElement를 DOM 트리에 추가한다.

- 나중에 커스텀 요소가 정의되면 범용 요소를 알맞게 '업그레이드'한다.

### 15.6.2 HTML 템플릿

HTML `<template>` 태그는 웹 컴포넌트와 밀접한 관련은 없지만 웹 페이지에 자주 등장하는 컴포넌트를 최적화하기에 적합하다.

- 웹 브라우저는 `<template>` 태그와 자식 요소를 절대 렌더링하지 않으므로 `<template>` 태그는 자바스크립트에서만 사용할 수 있다.
- 이 태그의 목적은 테이블 행 또는 웹 컴포넌트의 내부 구성 요소 같은 기본적인 HTML 구조가 웹 페이지에 여러 번 반복해야 할 때 `<template>`을 써서 한 번만 정의하고, 필요한 만큼 자바스크립트로 복사해서 쓰는 것이다.

자바스크립트에서 `<template>` 태그는 HTMLTemplateElement 객체로 나타낸다.

- 이 객체에는 `content` 프로퍼티 단 하나만 존재하며, 프로퍼티 값은 `<template>`의 자식 노드로 이루어진 DocumentFragment이다.
- DocumentFragment를 복사해서 문서에 삽입하면 프래그먼트 자체가 아니라 자식 요소가 삽입된다.

```js
let tableBody = document.querySelector('tbody');
let template = document.querySelector('#row');
let clone = template.content.cloneNode(true); // 깊은 복사
// ... 사본의 <td> 요소에 콘텐츠를 삽입하는 코드
// ... 복제되고 초기화된 행을 테이블에 삽입하는 코드
tableBody.append(clone);
```

템플릿 요소를 꼭 HTML 문서 안에 작성할 필요는 없다. 자바스크립트 코드에서 템플릿을 생성하고 `innerHTML`로 자식 요소를 생성하면 `innerHTML`을 파싱하는 부담이 줄어든다.

### 15.6.3 커스텀 요소

커스텀 요소는 자바스크립트 클래스와 HTML 태그 이름을 묶어서 해당 태그가 자동으로 클래스의 인스턴스가 되게 한다.

- `customElements.define()` 메서드의 첫 번째 인자는 웹 컴포넌트 태그 이름이고 두 번째 인자는 HTMLElement의 서브클래스이다.
- 해당 태그 이름을 가진 기존 요소는 모두 새로 생성된 클래스 인스턴스로 '업그레이드'된다.
- 브라우저는 나중에 HTML을 파싱할 때 해당 태그 이름을 만날 때마다 자동으로 인스턴스를 만든다.

브라우저는 커스텀 요소 클래스에서 '수명 주기 메서드'를 자동으로 호출한다.

- 커스텀 요소 인스턴스를 문서에 삽입할 때 `connectedCallback()` 메서드가 호출되며 많은 요소에서 이 메서드를 초기화에 사용한다.

속성 이름으로 이루어진 배열이 값인 정적 프로퍼티 `observedAttributes`가 있는 커스텀 요소 클래스에서 속성을 설정하거나 변경하면 브라우저는 `attributeChangedCallback()` 메서드를 호출하면서 속성 이름, 원래 값, 새로운 값을 인자로 전달한다.

- 속성 값에 따라 컴포넌트를 업데이트할 때 이 콜백을 사용할 수 있다.

### 15.6.4 섀도우 DOM

섀도우 DOM은 커스텀 요소와 `<div>`, `<span>`, `<body>`, `<article>`, `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<p>`, `<blockquote>`, `<aside>`, `<h1>` ~ `<h6>` 요소에 '섀도우 호스트'라 부르는 '섀도우 루트'를 붙일 수 있게 허용한다.

- 섀도우 호스트 요소는 모든 HTML 요소와 마찬가지로 자손 요소와 `Text` 노드로 구성된 일반적인 DOM 트리의 루트이다.
- 섀도우 루트는 섀도우 호스트에서 뻗어 나오는 자손 요소의 또 다른 루트이며, 그 자체로 별개의 미니 문서라고 볼 수 있다.

섀도우 DOM의 '섀도우'는 섀도우 루트의 자손인 요소가 '그림자 속에 숨어 있는' 성질을 갖는 데서 나온 용어이다.

- 섀로우 루트의 자손은 일반적인 DOM 트리에 속하지 않고, 호스트 요소의 `children` 배열에도 포함되지 않으며, `querySelector()` 같은 일반적인 DOM 순회 메서드에서 열거되지도 않았다.
- 이와 대비해서 섀도우 호스트의 일반적인 DOM 자식 요소를 '라이트 DOM'이라고 부르기도 한다.

HTML `<audio>`, `<video>` 요소를 생각해 보면 섀도우 DOM의 목적을 이해하기 쉽다.

- 이들 요소에는 미디어 제어에 필요한 사용자 인터페이스가 포함되어 있지만, 재생과 일시 정지 버튼을 비롯한 다른 UI 요소들은 DOM 트리에 노출되지 않으며 자바스크립트로 조작할 수도 없다.

#### 섀도우 DOM 캡슐화

섀도우 루트의 자손 요소는 일반적인 DOM 트리에 독립적이다. 아예 다른 문서에 존재한다고 해도 과언이 아닐 정도로 독립적이다. 섀도우 DOM은 매우 중요한 세 가지 종류의 캡슐화를 제공한다.

- 섀도우 DOM에 들어 있는 요소는 `querySelectorAll()` 같은 일반적인 DOM 메서드에 노출되지 않는다. 섀도우 루트를 생성할 때 '열린' 모드와 '닫힌' 모드를 선택할 수 있다. 닫힌 섀도우 루트는 완전히 밀봉되며 접근도 불가능하다. 하지만 섀도우 루트는 대부분 '열린' 모드로 생성되며 섀도우 호스트에 `shadowRoot` 프로퍼티가 생기므로 필요하다면 자바스크립트로 섀도우 루트의 요소에 접근할 수 있다.
- 섀도우 루트 아래에서 정의한 스타일은 해당 트리에 종속되며 외부에 있는 라이트 DOM 요소에는 절대 영향을 끼치지 않는다. 섀도우 루트에서 호스트 요소의 기본 스타일을 정의할 수 있긴 하지만 라이트 DOM 스타일이 이를 덮어쓴다. 마찬가지로, 섀도우 호스트 요소에 적용되는 라이트 DOM 스타일은 섀도우 루트의 자손 요소에는 아무 효과도 미치지 않는다. 섀도우 DOM의 요소는 라이트 DOM에서 폰트 크기나 배경색 등을 상속하고, 라이트 DOM에서 정의한 CSS 변수를 섀도우 DOM의 스타일에서도 사용할 수 있긴 하지만, 라이트 DOM의 스타일과 섀도우 DOM의 스타일은 거의 대부분 완전히 독립적이다. 웹 컴포넌트 제작자와 사용자가 스타일시트 충돌을 걱정할 필요는 없다. 이렇게 CSS 범위를 지정하는 것이 아마 섀도우 DOM에서 가장 중요한 특징일 것이다.
- 섀도우 DOM 안에서 일어나는 `load` 같은 일부 이벤트는 섀도우 DOM으로 제한된다. 반면, 포커스, 마우스, 키보드 이벤트 같은 이벤트에는 버블링이 적용된다. 섀도우 DOM에서 일어난 이벤트가 경계를 넘어 라이트 DOM으로 전달되기 시작하면 `target` 프로퍼티가 섀도우 호스트 요소로 변경되므로 그 요소에서 직접 발생한 것처럼 보인다.

#### 섀도우 DOM 슬롯과 라이트 DOM 자식 요소

섀도우 호스트인 HTML 요소는 두 개의 트리를 가진다. 하나는 호스트 요소의 라이트 DOM 자손 요소인 `children` 배열이고, 다른 하나는 섀도우 루트와 그 자손 요소이다.

- 섀도우 루트의 자손 요소는 항상 섀도우 호스트 안에 표시된다.
- 섀도우 루트의 자손 요소에 `<slot>` 요소가 있다면 호스트 요소의 라이트 DOM 자식 요소는 그 `<slot>`의 자식인 것처럼 해당 슬롯의 섀도우 DOM 콘텐츠 대신 표시된다. 섀도우 DOM에 `<slot>`이 없다면 라이트 DOM 콘텐츠는 절대 표시되지 않는다. 섀도우 DOM에 `<slot>`이 있지만 섀도우 호스트에 라이트 DOM 자식 요소가 없다면 슬롯의 섀도우 DOM 콘텐츠가 표시된다.
- 라이트 DOM 콘텐츠가 섀도우 DOM 슬롯 안에 표시될 때 이들 요소가 '분산'됐다고 표현하지만, 요소가 실제로 섀도우 DOM의 일부가 된 건 아님을 이해해야 한다. 라이트 DOM 콘텐츠는 여전히 `querySelector()`에 노출되며 호스트 요소의 자손 또는 자식 요소로 라이트 DOM 안에 존재한다.
- 섀도우 DOM에 `<slot>`이 하나 이상 있고 `name` 속성으로 이들의 이름을 정의했다면 섀도우 호스트의 자식 요소를 어떤 슬롯에 표시할지 `slot="slotname"` 속성으로 지정할 수 있다.

#### 섀도우 DOM API

라이트 DOM 요소를 섀로우 호스트로 전환할 때는 `{mode:"open"}`만 인자로 전달하면서 `attachShadow()` 메서드를 호출하면 된다.

- 이 메서드는 섀도우 루트 객체를 반환하는 동시에 이 객체를 호스트의 `shadowRoot` 프로퍼티 값으로 설정한다.
- 섀도우 루트 객체는 DocumentFragment이며 DOM 메서드를 쓰거나 `innerHTML` 프로퍼티에 HTML 문자열을 할당하는 방식으로 콘텐츠를 추가할 수 있다.

웹 컴포넌트에서 섀도우 DOM `<slot>`의 라이트 DOM 콘텐츠가 언제 바뀌었는지 알고 싶다면 `<slot>` 요소에 `slotchanged` 이벤트를 등록하면 된다.

<br />

## 15.10 위치, 네비게이션, 히스토리[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#1510-%EC%9C%84%EC%B9%98-%EB%84%A4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC)

Window와 Document 객체의 `location` 프로퍼티는, 현재 창에 표시되는 문서의 URL을 나타내고 창에 새로운 문서를 불러오는 API를 제공하는 Location 객체를 참조한다.

- `hash`: URL에서 해시 마크(#)와 요소 ID로 구성된 부분이 있다면 그 부분을 나타내는 해시 식별자를 반환한다.
- `search`: URL에서 물음표로 시작하는 부분을 반환하며 이 문자열은 일종의 쿼리스트링으로 쓰인다.

`window.location.search`를 파싱하고 싶다면 Location 객체에서 URL 객체를 생성하고 URL의 `searchParams`를 사용하면 된다.

```jsx
let url = new URL(window.location);
let query = url.searchParams.get('q');
let numResults = parseInt(url.searchParams.get('n') || '10');
```

### 15.10.1 새로운 문서 로딩[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#15101-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%AC%B8%EC%84%9C-%EB%A1%9C%EB%94%A9)

`window.location`이나 `document.location`에 문자열을 할당하면 브라우저는 문자열을 URL로 해석하고 불러와서 현재 문서를 대체한다.

```jsx
window.location = 'http://ebook.insightbook.co.kr/';
```

해시 식별자 하나만 사용하면 브라우저는 새로운 문서를 불러오지 않고 해당 해시와 일치하는 `id` 또는 `name` 속성의 요소를 찾고 요소가 브라우저 창 위쪽에 보이도록 스크롤한다.

- `#top`은 문서 맨 처음으로 돌아간다.

Location 객체의 프로퍼티는 쓰기 가능이며 이 값을 바꾸면 URL이 바뀌고 브라우저가 새로운 문서를 불러온다.

```jsx
document.location.path = 'pages/3.html'; // 새로운 페이지를 불러온다.
document.location.hash = 'TOC'; // 차례 위치까지 스크롤한다.
location.search = '?page=' + (page + 1); // 새로운 쿼리스트링으로 다시 불러온다.
```

Location 객체의 `replace()` 메서드는 브라우저의 히스토리에 있는 현재 문서를 교체한다.

- 사용자가 뒤로 가기 버튼을 클릭하면 브라우저는 문서 A보다 먼저 표시했던 문서로 돌아간다.

### 15.10.2 히스토리 브라우징[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#15102-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A7%95)

Window 객체의 `history` 프로퍼티는 해당 창의 History 객체를 가리킨다.

- History 객체는 창에서 불러왔던 문서와 그 상태의 리스트이다.

```jsx
history.go(0); // 현재 페이지를 리로드하는 또 다른 방법
```

브라우저 창에 `<iframe>` 요소 같은 자식 창이 포함되어 있다면 자식 창의 히스토리가 메인 창의 히스토리에 시간 순서대로 삽입된다.

- 메인 창에서 `history.back()`을 호출하면 자식 창 중 하나가 이전 문서로 돌아가고 메인 창에는 변화가 없을 수도 있다.

### 15.10.3 hashchange 이벤트를 통한 히스토리 관리[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#15103-hashchange-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%ED%86%B5%ED%95%9C-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC-%EA%B4%80%EB%A6%AC)

`location.hash` 프로퍼티를 설정하면 주소 표시줄에 표시되는 URL이 바뀌고 브라우저 히스토리 항목에 추가된다. 문서의 해시 식별자가 바뀔 때마다 브라우저는 Window 객체에서 `hashchange` 이벤트를 일으킨다. `location.hash` 값을 바꾸면 `hashchange` 이벤트가 일어나며 브라우저의 히스토리에 새로운 항목이 추가된다. 사용자가 뒤로 가기 버튼을 클릭하면 브라우저는 `location.hash`를 바꾸기 전의 URL로 돌아간다. 해시 식별자가 바뀌었다는 뜻이므로 또 다른 `hashchange` 이벤트가 일어난다.

즉, 애플리케이션의 각 상태와 해시 식별자를 1:1로 대응시키면 `hashchange` 이벤트를 통해 사용자의 앞뒤 이동을 알 수 있다.

### 15.10.4 pushState()를 사용한 히스토리 관리[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#15103-hashchange-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A5%BC-%ED%86%B5%ED%95%9C-%ED%9E%88%EC%8A%A4%ED%86%A0%EB%A6%AC-%EA%B4%80%EB%A6%AC)

웹 애플리케이션은 새로운 상태로 전환할 때 `history.pushState()`를 호출해 현재 상태를 나타내는 객체를 브라우저의 히스토리에 추가한다.

- 사용자가 뒤로 가기 버튼을 클릭하면 브라우저는 저장된 상태 객체와 함께 `popstate` 이벤트를 일으키므로, 애플리케이션에서 이 객체를 사용해 이전 상태로 돌아갈 수 있다.

---

## 15.11 네트워크[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#1511-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC)

### 15.11.1 fetch()

Fetch API는 HTTP 파이프라인을 구성하는 요청과 응답 등의 요소를 자바스크립트에서 접근하고 조작할 수 있는 인터페이스를 제공한다.

- Fetch API가 제공하는 전역 `fetch()`메서드로 네트워크의 리소스를 비동기적으로 가져올 수 있다.

```jsx
fetch('http://example.com/movies.json')
	.then(response => response.json())
	.then(data => console.log(data));
```

가장 단순한 형태의 `fetch()`는 가져오고자 하는 리소스의 경로를 나타내는 하나의 인수만 받는다. 응답은 `Response` [](https://developer.mozilla.org/en-US/docs/Web/API/Response)객체로 표현되며, 직접 JSON 응답 본문을 받을 수는 없다.

- `Response` 객체는 JSON 응답 본문을 그대로 포함하지 않는다.
- `Response`는 HTTP 응답 전체를 나타내는 객체로, JSON 본문 콘텐츠를 추출하기 위해 `json()` 메서드를 호출해야 한다. `json()`은 응답 본문 텍스트를 JSON으로 파싱한 결과로 이행하는, 또 다른 프로미스를 반환한다.

### 15.11.3 웹소켓

웹소켓을 사용하면 서버와 브라우저 간 연결을 유지한 상태로 데이터를 교환할 수 있다.

- 데이터는 패킷 형태로 전달되며, 전송은 커넥션 중단과 추가 HTTP 요청 없이 양방향으로 이뤄진다.

```jsx
let socket = new WebSocket('wss://example/websocket/demo');
```

소켓이 정상적으로 만들어지면 아래 네 개의 이벤트를 사용할 수 있게 된다.

- **`open`:** 커넥션이 제대로 만들어졌을 때 발생한다.
- **`message`:** 데이터를 수신하였을 때 발생한다.
- **`error`:** 에러가 생겼을 때 발생한다.
- **`close`:** 커넥션이 종료되었을 때 발생한다.

---

## 15.12 스토리지[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#1512-%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80)

### 15.12.1 로컬스토리지와 세션스토리지

`localStorage`는 `sessionStorage`와 비슷하지만, `localStorage`의 데이터는 만료되지 않고 `sessionStorage`의 데이터는 페이지 세션이 끝날 때(페이지를 닫을 때) 사라지는 점이 다르다.

- `localStorage`에 저장한 자료는 페이지 프로토콜별로 구분한다. 특히 HTTP로 방문한 페이지에서 저장한 데이터는 같은 페이지의 HTTPS와 다른 `localStorage`에 저장된다.

### 15.12.2 쿠키

쿠키는 주로 웹 서버에 의해 만들어진다. 서버가 HTTP 응답 헤더의 `Set-Cookie`에 내용을 넣어 전달하면, 브라우저는 이 내용을 저장한다. 브라우저는 사용자가 쿠키를 생성하도록 동일 서버(사이트)에 접속할 때마다 쿠키의 내용을 `Cookie` 요청 헤더에 넣어서 함께 전달한다.

쿠키는 클라이언트 식별과 같은 인증에 가장 많이 쓰인다.

1. 사용자가 로그인하면 서버는 HTTP 응답 헤더의 `Set-Cookie`에 담긴 세션 식별자 정보를 사용해 쿠키를 설정한다.
2. 사용자가 동일 도메인에 접속하려고 하면 브라우저는 HTTP `Cookie` 헤더에 인증 정보가 담긴 세션 식별자를 함께 실어 서버에 요청을 보낸다.
3. 서버는 브라우저가 보낸 요청 헤더의 세션 식별자를 읽어 사용자를 식별한다.

### 15.12.3 IndexedDB

IndexedDB는 파일이나 블롭 등 많은 양의 구조화된 데이터를 클라이언트에 저장하기 위한 API이다.

Web Storage는 적은 양의 데이터를 저장하는데 유용하지만 많은 양의 구조화된 데이터에는 적합하지 않은데, 이럴 때 IndexedDB를 사용할 수 있다.

```jsx
let openRequest = indexedDB.open(name, version);
```

---

## 15.13 워커 스레드와 메시지[](http://localhost:3000/javascript-the-definitive-guide/javascript-in-web-browsers#1513-%EC%9B%8C%EC%BB%A4-%EC%8A%A4%EB%A0%88%EB%93%9C%EC%99%80-%EB%A9%94%EC%8B%9C%EC%A7%80)

**웹 워커**는 스크립트 연산을 웹 어플리케이션의 주 실행 스레드와 분리된 별도의 백그라운드 스레드에서 실행할 수 있는 기술이다. 웹 워커를 통해 무거운 작업을 분리된 스레드에서 처리하면 주 스레드가 멈추거나 느려지지 않고 동작할 수 있다.

워커 스레드는 몇 가지 예외가 존재한다. 예를 들어 워커에서 DOM을 직접 조작할 수 없고, window의 일부 메서드와 속성은 사용할 수 없다. 그러나 웹 소켓과 IndexedDB
를 포함한 많은 수의 항목은 사용 가능하다.

<br />

<hr />

JavaScript: The Definitive Guide, Seventh Edition, by David Flanagan (O'Really). Copyright 2020 David Flanagan, 978-1-491-95202-3
