---
sidebar_position: 31
---

# 아이템 31 타입 주변에 null 값 배치하기

```ts
function extent(nums: number[]) {
  let min, max;

  for (const num of nums) {
    if (!min) {
      min = num;
      max = num;
    } else {
      min = Math.min(min, num);
      max = Math.max(max, num);
    }
  }

  return [min, max];
}

const [min, max] = extent([0, 1, 2]);
const span = max - min;
```

```ts
function extent(nums: number[]) {
  let result: [number, number] | null = null;

  for (const num of nums) {
    if (!result) {
      result = [num, num];
    } else {
      result = [Math.min(num, result[0]), Math.max(num, result[1])];
    }
  }

  return result;
}

const [min, max] = extent([0, 1, 2])!;
const span = max - min;
```

## 요약

- 한 값의 null 여부가 다른 값의 null 여부에 암시적으로 관련되도록 설계하면 안 된다.
- API 작성 시에는 반환 타입을 큰 객체로 만들고 반환 타입 전체가 null 이거나 null 이 아니게 만들어야 한다. 사람과 타입 체커 모두에게 명료한 코드가 될 것이다.
- 클래스를 만들 때는 필요한 모든 값이 준비되었을 때 생성하여 null 이 존재하지 않도록 하는 것이 좋다.
- strictNullChecks 를 설정하면 코드에 많은 오류가 표시되겠지만, null 값과 관련된 문제점을 찾아낼 수 있기 때문에 반드시 필요하다.
