---
sidebar_position: 28
---

# 아이템 28 유효한 상태만 표현하는 타입을 지향하기

```ts
interface State {
  pageText: string;
  isLoading: boolean;
  error?: string;
}

declare let currentPage: string;

function renderPage(state: State) {
  if (state.error) {
    return `Error! Unable to load ${currentPage}: ${state.error}`;
  } else if (state.isLoading) {
    return `Loading ${currentPage}...`;
  }

  return `<h1>${currentPage}</h1>\n${state.pageText}`;
}

function getUrlForPage(p: string) {
  return '';
}

async function changePage(state: State, newPage: string) {
  state.isLoading = true;

  try {
    const response = await fetch(getUrlForPage(newPage));

    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }

    const text = await response.text();

    state.isLoading = false;
    state.pageText = text;
  } catch (e) {
    state.error = '' + e;
  }
}
```

```ts
interface RequestPending {
  state: 'pending';
}

interface RequestError {
  state: 'error';
  error: string;
}

interface RequestSuccess {
  state: 'ok';
  pageText: string;
}

type RequestState = RequestPending | RequestError | RequestSuccess;

interface State {
  currentPage: string;
  requests: { [page: string]: RequestState };
}

function getUrlForPage(p: string) {
  return '';
}

function renderPage(state: State) {
  const { currentPage } = state;
  const requestState = state.requests[currentPage];

  switch (requestState.state) {
    case 'pending':
      return `Loading ${currentPage}...`;
    case 'error':
      return `Error! Unable to load ${currentPage}: ${requestState.error}`;
    case 'ok':
      return `<h1>${currentPage}</h1>\n${requestState.pageText}`;
  }
}

async function changePage(state: State, newPage: string) {
  state.requests[newPage] = { state: 'pending' };
  state.currentPage = newPage;

  try {
    const response = await fetch(getUrlForPage(newPage));

    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }

    const pageText = await response.text();

    state.requests[newPage] = { state: 'ok', pageText };
  } catch (e) {
    state.requests[newPage] = { state: 'error', error: '' + e };
  }
}
```

## 요약

- 유효한 상태와 무효한 상태를 둘 다 표현하는 타입은 혼란을 초래하기 쉽고 오류를 유발하게 된다.
- 유효한 상태만 표현하는 타입을 지향해야 한다. 코드가 길어지거나 표현하기 어렵지만 결국은 시간을 절약하고 고통을 줄일 수 있다.
