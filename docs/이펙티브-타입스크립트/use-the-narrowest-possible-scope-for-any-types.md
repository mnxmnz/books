---
sidebar_position: 38
---

# 아이템 38 any 타입은 가능한 한 좁은 범위에서만 사용하기

타입스크립트가 함수의 반환 타입을 추론할 수 있는 경우에도 함수의 반환 타입을 명시하는 것이 좋다. 함수의 반환 타입을 명시하면 any 타입이 함수 바깥으로 영향을 미치는 것을 방지할 수 있다.

## 요약

- 의도치 않은 타입 안정성의 손실을 피하기 위해 any 사용 범위를 최소한으로 좁혀야 한다.
- 함수의 반환 타입이 any 인 경우 타입 안정성이 나빠진다. 따라서 any 타입을 반환하면 절대 안 된다.
- 강제로 타입 오류를 제거하려면 any 대신 @ts-ignore 를 사용하는 것이 좋다.
