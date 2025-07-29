---
sidebar_position: 7
---

# 7장 탈출구

## 1. Ref로 값 참조하기

### 1-1. Ref의 기본 개념

#### Ref란?

- 컴포넌트가 값을 기억하면서도 렌더링을 유발하지 않도록 할 때 사용
- 단방향 데이터 흐름에서의 탈출구

### 1-2. Ref 사용 방법

#### 1. Ref 생성하기

```tsx
import { useRef } from 'react';

const ref = useRef(0);
```

#### 2. Ref 값 접근하기

- `ref.current` 프로퍼티를 통해 Ref 현재 값에 접근할 수 있음
- 값을 변경할 수 있음 (읽기/쓰기 가능)

### 1-3. Ref와 State의 차이점

#### Ref

- ref 를 변경해도 컴포넌트를 다시 렌더링하지 않음
- 렌더링 프로세스 외부에서 `ref.current` 값을 수정할 수 있음
- 렌더링 중에는 `ref.current` 를 읽거나 쓰면 안 됨

#### State

- state 를 변경하면 컴포넌트를 다시 렌더링함
- state 를 수정하기 위해서는 설정 함수를 리렌더링 대기열에 넣어야 함
- 렌더링 중에도 언제든지 state 를 읽을 수 있음

### 1-4. useRef의 내부 동작 방식

#### useRef 구현

```tsx
function useRef(initialValue) {
  const [ref] = useState({ current: initialValue });

  return ref;
}
```

#### 내부 동작 원리

- `useRef` 는 내부적으로 `useState` 를 사용하여 구현
- `{ current: initialValue }` 형태의 객체 생성
- `useState` 의 setter 함수는 사용하지 않음
- 컴포넌트를 리렌더링해도 동일한 객체 참조 유지

#### 특징

- 객체 자체는 변경 가능하지만 객체 참조는 불변
- React는 `ref.current` 의 변경을 추적하지 않음
- 렌더링 간에 일관된 객체 참조 보장

### 1-5. Ref 사용 시기

#### Ref를 사용해야 하는 경우

- Timeout ID 저장
- DOM 엘리먼트 저장 및 조작
- JSX 를 계산하는 데 필요하지 않은 다른 객체 저장

#### Ref 사용 원칙

- 외부 시스템이나 브라우저 API 로 작업할 때 유용
- 렌더링 중에 `ref.current` 를 읽거나 쓰지 않기
- 외부 시스템이나 브라우저 API와 작업할 때 유용

### 1-6. Ref 사용 예시

#### 스톱워치 예제

```tsx
function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }
}
```

### 1-7. 주의사항

#### 1. 렌더링 중 Ref 사용 금지

- 렌더링 중에 `ref.current` 를 읽거나 쓰면 안 됨
- 컴포넌트의 동작을 예측하기 어려워짐

#### 2. Ref의 적절한 사용

- 애플리케이션 로직과 데이터 흐름의 상당 부분이 Ref 에 의존하지 않도록 주의
- 필요한 경우에만 Ref 사용

## 2. Ref로 DOM 조작하기

### 2-1. Ref의 기본 개념

#### Ref란?

- React 가 관리하는 DOM 노드에 직접 접근하는 방법
- 포커스, 스크롤, 애니메이션 등 DOM 을 직접 조작할 때 사용

### 2-2. Ref 사용 방법

#### 1. Ref 생성하기

```tsx
import { useRef } from 'react';

const myRef = useRef(null);
```

#### 2. DOM 노드에 Ref 연결하기

```tsx
<div ref={myRef}>
```

#### 3. Ref 값 접근하기

- `myRef.current` 를 통해 DOM 노드에 접근
- DOM 노드가 생성된 후에만 `current` 속성에 값이 설정됨

### 2-3. Ref 사용 시기

#### Ref를 사용해야 하는 경우

- 포커스 관리
- 스크롤 위치 조정
- 애니메이션 트리거
- DOM 요소의 크기/위치 측정
- 서드파티 DOM 라이브러리 통합

#### Ref 사용 원칙

- DOM 조작이 불가피한 경우에만 Ref 사용
- 가능한 React 의 state 와 props 로 해결

### 2-4. Ref 사용 예시

#### 포커스 관리 예제

```tsx
function TextInputWithFocusButton() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

### 2-5. Ref 콜백을 사용한 Ref 리스트 관리

#### Ref 콜백이란?

- ref 속성에 함수를 전달하는 방식
- DOM 노드가 마운트되거나 언마운트될 때 호출됨
- 동적으로 생성되는 여러 요소의 ref 를 관리할 때 유용

#### Ref 콜백 사용 방법

```tsx
function CatFriends() {
  const itemsRef = useRef(new Map());

  function scrollToId(itemId) {
    const node = itemsRef.current.get(itemId);

    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>Tom</button>
        <button onClick={() => scrollToId(1)}>Maru</button>
        <button onClick={() => scrollToId(2)}>Jellylorum</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, index) => (
            <li
              key={cat.id}
              ref={node => {
                if (node) {
                  itemsRef.current.set(cat.id, node);
                } else {
                  itemsRef.current.delete(cat.id);
                }
              }}
            >
              <img src={cat.imageUrl} alt={'Cat #' + cat.id} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

#### 특징

- Map 객체를 사용하여 여러 ref 를 관리
- 요소가 제거될 때 자동으로 ref 정리
- 동적으로 생성되는 요소들의 ref 를 효율적으로 관리

#### 주의사항

- Map 객체를 사용할 때는 초기화를 useRef 내부에서 수행
- 불필요한 ref 는 정리하여 메모리 누수 방지
- ref 콜백은 렌더링마다 호출될 수 있으므로 성능 고려 필요

### 2-6. 명령형 처리방식으로 하위 API 노출하기

#### useImperativeHandle이란?

- 부모 컴포넌트에 노출할 메서드를 커스터마이즈할 수 있는 Hook
- `forwardRef` 와 함께 사용하여 컴포넌트의 ref 를 커스터마이즈
- 컴포넌트의 내부 구현을 캡슐화하면서 필요한 기능만 노출 가능

#### 사용 방법

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef.current.focus();
        },
        scrollIntoView() {
          inputRef.current.scrollIntoView();
        },
      };
    },
    [],
  );

  return <input {...props} ref={inputRef} />;
});
```

#### 특징

- 부모 컴포넌트에서 필요한 메서드만 선택적으로 노출
- 컴포넌트의 내부 구현을 숨기면서 필요한 기능만 제공
- DOM 노드 전체를 노출하는 대신 특정 메서드만 노출 가능

#### 주의사항

- 필요한 메서드만 노출하여 컴포넌트의 캡슐화 유지
- `useImperativeHandle` 의 의존성 배열 적절히 관리
- 부모 컴포넌트에서 ref 를 통해 호출할 수 있는 메서드를 명확히 문서화

### 2-7. flushSync로 state 변경을 동기적으로 플러시하기

#### flushSync란?

- React 의 state 업데이트를 즉시 동기적으로 처리하도록 강제하는 함수
- DOM 업데이트를 즉시 반영해야 하는 특수한 경우에 사용
- 일반적인 React 의 배치(batch) 업데이트를 우회

#### 사용 방법

```tsx
import { flushSync } from 'react-dom';

function handleClick() {
  // 즉시 DOM 업데이트
  flushSync(() => {
    setCount(c => c + 1);
  });

  // DOM 업데이트 후 실행
  console.log(count);
}
```

#### 특징

- state 업데이트를 즉시 DOM 에 반영
- 배치 업데이트를 무시하고 동기적으로 처리
- 성능에 영향을 줄 수 있으므로 필요한 경우에만 사용

#### 주의사항

- 성능 최적화를 위해 React 는 여러 state 업데이트를 배치로 처리
- `flushSync` 는 이 배치 처리를 무시하고 즉시 DOM 을 업데이트
- 불필요한 사용은 성능 저하를 일으킬 수 있음
- DOM 측정이나 애니메이션과 같이 즉각적인 DOM 업데이트가 필요한 경우에만 사용

### 2-8. 주의사항

#### 1. Ref 사용 제한

- React가 관리하는 DOM 노드를 직접 수정하지 않기
- React의 선언적 프로그래밍 모델을 우선시
- 필요한 경우에만 Ref 사용

#### 2. Ref의 적절한 사용

- DOM 조작이 불가피한 경우에만 사용
- 가능한 React의 state와 props로 해결
- 서드파티 DOM 라이브러리와의 통합 시 활용

## 3. Effect로 동기화하기

### 3-1. Effect의 기본 개념

#### Effect란?

- 컴포넌트를 외부 시스템과 동기화할 때 사용
- 렌더링 후 코드를 실행하여 React 외부 시스템과 컴포넌트를 동기화
- 이벤트가 아닌 렌더링에 의해 직접 발생하는 부수 효과 처리

### 3-2. Effect와 이벤트의 차이점

#### Effect

- 렌더링 자체에 의해 발생하는 부수 효과
- 특정 상호작용과 무관하게 발생
- 컴포넌트가 화면에 표시될 때 실행

#### 이벤트

- 특정 사용자 상호작용에 의해 발생
- 버튼 클릭이나 입력 등의 사용자 액션에 반응
- 명시적인 트리거가 있는 경우 사용

### 3-3. Effect 사용 시기

#### Effect를 사용해야 하는 경우

- 외부 시스템과 동기화
- 서버 연결 설정
- 분석 목적의 로그 전송
- DOM 수동 변경
- 애니메이션 트리거
- 데이터 페칭

### 3-4. Effect 작성 방법

#### 1. Effect 선언하기

```tsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Effect 코드
  });
}
```

#### 2. Effect의 의존성 지정하기

```tsx
useEffect(() => {
  // Effect 코드
}, [dependency1, dependency2]);
```

#### 3. Ref 와 의존성 배열

- ref 객체는 React 에 의해 안정적인 객체로 보장됨
- ref 객체의 `current` 속성은 변경되어도 ref 객체 자체는 동일한 참조 유지
- 따라서 ref 를 의존성 배열에 포함할 필요가 없음
- ref 객체는 렌더링 간에 일관된 참조를 유지하므로 Effect 의 재실행을 트리거하지 않음

#### 4. 클린업 추가하기

```tsx
useEffect(() => {
  // Effect 코드

  return () => {
    // 클린업 코드
  };
}, []);
```

### 3-5. Effect 사용 시 주의사항

#### 1. 불필요한 Effect 피하기

- 렌더링을 위한 데이터 변환
- 사용자 이벤트 핸들러
- 애플리케이션 초기화
- 제품 구매 로직

#### 2. Effect 의존성 관리

- Effect 내부에서 사용되는 모든 반응형 값은 의존성 배열에 포함
- 빈 의존성 배열(`[]`)은 컴포넌트 마운트 시에만 실행
- 의존성 배열은 Effect 내부의 코드에 의해 결정

#### 3. 개발 환경에서의 동작

- Strict Mode 에서는 컴포넌트를 두 번 마운트함
- 개발 환경에서만 적용하는 동작
- Effect 의 스트레스 테스트를 위한 것

### 3-6. Effect 사용 예시

#### 채팅 서버 연결 예제

```tsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);
}
```

### 3-7. Effect와 렌더링의 관계

- 각 렌더링은 고유한 Effect 를 가짐
- Effect 는 렌더링 시점의 props 와 state 값을 보관함
- Effect 내부의 코드는 렌더링이 발생한 시점의 값을 참조
- 클린업 함수도 해당 렌더링의 props 와 state 값을 참조
- React 는 다음 Effect를 실행하기 전에 이전 Effect 의 클린업을 실행

### 5-7. 전역 또는 변경 가능한 값의 종속성

#### 전역 값의 종속성

- 전역 변수나 모듈 수준의 값은 의존성으로 사용할 수 없음
- 이러한 값들은 React의 반응성 시스템에 포함되지 않음
- 변경되어도 컴포넌트가 리렌더링되지 않음

#### 변경 가능한 값의 종속성

- `ref.current`와 같은 변경 가능한 값은 의존성으로 사용하지 않음
- 변경되어도 React가 변경을 감지하지 못함
- 의존성 배열에 포함해도 효과가 없음

#### 올바른 의존성 사용

```tsx
let globalValue = 0;

function MyComponent() {
  useEffect(() => {
    console.log(globalValue);
  }, [globalValue]); // 전역 변수는 의존성으로 사용할 수 없음
}
```

```tsx
function MyComponent() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    console.log(value);
  }, [value]); // state 는 올바른 의존성
}
```

#### 주의사항

1. 전역 값 사용 시

   - 전역 값을 state로 변환하여 사용
   - Context API를 사용하여 전역 상태 관리
   - 전역 값의 변경을 감지할 수 있는 방법 구현

2. 변경 가능한 값 사용 시

   - `ref.current`는 의존성 배열에서 제외
   - 변경 가능한 값의 변경을 감지하려면 state 사용
   - 불변성을 유지하는 방식으로 데이터 관리

3. 린터 규칙
   - React의 린터는 전역 값이나 변경 가능한 값을 의존성으로 사용하는 것을 감지
   - 린터 경고를 무시하지 말고 올바른 방식으로 수정
   - 의존성 배열은 반응형 값만 포함해야 함

## 4. Effect가 필요하지 않은 경우

### 4-1. Effect가 필요하지 않은 상황

#### Effect가 불필요한 경우

- 렌더링을 위한 데이터 변환
- 사용자 이벤트 처리
- 애플리케이션 초기화
- 제품 구매 로직

#### Effect가 필요한 경우

- 외부 시스템과의 동기화
- 서버 연결 설정
- 분석 목적의 로그 전송
- DOM 수동 변경
- 애니메이션 트리거
- 데이터 페칭

### 4-2. 데이터 변환

#### 렌더링 중 데이터 변환 (권장)

```tsx
function TodoList({ todos, filter }) {
  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
}
```

#### Effect로 데이터 변환 (비권장)

```tsx
function TodoList({ todos, filter }) {
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(
      todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      }),
    );
  }, [todos, filter]);
}
```

### 4-3. 사용자 이벤트 처리

#### 이벤트 핸들러에서 처리 (권장)

```tsx
function ProductPage({ product, addToCart }) {
  function handleBuyClick() {
    addToCart(product);
    showNotification('Added to cart!');
  }
}
```

#### Effect로 처리 (비권장)

```tsx
function ProductPage({ product, addToCart }) {
  useEffect(() => {
    if (isInCart) {
      showNotification('Added to cart!');
    }
  }, [isInCart]);
}
```

### 4-4. 계산이 비싼지 판단하는 방법

#### 계산 비용 측정 방법

- 개발자 도구의 성능 탭에서 렌더링 시간 측정
- 일반적으로 1ms 이상 걸리는 계산은 비용이 많이 드는 것으로 간주
- 실제 사용자의 기기에서 성능 테스트 필요

#### 비용이 많이 드는 계산의 예시

```tsx
const visibleTodos = todos.filter(todo => {
  return todo.text.toLowerCase().includes(searchText.toLowerCase());
});
```

#### useMemo로 최적화하기

```tsx
const visibleTodos = useMemo(() => {
  return todos.filter(todo => {
    return todo.text.toLowerCase().includes(searchText.toLowerCase());
  });
}, [todos, searchText]);
```

#### 주의사항

- 모든 계산에 useMemo를 사용하지 않기
- 실제로 성능 문제가 있는 경우에만 최적화
- 개발 환경과 프로덕션 환경의 성능 차이 고려
- 불필요한 최적화는 오히려 성능을 저하시킬 수 있음

### 4-5. 애플리케이션 초기화

#### 컴포넌트 최상위 레벨에서 초기화 (권장)

```tsx
function App() {
  const [isDark, setIsDark] = useState(false);
  const [items, setItems] = useState([]);
}
```

#### Effect로 초기화 (비권장)

```tsx
function App() {
  const [isDark, setIsDark] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setIsDark(localStorage.getItem('darkMode') === 'true');
    setItems(JSON.parse(localStorage.getItem('items') || '[]'));
  }, []);
}
```

### 4-6. 부모 컴포넌트와의 통신

#### Props로 상태 변경 알리기 (권장)

```tsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }
}
```

#### Effect로 변경 사항 알리기 (비권장)

```tsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange]);
}
```

### 4-7. 주의사항

#### 1. Effect 사용 원칙

- 렌더링을 위한 데이터 변환은 Effect 없이 처리
- 사용자 이벤트는 이벤트 핸들러에서 처리
- 외부 시스템과의 동기화에만 Effect 사용

#### 2. Effect 최적화

- 불필요한 Effect 제거로 코드 단순화
- 성능 향상 및 버그 가능성 감소
- React의 선언적 프로그래밍 모델 준수

### 4-8. useSyncExternalStore

#### useSyncExternalStore란?

- 외부 store 를 구독할 수 있는 hook
- 컴포넌트를 외부 데이터 소스와 동기화할 때 사용
- 서버 렌더링과 클라이언트 하이드레이션 지원

#### 기본 사용법

```tsx
import { useSyncExternalStore } from 'react';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
}
```

#### 주요 매개변수

##### subscribe

> store 를 구독하는 함수

- store 가 변경될 때 callback 을 호출
- 구독 취소 함수를 반환해야 함

##### getSnapshot

> store 의 현재 스냅샷을 반환하는 함수

- 불변 데이터를 반환해야 함
- store 가 변경되지 않았다면 동일한 값을 반환

##### getServerSnapshot

> (선택): 서버 렌더링을 위한 초기 스냅샷 함수

- 서버와 클라이언트 간 동일한 데이터 보장
- 서버 렌더링 시 필수

#### 사용 예시

```tsx
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

#### 주의사항

##### getSnapshot 반환값

- 불변 데이터를 반환해야 함
- 매번 새로운 객체를 반환하면 무한 루프 발생 가능

###### subscribe 함수

- 컴포넌트 외부에서 정의하거나 useCallback 으로 메모이제이션
- 리렌더링마다 새로운 함수가 생성되면 불필요한 재구독 발생

##### 서버 렌더링

- `getServerSnapshot` 이 서버와 클라이언트에서 동일한 데이터 반환 보장
- 브라우저 API 사용 시 서버 렌더링 고려 필요

## 5. React Effect의 생명주기

### 5-1. Effect의 생명주기 기본 개념

#### Effect의 생명주기

- 컴포넌트와는 다른 독립적인 생명주기를 가짐
- 동기화 시작과 중지의 두 가지 작업만 수행
- props 와 state 의 변화에 따라 여러 번 발생 가능

### 5-2. Effect의 동기화 과정

#### 동기화 시작

```tsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();

  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

#### 동기화 중지

- cleanup 함수를 통해 동기화 중지 처리
- 다음 Effect 실행 전에 이전 Effect 의 cleanup 실행
- 컴포넌트 마운트 해제 시에도 cleanup 실행

### 5-3. Effect의 재동기화

#### 재동기화가 필요한 경우

- 의존성 배열의 값이 변경될 때
- 컴포넌트가 리렌더링될 때
- props 나 state 가 변경될 때

#### 재동기화 과정

1. 이전 Effect 의 cleanup 실행
2. 새로운 Effect 실행
3. 새로운 cleanup 함수 준비

### 5-4. Effect의 의존성 관리

#### 의존성 배열의 역할

- Effect 가 언제 재실행되어야 하는지 결정
- React 가 린터를 통해 의존성 확인
- 최신 props 와 state 와의 동기화 보장

#### 의존성 규칙

- Effect 내부에서 사용되는 모든 반응형 값은 의존성 배열에 포함
- 빈 의존성 배열(`[]`)은 컴포넌트 마운트 시에만 실행
- 의존성 배열은 Effect 내부의 코드에 의해 결정

### 5-5. Effect 작성 시 주의사항

#### 1. Effect의 독립성

- 각 Effect 는 독립적인 동기화 프로세스
- 컴포넌트의 생명주기와 분리하여 생각
- 외부 시스템과의 동기화에 집중

#### 2. Effect의 의존성

- 모든 반응형 값을 의존성 배열에 포함
- 린터 규칙을 준수하여 의존성 관리
- 불필요한 재실행 방지

#### 3. Effect의 클린업

- 모든 Effect 는 클린업 함수를 반환할 수 있음
- 클린업 함수는 다음 Effect 실행 전에 호출
- 리소스 누수 방지를 위한 필수적인 단계

### 5-6. Effect 최적화

#### 1. 불필요한 Effect 제거

- 렌더링을 위한 데이터 변환은 Effect 없이 처리
- 사용자 이벤트는 이벤트 핸들러에서 처리
- 외부 시스템과의 동기화에만 Effect 사용

#### 2. Effect 분리

- 각 Effect 는 하나의 동기화 목적만 가져야 함
- 관련 없는 로직은 별도의 Effect 로 분리
- 코드의 가독성과 유지보수성 향상

#### 3. Effect의 의존성 최적화

- 필요한 의존성만 포함
- 불필요한 재실행 방지
- 성능 최적화를 위한 의존성 관리

### 5-7. 전역 또는 변경 가능한 값의 종속성

#### 전역 값의 종속성

- 전역 변수나 모듈 수준의 값은 의존성으로 사용할 수 없음
- 이러한 값들은 React 의 반응성 시스템에 포함되지 않음
- 변경되어도 컴포넌트가 리렌더링되지 않음

#### 변경 가능한 값의 종속성

- `ref.current`와 같은 변경 가능한 값은 의존성으로 사용하지 않음
- 변경되어도 React가 변경을 감지하지 못함
- 의존성 배열에 포함해도 효과가 없음

#### 올바른 의존성 사용

```tsx
let globalValue = 0;

function MyComponent() {
  useEffect(() => {
    console.log(globalValue);
  }, [globalValue]); // 전역 변수는 의존성으로 사용할 수 없음
}
```

```tsx
function MyComponent() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    console.log(value);
  }, [value]); // state 는 올바른 의존성
}
```

#### 주의사항

##### 전역 값 사용 시

- 전역 값을 state 로 변환하여 사용
- Context API 를 사용하여 전역 상태 관리
- 전역 값의 변경을 감지할 수 있는 방법 구현

##### 변경 가능한 값 사용 시

- `ref.current`는 의존성 배열에서 제외
- 변경 가능한 값의 변경을 감지하려면 state 사용
- 불변성을 유지하는 방식으로 데이터 관리

##### 린터 규칙

- React 의 린터는 전역 값이나 변경 가능한 값을 의존성으로 사용하는 것을 감지
- 린터 경고를 무시하지 말고 올바른 방식으로 수정
- 의존성 배열은 반응형 값만 포함해야 함

## 6. Effect에서 이벤트 분리하기

### 6-1. 이벤트와 Effect의 차이점

#### 이벤트 핸들러

- 특정 상호 작용에 대한 응답으로 실행
- 사용자 액션에 반응

#### Effect

- prop 이나 state 변수와 같은 값이 변경되면 재실행
- 외부 시스템과의 동기화에 사용

### 6-2. 이벤트 핸들러와 Effect 선택 기준

#### 이벤트 핸들러 사용 시기

- 버튼 클릭이나 폼 제출과 같은 명시적인 트리거가 있는 경우
- 사용자 액션에 직접 반응해야 하는 경우

#### Effect 사용 시기

- 외부 시스템과의 동기화
- DOM 수동 변경

### 6-3. Effect 이벤트

#### Effect 이벤트란?

- Effect 의 일부 코드가 특정 값의 변경에 반응하지 않도록 함
- `useEffectEvent` Hook 을 사용하여 구현

#### Effect 이벤트 사용 방법

```tsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('message', onMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

### 6-4. Effect 이벤트의 제한 사항

#### 사용 제한

- Effect 내부에서만 호출 가능
- 다른 컴포넌트나 Hook 에 전달 불가
- Effect 의 비반응형 로직에만 사용

#### 주의사항

- Effect 이벤트는 Effect 의 코드 중 비반응형인 부분만 추출
- Effect 이벤트는 자신을 사용하는 Effect 근처에 위치해야 함
- 불필요한 의존성 제거를 위해 신중하게 사용

### 6-5. Effect 이벤트 사용 시기

#### Effect 이벤트를 사용해야 하는 경우

- Effect 내부의 일부 코드가 특정 값의 변경에 반응하지 않아야 할 때
- 불필요한 Effect 재실행을 방지하고 싶을 때
- Effect 의 의존성 배열을 최적화하고 싶을 때

#### Effect 이벤트를 사용하지 말아야 하는 경우

- Effect 전체가 반응형이어야 하는 경우
- 이벤트 핸들러로 처리할 수 있는 경우
- 컴포넌트 간 로직 공유가 필요한 경우

### 6-6. Effect 이벤트 최적화

#### 최적화 방법

- Effect 내부의 비반응형 로직 식별
- 해당 로직을 Effect 이벤트로 추출
- 의존성 배열에서 불필요한 의존성 제거

#### 주의사항

- Effect 이벤트는 성능 최적화를 위한 도구
- 과도한 사용은 코드 복잡성 증가
- 명확한 사용 사례가 있을 때만 적용

## 7. Effect의 의존성 제거하기

### 7-1. Effect 의존성의 기본 개념

#### 의존성 제거의 필요성

- Effect 가 너무 자주 실행되는 문제 해결
- 무한 루프 방지
- 불필요한 동기화 작업 최소화

### 7-2. 의존성 제거 방법

#### 1. Effect 이벤트 사용하기

```tsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('message', onMessage);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

#### 2. 객체 의존성 제거하기

```tsx
// 비권장
function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
}
```

```tsx
// 권장
function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

### 7-3. 의존성 제거 시 주의사항

#### 1. 린터 규칙 준수

- 린터 경고를 무시하지 않고 올바른 방식으로 수정
- 의존성 배열은 반응형 값만 포함
- 불필요한 의존성 제거 시 코드의 정확성 보장

### 7-4. 의존성 제거 시기

#### Effect 이벤트를 사용해야 하는 경우

- Effect 내부의 일부 코드가 특정 값의 변경에 반응하지 않아야 할 때
- 불필요한 Effect 재실행을 방지하고 싶을 때
- Effect 의존성 배열을 최적화하고 싶을 때

#### Effect 이벤트를 사용하지 말아야 하는 경우

- Effect 전체가 반응형이어야 하는 경우
- 이벤트 핸들러로 처리할 수 있는 경우
- 컴포넌트 간 로직 공유가 필요한 경우

### 7-5. 의존성 제거 최적화

#### 최적화 방법

- Effect 내부의 비반응형 로직 식별
- 해당 로직을 Effect 이벤트로 추출
- 의존성 배열에서 불필요한 의존성 제거

#### 주의사항

- Effect 이벤트는 성능 최적화를 위한 도구
- 과도한 사용은 코드 복잡성 증가
- 명확한 사용 사례가 있을 때만 적용

## 8. 커스텀 Hook으로 로직 재사용하기

### 8-1. 커스텀 Hook의 기본 개념

#### 커스텀 Hook이란?

- React 의 내장 Hook을 조합하여 만든 재사용 가능한 로직
- 컴포넌트 간 로직을 공유하기 위한 방법
- `use` 로 시작하는 이름을 가진 함수

### 8-2. 커스텀 Hook 작성 방법

#### 1. Hook 이름 규칙

```tsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  // ...
}
```

#### 2. Hook 구현 방법

```tsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

### 8-3. 커스텀 Hook 사용 시기

#### Hook을 사용해야 하는 경우

- 여러 컴포넌트에서 동일한 로직을 사용할 때
- 복잡한 로직을 컴포넌트에서 분리하고 싶을 때
- 상태 관리 로직을 재사용하고 싶을 때

#### Hook 사용 원칙

- Hook은 최상위 레벨에서만 호출
- React 함수 컴포넌트나 다른 Hook에서만 호출
- 조건문, 반복문, 중첩된 함수 내에서 호출하지 않음

### 8-4. 커스텀 Hook의 특징

#### 1. 상태 공유

- Hook 은 상태 저장 로직만 공유
- 각 컴포넌트는 Hook 의 상태를 독립적으로 가짐
- 컴포넌트 간 상태는 공유되지 않음

#### 2. 반응형 값 전달

- Hook 간에 반응형 값 전달
- 전달된 값은 항상 최신 상태 유지
- 의존성 배열을 통한 값 변경 감지

### 8-5. 커스텀 Hook 사용 예시

#### 온라인 상태 확인 Hook

```tsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### 8-6. 주의사항

#### 1. Hook 이름 규칙

- `use` 로 시작하는 이름 사용

#### 2. Hook의 순수성

- Hook 코드는 컴포넌트처럼 순수해야 함
- 렌더링 중에 예측 가능한 결과를 반환해야 함
- 부수 효과는 useEffect 내부에서 처리

#### 3. 이벤트 핸들러

- Hook 에서 반환하는 이벤트 핸들러는 Effect 로 감싸야 함
- 불필요한 재생성 방지
- 의존성 배열 관리 필요
