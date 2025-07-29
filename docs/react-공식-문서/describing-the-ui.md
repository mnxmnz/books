---
sidebar_position: 4
---

# 4장 UI 표현하기

## 1. 첫 번째 컴포넌트

> **컴포넌트**: 앱의 재사용 가능한 UI 요소

React 컴포넌트는 이름을 대문자로 시작해야 한다.

```jsx
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

- 괄호가 없으면 `return` 뒷 라인에 있는 코드가 무시된다. ([ASI](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi))

```jsx
function Profile() {
  return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
}

export default function Gallery() {
  return (
    <section>
      <h2>Amazing scientists</h2>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

- `<section>` 은 소문자이므로 React 는 HTML 태그를 가리킨다고 이해한다.
- `<Profile />` 은 대문자 p 로 시작하므로 React 는 `Profile` 이라는 컴포넌트를 사용한다고 이해한다.

```jsx
export default function Gallery() {
  function Profile() {
    // ...
  }
  // ...
}
```

- 컴포넌트 안에 다른 컴포넌트를 정의하면 안 된다.

## 2. 컴포넌트 Import 및 Export 하기

| Syntax  | Export 구문                             | Import 구문                             |
| ------- | --------------------------------------- | --------------------------------------- |
| Default | `export default function Button( ) { }` | `import Button from './button.js';`     |
| Named   | `export function Button( ) { } `        | `import { Button } from './button.js';` |

보편적으로 한 파일에서 하나의 컴포넌트만 export 할 때 default export 방식을 사용하고 여러 컴포넌트를 export 할 경우엔 named export 방식을 사용한다.

## 3. JSX 로 마크업 작성하기

> **JSX**: JavaScript 를 확장한 문법으로 JavaScript 파일에서 HTML 과 비슷하게 마크업을 작성할 수 있다.

### 3-1. JSX 의 규칙

#### 3-1-1. 하나의 루트 엘리먼트로 반환하기

```jsx
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

- JSX 는 HTML 처럼 보이지만 내부적으로는 일반 JavaScript 객체로 변환된다.

```jsx
function Component() {
  return (
    <h1>안녕하세요</h1>
    <p>반갑습니다</p>
  );
}
```

```jsx
function Component() {
  return React.createElement('h1', null, '안녕하세요'), React.createElement('p', null, '반갑습니다');
}
```

- JavaScript 로 변환되면 위와 비슷한 형태가 된다.
- JavaScript 에서는 함수가 여러 값을 동시에 반환할 수 없다.

```jsx
function Component() {
  return (
    <>
      <h1>안녕하세요</h1>
      <p>반갑습니다</p>
    </>
  );
}
```

```jsx
function Component() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('h1', null, '안녕하세요'),
    React.createElement('p', null, '반갑습니다'),
  );
}
```

- 하나의 Fragment 객체 안에 여러 요소들이 포함되어 있어서 JavaScript 규칙을 위반하지 않는다.

#### 3-1-2. 모든 태그는 닫아주기

```jsx
<>
  <img src="https://i.imgur.com/yXOvdOSs.jpg" alt="Hedy Lamarr" class="photo" />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

#### 3-1-3. ~~거의~~ 대부분 캐멀 케이스로!

```jsx
<img src="https://i.imgur.com/yXOvdOSs.jpg" alt="Hedy Lamarr" className="photo" />
```

- class 는 예약어이기 때문에 React 에서는 DOM 프로퍼티의 이름을 따서 [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) 을 사용한다.

## 4. 중괄호가 있는 JSX 에서 자바스크립트 사용하기

```jsx
export default function TodoList() {
  return (
    <ul
      style={{
        backgroundColor: 'black',
        color: 'pink',
      }}
    >
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

- JSX 에서 객체를 전달하려면 `person={{ name: "Hedy Lamarr", inventions: 5 }}` 와 같이 다른 중괄호 쌍으로 객체를 감싸야 한다.

## 5. 컴포넌트에 Props 전달하기

```jsx
export default function Clock({ color, time }) {
  return <h1 style={{ color: color }}>{time}</h1>;
}
```

- 컴포넌트는 시간에 따라 다른 props 를 받을 수 있다.
- 그러나 props 는 컴퓨터 과학에서 "변경할 수 없다" 라는 의미의 [불변성](https://en.wikipedia.org/wiki/Immutable_object) 을 가지고 있다.
- 컴포넌트가 props 를 변경해야 하는 경우 부모 컴포넌트에 새로운 객체를 전달하도록 요청해야 한다.
- 자바스크립트 엔진은 기존 props 가 차지했던 메모리를 회수한다.
