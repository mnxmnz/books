---
sidebar_position: 62
---

# 아이템 62 마이그레이션의 완성을 위해 noImplicitAny 설정하기

:::note

[noImplicitAny | TypeScript Deep Dive](https://basarat.gitbook.io/typescript/intro/noimplicitany)

:::

## 요약

- noImplicitAny 설정을 활성화하여 마이그레이션의 마지막 단계를 진행해야 한다. noImplicitAny 설정이 없다면 타입 선언과 관련된 실제 오류가 드러나지 않는다.
- noImplicitAny 를 전면 적용하기 전에 로컬에서부터 타입 오류를 점진적으로 수정해야 한다. 엄격한 타입 체크를 적용하기 전에 팀원들이 타입스크립트에 익숙해질 수 있도록 시간을 주자.
