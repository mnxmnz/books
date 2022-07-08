---
sidebar_position: 2
---

# TDD

<br />

# 1. TDD 법칙 세 가지 📌

> 클린 코드 TDD 에 대해 알아보기 전에 TDD 자체가 무엇인지에 대해 간단하게 정리해봤습니다.

## 1-1. TDD 의 의미 💭

> TDD 는 테스트가 개발을 이끌어 나가는 형태의 개발론입니다. 선 테스트 코드 작성 후 구현입니다.

이는 총 3가지 주요 절차로 이루어져 있습니다.

![tdd](https://i.imgur.com/wcbaeLC.png)

이제 3가지 주요 절차에 대해 자세히 알아보겠습니다.

## 1-2. 실패 🚫

첫 번째 절차는 실패입니다.

> 실패하는 테스트 케이스를 먼저 작성하는 것입니다.

실패하는 테스트 케이스를 만들 때는 프로젝트의 전체 기능에 대하여 처음부터 모든 테스트 케이스를 작성하는 것이 아니라, **지금 가장 먼저 구현할 기능 하나씩 테스트 케이스를 작성**합니다. 컴파일은 실패하지 않으면서 실행이 실패하는 정도로만 코드를 작성합니다.

## 1-3. 성공 🎊

두 번째 절차는 성공입니다.

> 위에서 작성한 실패하는 테스트 케이스를 통과시키기 위하여 코드를 작성하여 테스트를 통과시키는 것입니다.

## 1-4. 리팩토링 🚧

세 번째 절차는 리팩토링입니다.

> 구현한 코드에 중복되는 코드가 있거나, 혹은 더 개선할 방법이 있다면 리팩토링을 진행합니다.

리팩토링을 진행하고 나서도 테스트 케이스가 성공하는지 확인합니다. 이 절차가 끝나면, 다시 첫 번째 절차로 돌아가서 다음 기능 구현을 위하여 **새로운 실패하는 테스트 케이스를 작성**합니다.

## 1-5. 장점 👍

테스트 코드가 있으면 기존 코드 변경을 쉽게 할 수 있습니다.

> 테스트 코드는 유연성, 유지 보수성, 재사용성을 제공하는 버팀목입니다.

<br />

# 2. 깨끗한 테스트 코드 유지가 중요한 이유 ⭐

지저분한 테스트 코드의 문제점은 실제 코드가 변화하면 테스트 코드도 변해야 한다는 데 있습니다. 테스트 코드가 지저분할수록 나중에 변경하기 어렵기 때문입니다. 테스트 코드가 복잡할수록 실제 코드를 짜는 시간보다 테스트 케이스를 추가하는데 더 오랜 시간이 걸릴 수도 있습니다.

> 실제 코드를 변경해 기존 테스트 케이스가 실패하기 시작하면, 지저분한 코드로 인해, 실패하는 테스트 케이스를 점점 더 통과시키기 어려워집니다.

<br />

# 3. 깨끗한 테스트 코드 유지하는 방법 🚿

> 깨끗한 테스트가 따르는 다섯 가지 규칙(F.I.R.S.T.)에 대해 정리했습니다.

## 3-1. Fast - 빠르게 🏃‍♀️

테스트는 빨라야 합니다.

> 테스트가 느리면 자주 돌리지 못하고 이는 초반에 문제를 찾아내기 힘들게 만듭니다.

그리고 코드를 마음껏 정리하지 못해 코드 품질을 망칠 수 있습니다.

## 3-2. Independent - 독립적으로 ✨

각 테스트는 서로 의존하면 안 됩니다. 한 테스트가 다음 테스트가 실행될 환경을 준비해서는 안 됩니다.

> 각 테스트는 독립적으로 그리고 어떤 순서로 실행해도 괜찮아야 합니다.

테스트가 서로에게 의존하면 하나가 실패할 때 나머지도 잇달아 실패하므로 **원인을 진단하기 어려워지며 후반 테스트가 찾아내야 할 결함이 숨겨집니다**.

## 3-3. Repeatable - 반복가능하게 💫

테스트는 어떤 환경에서도 반복 가능해야 합니다.

> 환경이 지원하지 않으면 테스트를 수행하지 못하는 상황에 직면할 수 있습니다.

## 3-4. Self-Validating - 자가검증하는 🏆

테스트가 스스로 성공과 실패를 판단해야 합니다.

> 테스트는 부울값으로 결과를 내야 합니다.

## 3-5. Timely - 적시에 🎯

단위 테스트는 테스트하려는 **실제 코드를 구현하기 직전에 구현**합니다.

> 실제 코드를 구현한 이후에 테스트 코드를 작성하면 테스트할 수 없도록 실제 코드를 설계할 수 있습니다.

<br />

# 4. 테스트 코드 예시 📖

## 4-1. 안 좋은 예 😥

문제점 1. 함수마다 하나의 assert 문을 사용하지 않음
문제점 2. 함수마나 하나의 개념만 사용하지 않음

```js
const assert = require('assert');

describe('MakeMomentJSGreatAgain', () => {
  it('handles date boundaries', () => {
    let date;

    date = new MakeMomentJSGreatAgain('1/1/2015');
    date.addDays(30);
    assert.equal('1/31/2015', date);

    date = new MakeMomentJSGreatAgain('2/1/2016');
    date.addDays(28);
    assert.equal('02/29/2016', date);

    date = new MakeMomentJSGreatAgain('2/1/2015');
    date.addDays(28);
    assert.equal('03/01/2015', date);
  });
});
```

## 4-2. 좋은 예 😆

```js
const assert = require('assert');

describe('MakeMomentJSGreatAgain', () => {
  it('handles 30-day months', () => {
    const date = new MakeMomentJSGreatAgain('1/1/2015');
    date.addDays(30);
    assert.equal('1/31/2015', date);
  });

  it('handles leap year', () => {
    const date = new MakeMomentJSGreatAgain('2/1/2016');
    date.addDays(28);
    assert.equal('02/29/2016', date);
  });

  it('handles non-leap year', () => {
    const date = new MakeMomentJSGreatAgain('2/1/2015');
    date.addDays(28);
    assert.equal('03/01/2015', date);
  });
});
```

<br />

# 마치며

테스트 코드를 지속적으로 깨끗하게 관리하는 것이 중요합니다.

> 1. 표현력을 높이고 간결하게 정리하기
>
> 2. 테스트 API 를 구현해 도메인 특화 언어를 만들기

테스트 코드가 망가지면 실제 코드가 망가진다는 생각으로 테스트 코드를 깨끗하게 유지하는 것이 좋습니다.

<br />

<hr />

### 참고 자료 📩

- [TDD의 소개](https://velog.io/@velopert/TDD의-소개)

- [[번역판] CLEAN CODE JAVASCRIPT](https://edu.goorm.io/learn/lecture/20119/%25EB%25B2%2588%25EC%2597%25AD%25ED%258C%2590-clean-code-javascript)

- [clean-code-javascript](https://github.com/qkraudghgh/clean-code-javascript-ko)