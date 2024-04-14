---
sidebar_position: 25
---

# 아이템 25 비동기 코드에는 콜백 대신 async 함수 사용하기

콜백보다는 프로미스나 `async/await` 를 사용해야 하는 이유는 다음과 같다.

병렬로 페이지를 로드하고 싶다면 `Promise.all` 을 사용해서 프로미스를 조합하면 된다.

```ts
async function fetchPages() {
  const [response1, response2, response3] = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
  // ...
}
```

- 이러한 경우 `await` 와 구조 분해 할당을 사용하면 좋다.

타입스크립트는 세 가지 `response` 변수 각각의 타입을 `Response` 로 추론한다. 그러나 콜백 스타일로 동일한 코드를 작성하려면 더 많은 코드와 타입 구문이 필요하다.

```ts
function fetchPagesCB() {
  let numDone = 0;
  const responses: string[] = [];
  const done = () => {
    const [response1, response2, response3] = responses;
    // ...
  };
  const urls = [url1, url2, url3];

  urls.forEach((url, i) => {
    fetchURL(url, r => {
      responses[i] = url;
      numDone++;
      if (numDone === urls.length) done();
    });
  });
}
```

- 이러한 코드에 오류 처리를 포함하거나 `Promise.all` 같은 일반적인 코드로 확장하는 것은 쉽지 않다.

입력된 프로미스들 중 첫 번째가 처리될 때 완료되는 `Promise.race` 도 타입 추론과 잘 맞는다. `Promise.race` 를 사용하여 프로미스에 타임아웃을 추가하는 방법은 흔하게 사용되는 패턴이다.

```ts
function timeout(millis: number): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), millis);
  });
}

async function fetchWithTimeout(url: string, ms: number) {
  return Promise.race([fetch(url), timeout(ms)]);
}
```

- 타입 구문이 없어도 `fetchWithTimeout` 의 반환 타입은 `Promise<Response>` 로 추론된다. 추론이 동작하는 이유는 다음과 같다. `Promise.race` 의 반환 타입은 입력 타입의 유니온이고 이번 경우는 `Promise<Response | never>` 가 된다. 그러나 `never` 와 유니온은 아무런 효과가 없으므로 결과가 `Promise<Response>` 로 간단해진다. 프로미스를 사용하면 타입스크립트의 모든 타입 추론이 제대로 동작한다.

프로미스를 직접 생성할 때, 특히 `setTimeout` 과 같은 콜백 API 를 래핑할 경우가 있다. 선택의 여지가 있다면 일반적으로는 프로미스를 생성하기보다는 `async/await` 를 사용해야 한다. 그 이유는 다음과 같다.

- 일반적으로 더 간결하고 직관적인 코드가 된다.
- `async` 함수는 항상 프로미스를 반환하도록 강제된다.

즉시 사용 가능한 값에도 프로미스를 반환하는 것이 이상하게 보일 수 있지만, 실제로는 비동기 함수로 통일하도록 강제하는 데 도움이 된다. 함수는 항상 동기 또는 항상 비동기로 실행되어야 하며 절대 혼용해서는 안 된다.

`fetchURL` 함수에 캐시를 추가하기 위해 다음처럼 시도해볼 수 있다.

```ts
const _cache: { [url: string]: string } = {};

function fetchWithCache(url: string, callback: (text: string) => void) {
  if (url in _cache) {
    callback(_cache[url]);
  } else {
    fetchURL(url, text => {
      _cache[url] = text;
      callback(text);
    });
  }
}
```

- 캐시된 경우 콜백 함수가 동기로 호출되기 때문에 `fetchWithCache` 함수는 이제 사용하기가 어렵다.

```ts
let requestStatus: 'loading' | 'success' | 'error';

function getUser(userId: string) {
  fetchWithCache(`/user/${userId}`, profile => {
    requestStatus = 'success';
  });

  requestStatus = 'loading';
}
```

- `getUser` 를 호출한 후에 `requestStatus` 의 값은 온전히 `profile` 에 캐시되었는지 여부에 달렸다. 캐시되어 있지 않다면 `requestStatus` 는 조만간 ‘success’ 가 된다. 캐시되어 있다면 ‘success’ 가 되고 나서 바로 ‘loading’ 으로 다시 돌아간다.

`async` 를 두 함수에 모두 사용하면 일관적인 동작을 강제하게 된다.

```ts
const _cache: { [url: string]: string } = {};

async function fetchWithCache(url: string) {
  if (url in _cache) {
    return _cache[url];
  }

  const response = await fetch(url);
  const text = await response.text();

  _cache[url] = text;

  return text;
}

let requestStatus: 'loading' | 'success' | 'error';

async function getUser(userId: string) {
  requestStatus = 'loading';

  const profile = await fetchWithCache(`/user/${userId}`);

  requestStatus = 'success';
}
```

- `requestStatus` 가 'success' 로 끝나는 것이 명백해졌다. 콜백이나 프로미스를 사용하면 실수로 반동기 코드를 작성할 수 있지만, `async` 를 사용하면 항상 비동기 코드를 작성하는 셈이다.

`async` 함수에서 프로미스를 반환하면 또 다른 프로미스로 래핑되지 않는다. 반환 타입은 `Promise<Promise<T>>` 가 아닌 `Promise<T>` 가 된다. 타입스크립트를 사용하면 타입 정보가 명확히 드러나기 때문에 비동기 코드의 개념을 잡는 데 도움이 된다.

```ts
async function getJSON(url: string) {
  const response = await fetch(url);
  const jsonPromise = response.json(); // 타입: is Promise<any>

  return jsonPromise;
}
```

## 요약

- 콜백보다는 프로미스를 사용하는 게 코드 작성과 타입 추론 면에서 유리하다.
- 가능하면 프로미스를 생성하기보다는 `async` 와 `await` 를 사용하는 것이 좋다. 간결하고 직관적인 코드를 작성할 수 있고 모든 종류의 오류를 제거할 수 있다.
- 어떤 함수가 프로미스를 반환한다면 `async` 로 선언하는 것이 좋다.
