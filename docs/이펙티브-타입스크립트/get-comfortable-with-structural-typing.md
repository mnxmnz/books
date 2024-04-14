---
sidebar_position: 4
---

# 아이템 4 구조적 타이핑에 익숙해지기

자바스크립트가 덕 타이핑 기반이고 타입스크립트가 이를 모델링하기 위해 구조적 타이핑을 사용함을 이해해야 한다.

```ts
interface Vector2D {
  x: number;
  y: number;
}

function calculateLength(v: Vector2D) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

interface NamedVector {
  name: string;
  x: number;
  y: number;
}

const v: NamedVector = { x: 3, y: 4, name: 'Zee' };

calculateLength(v); // 5
```

`NamedVector` 의 구조가 `Vector2D` 와 호환되기 때문에 `calculateLength` 호출이 가능하다. 여기서 ‘구조적 타이핑’이라는 용어가 사용된다.

구조적 타이핑 때문에 문제가 발생하기도 한다.

```ts
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

function normalize(v: Vector3D) {
  const length = calculateLength(v);

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}
```

`calculateLength` 는 2D 벡터를 기반으로 연산하는데, 버그로 인해 `normalize` 가 3D 벡터로 연산되었다. `z` 가 정규화에서 무시된 것이다.

`Vector3D` 와 호환되는 `{x, y, z}` 객체로 `calculateLength` 를 호출하면, 구조적 타이핑 관점에서 `x` 와 `y` 가 있어서 `Vector2D` 와 호환된다. 따라서 오류가 발생하지 않았고, 타입 체커가 문제로 인식하지 않았다.

어떤 인터페이스에 할당 가능한 값이라면 타입 선언에 명시적으로 나열된 속성들을 가지고 있을 것이다. 타입은 ‘봉인’되어 있지 않다.

```ts
calculateLengthL1(v: Vector3D) {
  let length = 0;

  for (const axis of Object.keys(v)) {
    const coord = v[axis];
    // 'string' 형식의 식을 'Vector3D' 인덱스 형식에 사용할 수 없으므로 요소에 암시적으로 'any' 형식이 있습니다.
    // 'Vector3D' 형식에서 'string' 형식의 매개 변수가 포함된 인덱스 시그니처를 찾을 수 없습니다.
    length += Math.abs(coord);
  }

  return length;
}
```

앞에서 `Vector3D` 는 다른 속성이 없다고 가정했다. 그런데 다음 코드처럼 작성할 수도 있다.

```ts
const vec3D = { x: 3, y: 4, z: 1, address: '123 Broadway' };

calculateLengthL1(vec3D);
```

`v` 는 어떤 속성이든 가질 수 있기 때문에, `axis` 의 타입은 `string` 이 될 수도 있다. 그러므로 앞서 본 것처럼 타입스크립트는 `v[axis]` 가 어떤 속성이 될지 알 수 없기 때문에 `number` 라고 확정할 수 없다.

이러한 경우에는 루프보다는 모든 속성을 각각 더하는 구현이 더 낫다.

```ts
function calculateLengthL1(v: Vector3D) {
  return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
}
```

클래스 역시 구조적 타이핑 규칙을 따른다는 것을 명심해야 한다. 클래스의 인스턴스가 예상과 다를 수 있다.

구조적 타이핑을 사용하면 유닛 테스팅을 손쉽게 할 수 있다.

:::note

- [Syntactic Sugar](https://www.zerocho.com/category/JavaScript/post/5816c858ca15d50015d924ae)

:::

:::note

덕타이핑의 장점은?

- 테스트 로직이나 특정 무언가를 모킹하는 것을 만들 때 수월하다.
- class 하나만 만들어서 사용할 수 있다. → Java 를 활용하면 다형성을 활용해서 어렵다.
- 객체를 생성하는 비용이 낮다.
- 빠른 개발이 가능하다.

:::
