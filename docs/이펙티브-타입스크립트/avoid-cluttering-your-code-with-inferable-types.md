---
sidebar_position: 19
---

# 아이템 19 추론 가능한 타입을 사용해 장황한 코드 방지하기

이상적인 타입스크립트 코드는 함수/메서드 시그니처에 타입 구문을 포함하지만 함수 내에서 생성한 지역 변수에는 타입 구문을 넣지 않는다. 타입 구문을 생략하여 방해되는 것들을 최소화하고 코드를 읽는 사람이 구현 로직에 집중할 수 있게 하는 것이 좋다.

```ts
interface Product {
  id: string;
  name: string;
  price: number;
}

function logProduct(product: Product) {
  const id: number = product.id;
  // ERROR: 'string' 형식은 'number' 형식에 할당할 수 없습니다.
  const name: string = product.name;
  const price: number = product.price;

  console.log(id, name, price);
}

const elmo: Product = {
  name: 'Tickle Me Elmo',
  id: '048188 627152',
  price: 28.99,
};
```

- `elmo` 정의에 타입을 명시하면 초과 속성 체크가 동작한다. 초과 속성 체크는 선택적 속성이 있는 타입의 오타 같은 오류를 잡는 데 효과적이다.

```ts
const furby = {
  name: 'Furby',
  id: 630509430963,
  price: 35,
};

logProduct(furby);
// ERROR: '{ name: string; id: number; price: number; }' 형식의 인수는 'Product' 형식의 매개 변수에 할당될 수 없습니다.
// ERROR: 'id' 속성의 형식이 호환되지 않습니다.
// ERROR: 'number' 형식은 'string' 형식에 할당할 수 없습니다.
```

- 타입 구문을 제거하면 초과 속성 체크가 동작하지 않고 객체를 선언한 곳이 아니라 객체를 사용하는 곳에서 타입 오류가 발생한다.

함수의 반환에도 타입을 명시하여 오류를 방지할 수 있다. 타입 추론이 가능해도 구현상의 오류가 함수를 호출한 곳까지 영향을 미치지 않도록 하기 위해 타입 구문을 명시하는 것이 좋다.

```ts
const cache: { [ticker: string]: number } = {};

function getQuote(ticker: string) {
  if (ticker in cache) {
    return cache[ticker];
  }

  return fetch(`https://quotes.example.com/?q=${ticker}`)
    .then(response => response.json())
    .then(quote => {
      cache[ticker] = quote;

      return quote;
    });
}

function considerBuying(x: any) {}

getQuote('MSFT').then(considerBuying);
// ERROR: 'number | Promise<any>' 형식에 'then' 속성이 없습니다.
// ERROR: 'number' 형식에 'then' 속성이 없습니다.
```

- 실행하면 `getQuote` 내부가 아닌 `getQuote` 를 호출하는 코드에서 오류가 발생한다.

```ts
function getQuote(ticker: string): Promise<number> {
  if (ticker in cache) {
    return cache[ticker];
    // ERROR: 'number' 형식은 'Promise<number>' 형식에 할당할 수 없습니다.
  }

  return Promise.resolve(0);
}
```

- 의도된 반환 타입 (`Promise<number>`) 를 명시하면 정확한 위치에 오류가 표시된다.

반환 타입을 명시하면 구현상의 오류가 사용자 코드의 오류로 표시되지 않는다. 오류의 위치를 제대로 표시해 주는 이점 외에도 반환 타입을 명시해야 하는 이유는 다음과 같다.

1. 반환 타입을 명시하면 함수에 대해 더욱 명확하게 알 수 있다. 반환 타입을 명시하려면 구현하기 전에 입력 타입과 출력 타입이 무엇인지 알아야 한다. 추후에 코드가 변경되어도 함수의 시그니처는 쉽게 바뀌지 않는다. 미리 타입을 명시하는 방법은 TDD 와 비슷하다. 전체 타입 시그니처를 먼저 작성하면 구현에 맞추어 주먹구구식으로 시그니처가 작성되는 것을 방지하고 원하는 모양을 얻게 된다.
2. 명명된 타입을 사용하기 위해서이다. 반환 타입을 명시하면 더욱 직관적인 표현이 된다. 그리고 반환 값을 별도의 타입으로 정의하면 타입에 대한 주석을 작성할 수 있어서 더욱 자세한 설명이 가능하다. 추론된 반환 타입이 복잡해질수록 명명된 타입을 제공하는 이점은 커진다.

## 요약

- 타입스크립트가 타입을 추론할 수 있다면 타입 구문을 작성하지 않는 것이 좋다.
- 이상적인 경우 함수/메서드의 시그니처에는 타입 구문이 있지만 함수 내의 지역 변수에는 타입 구문이 없다.
- 추론될 수 있는 경우라도 객체 리터럴과 함수 반환에는 타입 명시를 고려해야 한다. 내부 구현의 오류가 사용자 코드 위치에 나타나는 것을 방지할 수 있다.
