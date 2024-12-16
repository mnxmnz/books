---
sidebar_position: 1
---

# 01. 리액트 훅을 이용한 마이크로 상태 관리

## 1. 기술 요구사항

**리액트 훅**을 통해 상태 관리를 경량화, 즉 마이크로화할 수 있다.

- 전통적인 중앙 집중형 상태 관리는 범용적으로 사용된다.
- **마이크로 상태 관리**는 목표 지향적이며 특정한 코딩 패턴과 함께 사용된다.

## 2. 마이크로 상태 관리 이해하기

> **마이크로 상태 관리**: 범용적인 상태 관리를 위한 방법은 가벼워야 하며, 개발자는 요구사항에 따라 적절한 방법을 선택할 수 있어야 한다.

- 리액트의 가벼운 상태 관리라고 할 수 있으며, 각 상태 관리 방법마다 서로 다른 기능을 가지며, 개발자는 애플리케이션 요구사항에 따라 적합한 방법을 선택할 수 있다.

## 3. 리액트 훅 사용하기

AS-IS

```tsx
const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      {count}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
};
```

TO-BE

```tsx
const useCount = () => {
  const [count, setCount] = useState(0);

  return [count, setCount];
};

const Component = () => {
  const [count, setCount] = useCount();

  return (
    <div>
      {count}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
};
```

`useCount` 라는 이름을 통해 더 명확해졌다.

- 프로그래밍에서 중요한 점이다. 사용자 정의 훅을 통해 이름을 적절하게 지정하면 코드의 가독성이 더 좋아진다.

`Component` 가 `useCount` 구현과 분리됐다.

- 마이크로 상태 관리 라이브러리에서 중요하다. 컴포넌트를 건드리지 않고 기능을 추가할 수 있다.

### 3-1. 데이터 불러오기를 위한 서스펜스와 동시성 렌더링

> **데이터 불러오기를 위한 서스펜스**: 기본적으로 비동기 처리(async)에 대한 걱정 없이 컴포넌트를 코딩할 수 있는 방법이다.

> **동시성 렌더링**: 렌더링 프로세스를 청크(chunk)라는 단위로 분할해서 중앙 처리 장치(CPU)가 장시간 차단되는 것을 방지하는 방법이다.

리액트 훅 함수와 컴포넌트 함수는 여러 번 호출될 수 있다. 따라서 함수가 여러 번 호출되더라도 일관되게 동작할 수 있게 충분히 '순수'해야 한다는 규칙이 있다.

이러한 규칙을 위반하는 코드를 작성해도 비동시성 렌더링에서는 문제없이 작동하기 때문에 개발자는 잘못됐다는 것을 알아차리지 못한다. 심지어 동시성 렌더링에서도 어느 정도 문제없이 작동할 수 있어서 문제가 간헐적으로 발생할 수 있다.

## 4. 전역 상태 탐구하기

전역 상태가 싱글톤일 필요는 없으며 싱글톤이 아니라는 점을 명확히 하기 위해 전역 상태를 공유 상태라 부르기도 한다.

리액트는 컴포넌트 모델에 기반한다. 컴포넌트 모델에서는 지역성이 중요하며 이는 컴포넌트가 서로 격리돼야 하고 재사용이 가능해야 한다는 것을 의미한다.

## 5. useState 사용하기

### 5-1. 값으로 상태 갱신하기

```tsx
const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(1)}>Set count to 1</button>
    </div>
  );
};
```

버튼을 다시 클릭하면 `setCount(1)` 을 다시 호출하지만 같은 값이기 때문에 '베일아웃'되어 컴포넌트를 다시 렌더링하지 않는다.

> **베일아웃**: 리액트 기술 용어로 리렌더링을 발생시키지 않는 것을 의미한다.

```tsx
const Component = () => {
  const [state, setState] = useState({ count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => setState({ count: 1 })}>Set count to 1</button>
    </div>
  );
};
```

버튼을 다시 클릭하면 컴포넌트가 리렌더링된다.두 번째 클릭을 통해 `{ count: 1 }` 이라는 객체를 생성하는데 이것이 이전 객체와 동일하지 않기 때문이다.

```tsx
const Component = () => {
  const [state, setState] = useState({ count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button
        onClick={() => {
          state.count = 1;
          setState(state);
        }}
      >
        Set count to 1
      </button>
    </div>
  );
};
```

버튼을 클릭해도 `state` 객체가 실제로 변경되지 않았기 때문에 베일아웃되어 리렌더링이 발생하지 않는다.

### 5-2. 함수로 상태 갱신하기

```tsx
const Component = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(count => count + 1), 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count => (count % 2 === 0 ? count : count + 1))}>
        Increment count if it makes the result even
      </button>
    </div>
  );
};
```

갱신 함수가 이전 상태와 같은 상태를 반환하는 경우 베일아웃이 발생하고 컴포넌트는 리렌더링되지 않는다.

### 5-3. 지연 초기화

```tsx
const init = () => 0;

const Component = () => {
  const [count, setCount] = useState(init);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count => count + 1)}>Increment count</button>
    </div>
  );
};
```

`useState` 를 호출하기 전까지 `init` 함수는 평가되지 않고 느리게 평가된다. 컴포넌트가 마운트될 때 한 번만 호출된다.

## 6. useReducer 사용하기

### 6-1. 기본 사용법

```tsx
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'SET_TEXT':
      return { ...state, text: action.text };
    default:
      throw new Error('Unknown action type');
  }
};

const Component = () => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, { count: 0, text: 'Hi' });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment count</button>
      <input value={state.text} onChange={e => dispatch({ type: 'SET_TEXT', text: e.target.value })} />
    </div>
  );
};
```

### 6-2. 베일아웃

```tsx
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'SET_TEXT':
      if (!action.text) {
        // 베일아웃
        return state;
      }

      return { ...state, text: action.text };
    default:
      throw new Error('Unknown action type');
  }
};

const Component = () => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, { count: 0, text: 'Hi' });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment count</button>
      <input value={state.text} onChange={e => dispatch({ type: 'SET_TEXT', text: e.target.value })} />
    </div>
  );
};
```

`state` 자체를 반환하는 것이 중요하다. `{ ...state, text: action.text || state.text }` 를 반환하면 새로운 객체가 생성되기 때문에 베일아웃이 발생하지 않는다.

### 6-3. 원시 값

```tsx
const reducer = (count, delta) => {
  if (delta < 0) {
    throw new Error('Delta must be positive');
  }
  if (delta > 10) {
    return count;
  }
  if (count < 100) {
    return count + delta + 10;
  }
  return count + delta;
};
```

### 6-4. 지연 초기화(init)

```tsx
const init = (count: number): State => ({ count, text: 'Hi' });

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'SET_TEXT':
      if (!action.text) {
        return state;
      }

      return { ...state, text: action.text };
    default:
      throw new Error('Unknown action type');
  }
};

export default function Component() {
  const [state, dispatch] = useReducer<Reducer<State, Action>, number>(reducer, 0, init);

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment count</button>
      <input value={state.text} onChange={e => dispatch({ type: 'SET_TEXT', text: e.target.value })} />
    </div>
  );
}
```

`init` 함수는 `useReducer` 의 두 번째 인수인 `initialArg` 를 받는다.

## 7. useState와 useReducer의 유사점과 차이점

### 7-1. useReducer를 이용한 useState 구현

```ts
const useState = <T>(initialState: T): [T, Dispatch<SetStateAction<T>>] => {
  const [state, dispatch] = useReducer<Reducer<T, SetStateAction<T>>>(
    (prev, action) => (typeof action === 'function' ? (action as (prevState: T) => T)(prev) : action),
    initialState,
  );

  return [state, dispatch];
};
```

```ts
const reducer = <T>(prev: T, action: T | ((prev: T) => T)) =>
  typeof action === 'function' ? (action as (prev: T) => T)(prev) : action;

const useState = <T>(initialState: T) => useReducer(reducer<T>, initialState);
```

### 7-2. useState를 이용한 useReducer 구현

```ts
const useReducer = <S, A>(reducer: (state: S, action: A) => S, initialArg: S, init?: (arg: S) => S) => {
  const [state, setState] = useState(init ? () => init(initialArg) : initialArg);

  const dispatch = useCallback((action: A) => setState((prev: S) => reducer(prev, action)), [reducer]);

  return [state, dispatch];
};
```

### 7-3. 초기화 함수 사용하기

한 가지 차이점은 `reducer` 와 `init` 을 훅이나 컴포넌트 외부에서 정의할 수 있다는 점이다.

```tsx
const init = (count: number): CountState => ({ count });

const reducer = (prev: CountState, delta: number): CountState => ({
  ...prev,
  count: prev.count + delta,
});

const ComponentWithUseReducer = ({ initialCount }: CounterProps) => {
  const [state, dispatch] = useReducer(reducer, initialCount, init);

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch(1)}>+1</button>
    </div>
  );
};

const ComponentWithUseState = ({ initialCount }: CounterProps) => {
  const [state, setState] = useState<CountState>(() => init(initialCount));
  const dispatch = (delta: number) => setState(prev => reducer(prev, delta));

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch(1)}>+1</button>
    </div>
  );
};
```

### 7-4. 인라인 리듀서 사용하기

인라인 리듀서 함수는 외부 변수에 의존할 수 있다. `useReducer` 에서만 가능하며 `useState` 에서는 불가능하다.

:::note

이 기능은 일반적으로는 사용되지 않으며 꼭 필요한 경우가 아니라면 권장하지 않는다.

:::

```ts
const useScore = bonus => useReducer(((prev, delta) = prev + delta + bonus), 0);
```

`bonus` 와 `delta` 가 모두 갱신된 경우에도 올바르게 작동한다.

`useState` 를 사용하면 제대로 작동하지 않는다. 이전 렌더링에서 사용된 이전 `bonus` 값을 사용하게 된다. 이는 `useReducer` 가 렌더링 단계에서 리듀서 함수를 호출하기 때문이다.

전반적으로 특별한 기능만 제외하면 `useReducer` 와 `useState` 는 기본적으로 동일하며 상호 교환 가능하다고 말할 수 있다.
