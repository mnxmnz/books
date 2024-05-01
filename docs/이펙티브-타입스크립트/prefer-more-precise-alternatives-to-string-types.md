---
sidebar_position: 33
---

# 아이템 33 string 타입보다 더 구체적인 타입 사용하기

```ts
function pluck<T, K extends keyof T>(record: T[], key: K): T[K][] {
  return record.map(r => r[key]);
}

type RecordingType = 'studio' | 'live';

interface Album {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: RecordingType;
}

declare let albums: Album[];

pluck(albums, 'releaseDate');
pluck(albums, 'artist');
pluck(albums, 'recordingType');
pluck(albums, 'recordingDate');
```

## 요약

- ‘문자열을 남발하여 선언된’ 코드를 피하자. 모든 문자열을 할당할 수 있는 string 타입보다는 더 구체적인 타입을 사용하는 것이 좋다.
- 변수의 범위를 보다 정확하게 표현하고 싶다면 string 타입보다는 문자열 리터럴 타입의 유니온을 사용하면 된다. 타입 체크를 더 엄격하게 하고 생산성을 향상할 수 있다.
- 객체의 속성 이름을 함수 매개변수로 받을 때는 string 보다 keyof T 를 사용하는 것이 좋다.
