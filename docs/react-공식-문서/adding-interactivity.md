---
sidebar_position: 5
---

# 5장 상호작용 추가하기

## 1. 이벤트에 응답하기

```tsx
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => alert('You clicked on the toolbar!')}>
      <button onClick={() => alert('Playing!')}>Play Movie</button>
      <button onClick={() => alert('Uploading!')}>Upload Image</button>
    </div>
  );
}
```

- `onScroll` 이벤트는 스크롤이 발생한 요소에서만 실행되고 다른 요소로 전파되지 않는다.
- `onScroll` 이벤트를 제외한 다른 모든 이벤트(ex.`onClick`, `onMouseOver` 등)는 자식 요소에서 부모 요소로 전파된다.

```tsx
<div
  onClickCapture={() => {
    /* this runs first */
  }}
>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

- 이벤트명 마지막에 `Capture` 를 추가하면 전파 로직과 관계없이 모든 이벤트를 기록할 수 있다.

## 2. State: 컴포넌트의 기억 저장소

### 2-1. useState 동작 방식

- `useState` 는 어떤 `state` 변수를 참조하는지에 대한 식별자를 별도로 받지 않는다.
- 훅은 항상 최상위 수준에서만 호출되어야 하며 이 규칙을 따르면 항상 같은 순서로 호출된다.
- 호출 순서에 의존하므로 위의 규칙으로 실행 순서 보장이 필요하다.

### 2-2. useState 내부 구현

- 컴포넌트마다 `state` 값을 저장하는 배열을 가지고 있다.
- 컴포넌트가 렌더링 될 때마다 `useState` 호출 순서를 추적하는 카운터를 0으로 초기화한다.
- 컴포넌트에서 `useState` 를 호출하면 다음과 같이 동작한다.
  - 현재 인덱스 위치의 `state` 값을 가져온다.
  - 다음 `useState` 호출을 위해 인덱스를 1 증가시킨다.
  - 여러 개의 `useState` 를 사용해도 각각의 `state` 가 올바른 순서로 매칭된다.

### 2-3. useState 구현 예시

```js
let componentHooks = [];
let currentHookIndex = 0;

function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // 첫 번째 렌더링이 아닌 경우
    currentHookIndex++;
    return pair;
  }

  // 첫 번째 렌더링인 경우
  pair = [initialState, setState];

  function setState(nextState) {
    pair[0] = nextState;
    updateDOM();
  }

  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}
```

## 3. 렌더링 그리고 커밋

### 3-1. 렌더링 단계

#### 3-1-1. **트리거 단계**

- 초기 렌더링: 앱 시작 시 발생
- 상태 업데이트: 컴포넌트의 state 값이 변경될 때 발생

#### 3-1-2. **렌더링 단계**

- React가 컴포넌트를 호출하여 화면에 표시할 내용을 결정
- 초기 렌더링: 루트 컴포넌트부터 시작
- 리렌더링: state 값이 변경된 컴포넌트부터 시작
- 중첩된 컴포넌트가 없을 때까지 재귀적으로 렌더링

#### 3-1-3. **커밋 단계**

- 초기 렌더링: `appendChild()` DOM API를 사용하여 모든 DOM 노드 생성
- 리렌더링: 필요한 최소한의 DOM 변경만 수행
- 렌더링 간 차이가 있는 경우에만 DOM 노드 변경

### 3-2. 렌더링의 특징

#### 3-2-1. 순수한 계산

- 동일한 입력에는 항상 동일한 출력
- 이전 stat 값을 변경하지 않음
- Strict Mode 에서는 각 컴포넌트 함수를 두 번 호출하여 순수하지 않은 함수를 찾아냄

#### 3-2-2. 성능 최적화

- 기본적으로 업데이트된 컴포넌트 내의 모든 중첩 컴포넌트를 렌더링
- 성능 문제 발생 시 선택적 최적화 가능

### 3-3. 브라우저 페인트

- 렌더링과 커밋이 완료된 후 브라우저가 화면을 다시 그림
- React 의 렌더링과 구분하기 위해 "페인팅"이라고 부름

## 4. 스냅샷으로서의 State

### 4-1. State 스냅샷 특성

- State 변수는 일반 자바스크립트 변수처럼 보이나 실제로는 스냅샷처럼 동작
- State 를 설정해도 이미 존재하는 state 변수는 변경되지 않고 대신 리렌더링 발생
- 각 렌더링은 해당 시점의 state 스냅샷을 보유

### 4-2. 렌더링과 State의 관계

#### 4-2-1. 렌더링 시점의 State

- 컴포넌트가 렌더링될 때 React 는 해당 렌더링에 대한 state 의 스냅샷을 제공
- 모든 변수, 이벤트 핸들러, props 는 렌더링 당시의 state 를 사용해 계산
- 이벤트 핸들러는 생성된 렌더링 시점의 state 값을 유지

#### 4-2-2. State 업데이트와 렌더링

- State 를 설정하면 새로운 렌더링을 요청
- React 는 컴포넌트 외부에 state 를 저장
- `useState` 호출 시 해당 렌더링에 대한 state 의 스냅샷 제공

### 4-3. 이벤트 핸들러와 State

#### 4-3-1. 이벤트 핸들러의 State 접근

- 이벤트 핸들러는 해당 렌더링의 state 스냅샷에 접근
- 비동기 코드에서도 이벤트 발생 시점의 state 값 유지
- State 값은 렌더링 내에서 절대 변경되지 않음

#### 4-3-2. 주의사항

- State 를 설정한 직후에는 state 가 즉시 업데이트되지 않음
- 이벤트 핸들러는 생성된 렌더링 시점의 state 값을 유지
- 최신 state 를 읽으려면 state 갱신 함수 사용 필요

## 5. State 업데이트 큐

### 5-1. Batching

- 이벤트 핸들러의 모든 코드가 실행될 때까지 기다린 후 `state` 값을 업데이트한다.
- 불필요한 리렌더링을 방지하고 성능을 최적화할 수 있다.
- 이벤트 핸들러와 그 안에 있는 코드가 완료될 때까지 UI 업데이트를 하지 않는다는 의미이기도 하다.

### 5-2. 동일한 state 변수의 연속 업데이트

```tsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(n => n + 1);
          setNumber(n => n + 1);
          setNumber(n => n + 1);
        }}
      >
        +3
      </button>
    </>
  );
}
```

- 다음 렌더링 전에 같은 `state` 변수를 여러 번 업데이트하려면 업데이터 함수(`n => n + 1`)를 사용한다.
- `setNumber(n => n + 1)` 같이 이전 `state` 기반으로 다음 `state` 값을 계산하는 함수를 전달한다.

### 5-3. 업데이트 큐 처리 순서

1. 이벤트 핸들러의 다른 코드가 실행될 때까지 기다린다.
2. 모든 `state` 업데이트 함수를 큐에 추가한다.
3. 다음 렌더링에서 큐에 있는 업데이트를 순서대로 처리한다.
4. 업데이트 함수는 렌더링 중에 실행되며 이전 `state` 값을 기반으로 새로운 `state` 값을 계산한다.

```tsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 5);
          setNumber(n => n + 1);
          setNumber(42);
        }}
      >
        Increase the number
      </button>
    </>
  );
}
```

| queued update     | n          | returns   |
| ----------------- | ---------- | --------- |
| "replace with 5"  | 0 (unused) | 5         |
| n => n + 1        | 5          | 5 + 1 = 6 |
| "replace with 42" | 6 (unused) | 42        |

### 5-4. 명명 규칙

- 업데이트 함수의 인수는 해당 `state` 변수의 첫 글자를 사용하는 것이 일반적이다.
- 더 명확한 코드를 위해 전체 `state` 변수명을 사용하거나 `prev` 접두사를 사용할 수도 있다.

## 6. 객체 State 업데이트하기

### 6-1. 변경과 불변성

- `state` 객체는 불변성을 가진 것처럼 다루어야 한다.
- 객체를 직접 변경하는 대신 새로운 객체를 생성하여 교체해야 한다.
- `state` 값에 저장된 모든 자바스크립트 객체는 읽기 전용처럼 다루어야 한다.

#### 6-1-1. 지역 변경

- 새로운 객체를 변경하는 것은 괜찮다.
- 다른 코드가 아직 해당 객체를 참조하지 않기 때문이다.
- 렌더링 중에도 지역 변경을 할 수 있다.

```tsx
// 문제가 되는 코드
position.x = e.clientX; // state 객체 직접 변경

// 괜찮은 코드
const nextPosition = {}; // 새로운 객체 생성
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);

// 더 간단한 코드
setPosition({
  x: e.clientX,
  y: e.clientY,
});
```

### 6-2. 객체 복사 방법

```tsx
// 전개 구문 사용
setPerson({
  ...person,
  firstName: e.target.value,
});

// 중첩된 객체 업데이트
setPerson({
  ...person,
  artwork: {
    ...person.artwork,
    title: e.target.value,
  },
});
```

### 6-3. Immer 사용

```tsx
const [person, updatePerson] = useImmer({
  name: 'Niki de Saint Phalle',
});

function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
  updatePerson(draft => {
    draft.name = e.target.value;
  });
}
```

- [Immer](https://github.com/immerjs/use-immer) 를 사용하면 객체의 불변성을 유지하면서도 객체를 변경하는 것처럼 코드를 작성할 수 있다.

### 6-4. 불변성을 지켜야 하는 이유

- 디버깅 용이성: state 변경 이력을 명확하게 추적할 수 있음
- 최적화: 이전 props/state 비교가 빠름
- 새로운 기능 사용: 새로운 React 기능은 불변성을 기반으로 설계됨
- 구현 단순화: 객체에 대한 특별한 처리가 필요 없음

## 7. 배열 State 업데이트하기

### 7-1. 배열 변경 금지

- `push()`, `pop()`, `splice()` 등의 변경 메서드 사용 금지
- `filter()`, `map()` 등의 불변 메서드 사용

### 7-2. 배열 연산 참조표

| 비선호 (변경)              | 선호 (새 배열 반환)          |
| -------------------------- | ---------------------------- |
| 추가: push, unshift        | concat, [...arr] 전개 연산자 |
| 제거: pop, shift, splice   | filter, slice                |
| 교체: splice, arr[i] = ... | map                          |
| 정렬: reverse, sort        | 배열 복사 후 처리            |

### 7-3. 배열 업데이트 예시

```tsx
// 배열에 항목 추가
setArtists([...artists, { id: nextId++, name: name }]);

// 배열에서 항목 제거
setArtists(artists.filter(a => a.id !== artistId));

// 배열 항목 교체
setArtists(
  artists.map(artist => {
    if (artist.id === artistId) {
      return { ...artist, name: newName };
    } else {
      return artist;
    }
  }),
);
```

### 7-4. Immer 사용

- [Immer](https://github.com/immerjs/use-immer) 를 사용하면 변경 문법을 사용하면서도 불변성을 유지할 수 있음
- 복잡한 중첩 배열 업데이트를 간결하게 작성 가능

```tsx
updateArtists(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```
