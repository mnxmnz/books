---
sidebar_position: 44
---

# 아이템 44 타입 커버리지를 추적하여 타입 안전성 유지하기

```ts
const utils = {
  buildColumnInfo(s: any, name: string): any {},
};

declare let appState: { dataSchema: unknown };
declare module 'my-module';
```

## 요약

- noImplicitAny 가 설정되어 있어도, 명시적 any 또는 서드파티 타입 선언(@types)을 통해 any 타입은 코드 내에 여전히 존재할 수 있다는 점을 주의해야 한다.
- 작성한 프로그램의 타입이 얼마나 잘 선언되었는지 추적해야 한다. 추적함으로써 any 의 사용을 줄여 나갈 수 있고 타입 안전성을 꾸준히 높일 수 있다.
