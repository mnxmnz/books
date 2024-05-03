---
sidebar_position: 55
---

# 아이템 55 DOM 계층 구조 이해하기

DOM 계층의 타입

| 타입              | 예시                         |
| ----------------- | ---------------------------- |
| EventTarget       | window, XMLHttpRequest       |
| Node              | document, Text, Comment      |
| Element           | HTMLElement, SVGElement 포함 |
| HTMLElement       | `<i>`, `<b>`                 |
| HTMLButtonElement | `<button>`                   |

```ts
function handleDrag(eDown: Event) {
  const targetEl = eDown.currentTarget;
  targetEl.classList.add('dragging');
  // 'targetEl'은(는) 'null'일 수 있습니다.
  // 'EventTarget' 형식에 'classList' 속성이 없습니다.
}
```

- `Event` 의 `currentTarget` 속성의 타입은 `EventTarget | null` 이다.
- `eDown.currentTarget` 은 실제로 `HTMLElement` 타입이지만, 타입 관점에서는 `window` 나 `XMLHttpRequest` 가 될 수도 있다는 것을 주의하자.

```html
<p>
  And <i>yet</i> it moves
  <!-- quote from Galileo -->
</p>
```

```
**> p.children**
HTMLCollection [i]

**> p.childNodes**
NodeList(5) [text, i, text, comment, text]
```

- `children`: 자식 엘리먼트(`<i>yet</i>`)를 포함하는 배열과 유사한 구조인 HTMLCollection
- `childNodes`: 배열과 유사한 Node 의 컬렉션인 NodeList, 엘리먼트(`<i>yet</i>`)뿐만 아니라 텍스트 조각(”And”, “it moves”)과 주석(”quote from Galileo”)까지 포함

```js
document.getElementsByTagName('p')[0]; // HTMLParagraphElement
document.createElement('button'); // HTMLButtonElement
document.querySelector('div'); // HTMLDivElement
```

Event 타입

| UIEvent       | 모든 종류의 사용자 인터페이스 이벤트  |
| ------------- | ------------------------------------- |
| MouseEvent    | 클릭처럼 마우스로부터 발생되는 이벤트 |
| TouchEvent    | 모바일 기기의 터치 이벤트             |
| WheelEvent    | 스크롤 휠을 돌려서 발생되는 이벤트    |
| KeyboardEvent | 키 누름 이벤트                        |

## 요약

- DOM 에는 타입 계층 구조가 있다. DOM 타입은 타입스크립트에서 중요한 정보이며 브라우저 관련 프로젝트에서 타입스크립트를 사용할 때 유용하다.
- `Node`, `Element`, `HTMLElement`, `EventTarget` 간의 차이점과 `Event` 와 `MouseEvent` 의 차이점을 알아야 한다.
- DOM 엘리먼트와 이벤트에는 충분히 구체적인 타입 정보를 사용하거나 타입스크립트가 추론할 수 있도록 문맥 정보를 활용해야 한다.

- DOM 직접 핸들링 → addEventListener → event propagation 발생 → 하나의 DOM 만 선택해도 많은 DOM 을 선택한 것과 같은 결과 → 사이드 이펙트 발생하면 추적 어려움
