---
sidebar_position: 49
---

# 아이템 49 콜백에서 this 에 대한 타입 제공하기

```ts
class C {
  vals = [1, 2, 3];
  logSquares() {
    for (const val of this.vals) {
      console.log(val * val);
    }
  }
}

const c = new C();

c.logSquares();
```

```ts
const c = new C();
const method = c.logSquares;

method();
// Cannot read properties of undefined (reading 'vals')
```

- `c.logSquares()` 가 실제로는 두 가지 작업을 수행해서 문제가 발생한다.
  - `C.prototype.logSquares` 를 호출하고 `this` 의 값을 `c` 로 바인딩한다.
- `logSquares` 의 참조 변수를 사용함으로써 두 가지 작업을 분리했고 `this` 의 값은 `undefined` 로 설정된다.

```ts
const c = new C();
const method = c.logSquares;

method.call(c);
```

- `call` 을 사용하면 명시적으로 `this` 를 바인딩하여 문제를 해결할 수 있다.

클래스 내에서 `onClick` 핸들러를 정의하면 다음과 같다.

```ts
declare function makeButton(props: { text: string; onClick: () => void }): void;

class ResetButton {
  render() {
    return makeButton({ text: 'Reset', onClick: this.onClick });
  }
  onClick() {
    alert(`Reset ${this}`);
  }
}
```

- `ResetButton` 에서 `onClick` 을 호출하면 `this` 바인딩 문제로 인해 “Reset undefined” 라는 경고를 표시한다.

생성자에서 메서드에 `this` 를 바인딩해서 해결할 수 있다.

```ts
class ResetButton {
  constructor() {
    this.onClick = this.onClick.bind(this);
  }
  render() {
    return makeButton({ text: 'Reset', onClick: this.onClick });
  }
  onClick() {
    alert(`Reset ${this}`);
  }
}
```

- 생성자에서 `this.onClick` 으로 바인딩하면 `onClick` 속성에 `this` 가 바인딩되어 해당 인스턴스에 생성된다.
- 속성 탐색 순서에서 `onClick` 인스턴스 속성은 `onClick` 프로토타입 속성보다 앞에 놓이므로 `render()` 메서드의 `this.onClick` 은 바인딩된 함수를 참조하게 된다.

더 간단한 방법으로도 해결할 수 있다.

```ts
class ResetButton {
  render() {
    return makeButton({ text: 'Reset', onClick: this.onClick });
  }
  onClick = () => {
    alert(`Reset ${this}`);
  };
}
```

- `onClick` 을 화살표 함수로 변경하면 `ResetButton` 이 생성될 때마다 제대로 바인딩된 `this` 를 가지는 새 함수를 생성하게 된다.

콜백을 화살표 함수로 작성하고 `this` 를 참조하면 타입 오류가 발생한다.

```ts
declare function makeButton(props: { text: string; onClick: () => void }): void;

function addKeyListener(el: HTMLElement, fn: (this: HTMLElement, e: KeyboardEvent) => void) {
  el.addEventListener('keydown', e => {
    fn(e);
    // 'void' 형식의 'this' 컨텍스트를 메서드의 'HTMLElement' 형식 'this'에 할당할 수 없습니다.
  });
}

class Foo {
  registerHandler(el: HTMLElement) {
    addKeyListener(el, e => {
      this.innerHTML;
      // 'Foo' 형식에 'innerHTML' 속성이 없습니다.
    });
  }
}
```

## 요약

- `this` 바인딩이 동작하는 원리를 이해하자.
- 콜백 함수에서 `this` 를 사용해야 한다면 타입 정보를 명시하자.
