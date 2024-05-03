---
sidebar_position: 56
---

# 아이템 56 정보를 감추는 목적으로 private 사용하지 않기

public, protected, private 같은 접근 제어자는 타입스크립트 키워드라서 컴파일 후 제거된다.

```tsx
// 타입스크립트

class Diary {
  private secret = 'cheated on my English test';
}

const diary = new Diary();
diary.secret;
// ERR: 'secret' 속성은 private이며 'Diary' 클래스 내에서만 액세스할 수 있습니다.
```

```jsx
// 자바스크립트

class Diary {
  constructor() {
    this.secret = 'cheated on my English test';
  }
}

const diary = new Diary();
diary.secret;
```

- 타입스크립트의 접근 제어자는 컴파일 시점에만 오류를 표시하고 런타임에는 아무런 효력이 없다.

자바스크립트에서 정보를 숨기기 위해 가장 효과적인 방법은 클로저를 사용하는 것이다.

```tsx
declare function hash(text: string): number;

class PasswordChecker {
  checkPassword: (password: string) => boolean;
  constructor(passwordHash: number) {
    this.checkPassword = (password: string) => {
      return hash(password) === passwordHash;
    };
  }
}

const checker = new PasswordChecker(hash('s3cret'));
checker.checkPassword('s3cret'); // true
```

- PasswordChecker 의 생성자 외부에서 passwordHash 변수에 접근할 수 없음

비공개 필드 기능도 사용할 수 있다. 접두사로 #를 붙여서 타입 체크와 런타임 모두에서 비공개로 만드는 역할을 한다.

```tsx
class PasswordChecker {
  #passwordHash: number;

  constructor(passwordHash: number) {
    this.#passwordHash = passwordHash;
  }

  checkPassword(password: string) {
    return hash(password) === this.#passwordHash;
  }
}

const checker = new PasswordChecker(hash('s3cret'));
checker.checkPassword('secret'); // false
checker.checkPassword('s3cret'); // true
```

:::note

[타입스크립트 접근제한자(public, protected, private)](https://www.howdy-mj.me/typescript/access-modifiers)

:::

## 요약

- public, protected, private 접근 제어자는 타입 시스템에서만 강제된다. 런타임에는 소용이 없으며 단언문을 통해 우회할 수 있다. 접근 제어자로 데이터를 감추려고 해서는 안 된다.
- 확실히 데이터를 감추고 싶다면 클로저를 사용해야 한다.
