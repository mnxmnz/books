---
sidebar_position: 27
---

# 아이템 27 함수형 기법과 라이브러리로 타입 흐름 유지하기

내장된 `Array.prototype.map` 대신 `_.map` 을 사용하려는 이여 중 하나는 콜백을 전달하는 대신 속성의 이름을 전달할 수 있기 때문이다.

다음 세 가지 종류의 호출은 모두 같은 결과를 낸다.

```ts
import _ from 'lodash';

interface BasketballPlayer {
  name: string;
  team: string;
  salary: number;
}

declare const rosters: { [team: string]: BasketballPlayer[] };

const allPlayers = Object.values(rosters).flat();

const namesA = allPlayers.map(player => player.name); // 타입: string[]
const namesB = _.map(allPlayers, player => player.name); // 타입: string[]
const namesC = _.map(allPlayers, 'name'); // 타입: string[]
```

- 타입스크립트의 타입 시스템이 정교하기 때문에 앞의 예제처럼 다양한 동작을 정확히 모델링할 수 있다. 함수 내부적으로는 문자열 리터럴 타입과 인덱스 타입의 조합으로만 이루어져 있기 때문에 타입이 자연스럽게 도출된다.

내장된 함수형 기법들과 로대시 같은 라이브러리에 타입 정보가 잘 유지되는 것은 우연이 아니다. 함수 호출 시 전달된 매개변수 값을 건드리지 않고 매번 새로운 값을 반환함으로써, 새로운 타입으로 안전하게 반환할 수 있다.

타입스크립트의 많은 부분이 자바스크립트의 라이브러리의 동작을 정확히 모델링하기 위해서 개발되었다. 그러므로 라이브러리를 사용할 때 타입 정보가 잘 유지되는 점을 십분 활용해야 타입스크립트의 원래 목적을 달성할 수 있다.

## 요약

- 타입 흐름을 개선하고, 가독성을 높이고, 명시적인 타입 구문의 필요성을 줄이기 위해 직접 구현하기보다는 내장된 함수형 기법과 로대시 같은 유틸리티 라이브러리를 사용하는 것이 좋다.

:::note

찬/반

- 라이브러리에 문제가 생겼을 때 책임 소재는?
- 이러한 찬/반 소재에 대해 대화를 하다보면 프레임워크에 대한 회의도 함
- ex. 과연 리액트를 사용하는 것이 바닐라 자바스크립트보다 나은 것인지?

:::
