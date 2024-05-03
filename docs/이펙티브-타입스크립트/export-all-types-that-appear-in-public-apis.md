---
sidebar_position: 47
---

# 아이템 47 공개 API 에 등장하는 모든 타입을 익스포트하기

```ts
interface SecretName {
  first: string;
  last: string;
}

interface SecretSanta {
  name: SecretName;
  gift: string;
}

export function getGift(name: SecretName, gift: string): SecretSanta {
  return {
    name: {
      first: 'Dan',
      last: 'Van',
    },
    gift: 'MacBook Pro',
  };
}

type MySanta = ReturnType<typeof getGift>;
type MyName = Parameters<typeof getGift>[0];
```

## 요약

- 공개 메서드에 등장한 어떤 형태의 타입이든 익스포트하자. 라이브러리 사용자가 추출할 수 있으므로, 익스포트하기 쉽게 만드는 것이 좋다.
