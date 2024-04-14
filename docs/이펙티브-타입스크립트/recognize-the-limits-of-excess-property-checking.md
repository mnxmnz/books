---
sidebar_position: 11
---

# 아이템 11 잉여 속성 체크의 한계 인지하기

:::note

대부분 잉여가 아닌 ‘초과’로 번역한다.

:::

타입이 명시된 변수에 객체 리터럴을 할당할 때 타입스크립트는 해당 타입의 속성이 있는지, 그리고 ‘그 외 속성은 없는지’ 확인한다.

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
  // ERROR: 개체 리터럴은 알려진 속성만 지정할 수 있으며 'ROOM' 형식에 'elephant' 가 없음
};
```

```ts
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
};

const r: Room = obj; // OK
```

첫 번째 예제는 구조적 타입 시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 “잉여 속성 체크”라는 과정이 수행되었다. 잉여 속성 체크 역시 조건에 따라 동작하지 않는다는 한계가 있고, 통상적인 할당 가능 검사와 함께 쓰이면 구조적 타이핑이 무엇인지 혼란스러워질 수 있다.

```ts
interface Options {
  title: string;
  darkMode?: boolean;
}

const o1: Options = document;
const o2: Options = new HTMLAnchorElement();
```

`document` 와 `HTMLAnchorElement` 의 인스턴스 모두 `string` 타입인 `title` 속성을 가지고 있기 때문에 할당문은 정상이다.

잉여 속성 체크를 이용하면 기본적으로 타입 시스템의 구조적 본질을 해치지 않으면서도 객체 리터럴에 알 수 없는 속성을 허용하지 않음으로써, 앞에서 다룬 `Room` 이나 `Options` 예제 같은 문제점을 방지할 수 있다.

`document` 나 `new HTMLAnchorElement` 는 객체 리터럴이 아니기 때문에 잉여 속성 체크가 되지 않는다. 그러나 `{ title, darkmode }` 객체는 체크가 된다.

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

interface Options {
  title: string;
  darkMode?: boolean;
}

const o: Options = { darkmode: true, title: 'Ski Free' };
// ERROR: 'Options' 형식에 'darkmode' 가 없음
```

```ts
const intermediate = { darkmode: true, title: 'Ski Free' };

const o: Options = intermediate; // OK
```

첫 번째 줄의 오른쪽은 객체 리터럴이지만, 두 번째 줄의 오른쪽은 객체 리터럴이 아니다. 따라서 잉여 속성 체크가 적용되지 않고 오류는 사라진다.

타입 단언문을 사용할 때에도 적용되지 않는다.

```ts
const o = { darkmode: true, title: 'Ski Free' } as Options; // OK
```

잉여 속성 체크는 구조적 타이핑 시스템에서 허용되는 속성 이름의 오타 같은 실수를 잡는 데 효과적인 방법이다. 선택적 필드를 포함하는 `Options` 같은 타입에 특히 유용한 반면, 적용 범위도 매우 제한적이며 오직 객체 리터럴에만 적용된다. 이러한 한계점을 인지하고 잉여 속성 체크와 일반적인 타입 체크를 구분한다면, 두 가지 모두의 개념을 잡는 데에 도움이 될 것이다.

- 관련 자료: [타입스크립트 잉여 속성 검사 원리 이해하기](https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B0%9D%EC%B2%B4-%ED%83%80%EC%9E%85-%EC%B2%B4%ED%82%B9-%EC%9B%90%EB%A6%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)

:::note

잉여 속성 체크 도입 이유

잉여 속성 체크 라는 개념을 도입해서 오히려 타입스크립트가 의도한 대로 동작하지 않는 것은 아닌지?

- 도입한 히스토리를 알면 이해할 수 있을 거 같다. (관련 이슈나 릴리즈 노트 찾아보기)
- 타입을 좁힌 후 어려움을 겪음 → 넓힘
- 타입에 자유도가 높아서 어려움을 겪음 → 좁힘

:::

## 요약

- 객체 리터럴을 변수에 할당하거나 함수에 매개변수로 전달할 때 잉여 속성 체크가 수행된다.
- 잉여 속성 체크는 오류를 찾는 효과적인 방법이지만, 타입스크립트 타입 체커가 수행하는 일반적인 구조적 할당 가능성 체크와 역할이 다르다. 할당의 개념을 정확히 알아야 잉여 속성 체크와 일반적인 구조적 할당 가능성 체크를 구분할 수 있다.
- 잉여 속성 체크에는 한계가 있다. 임시 변수를 도입하면 잉여 속성 체크를 건너뛸 수 있다는 점을 기억해야 한다.
