---
sidebar_position: 3
---

# 3장 설정하기

## 1. 소개

> **React 컴파일러**: React 앱을 자동으로 최적화하는 새로운 빌드 타임 도구

## 2. 주요 기능

- 자동 메모이제이션: `useMemo`, `useCallback`, `React.memo` 와 같은 최적화를 자동으로 적용한다.
- React 규칙 검증: 컴파일 시점에 React 규칙 위반을 정적으로 감지한다.
- 안전한 최적화: 규칙 위반이 감지된 컴포넌트는 자동으로 최적화에서 제외한다.

## 3. 메모이제이션

React 컴파일러는 주로 두 가지 유형의 최적화에 초점을 맞추고 있다.

### 3-1. 컴포넌트의 연쇄적인 리렌더링 최적화

- Props, State, Context 가 변경될 때 불필요한 리렌더링을 방지한다.

```jsx
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();

  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map(friend => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```

- `friends` 값이 변경되어도 `MessageButton` 컴포넌트는 리렌더링되지 않는다.
- 세분화된 반응성(`Fine-Grained Reactivity`)이라고도 부른다.

### 3-2. 비용이 많이 드는 계산 최적화

- 컴포넌트나 Hook 내부의 비용이 큰 계산에 대해 자동으로 메모이제이션한다.

```jsx
// 컴포넌트나 Hook 이 아니기 때문에 React 컴파일러에 의해 메모이제이션 되지 않는다.
function expensivelyProcessAReallyLargeArrayOfObjects() {
  /* ... */
}

// 컴포넌트이기 때문에 React 컴파일러에 의해 메모이제이션 된다.
function TableContainer({ items }) {
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```

### 3-3. 메모이제이션 제한 사항

- React 컴포넌트와 Hook 만 메모이제이션 한다.
- 모든 함수가 메모이제이션 되는 것은 아니다.
- 여러 컴포넌트 간에 메모이제이션 된 값이 공유되지 않는다.
- 실제 성능 개선이 필요한 경우에만 [프로파일링](https://ko.react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) 후 적용하는 걸 권장한다.

## 4. 설치 방법

```bash
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
```

```bash
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
```

## 5. 컴파일러 가정사항

1. 올바른 자바스크립트 코드로 작성한다.
2. nullable/optional 값에 대한 적절한 처리가 되어있다.
3. React 기본 규칙을 준수한다.

## 6. 최적화 여부 확인 방법

- React DevTools 에서 최적화된 컴포넌트에 "Memo ✨" 배지를 표시한다.

## 7. 주의사항

- 현재 베타 버전이므로 프로덕션 적용 시 주의가 필요하다.
- ESLint 규칙 위반 시 해당 컴포넌트나 Hook 의 최적화를 자동으로 건너뛴다.

```jsx
function SuspiciousComponent() {
  'use no memo'; // 컴포넌트가 React 컴파일러에 의해 컴파일 되지 않도록 제외한다.
  // ...
}
```

- 문제 발생 시 `"use no memo"` 지시어로 특정 컴포넌트 최적화 제외가 가능하다.
