---
sidebar_position: 43
---

# 아이템 43 몽키 패치보다는 안전한 타입 사용하기

```ts
interface MonkeyDocument extends Document {
  monkey: string;
}

(document as MonkeyDocument).monkey = 'Macaque';
```

## 요약

- 전역 변수나 DOM 에 데이터를 저장하지 말고, 데이터를 분리하여 사용해야 한다.
- 내장 타입에 데이터를 저장해야 하는 경우, 안전한 타입 접근법 중 하나(보강이나 사용자 정의 인터페이스로 단언)를 사용해야 한다.
- 보강의 모듈 영역 문제를 이해해야 한다.
