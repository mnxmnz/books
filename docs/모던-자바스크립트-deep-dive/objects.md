---
sidebar_position: 10
---

# 10장 객체 리터럴

## 10.1 객체란?

자바스크립트는 객체 기반의 프로그래밍 언어이며, 자바스크립트를 구성하는 거의 "모든 것"이 객체다. 원시 값을 제외한 나머지 값(함수, 배열, 정규 표현식 등)은 모두 객체다.

원시 타입은 단 하나의 값만 나타내지만 객체 타입은 다양한 타입의 값을 하나의 단위로 구성한 복합적인 자료구조다. 또한 **원시 타입의 값, 즉 원시 값은 변경 불가능한 값(immutable value)이지만 객체 타입의 값, 즉 객체는 변경 가능한 값(mutable value)**이다.

![property](./images/property.png)

자바스크립트에서 사용할 수 있는 모든 값은 프로퍼티 값이 될 수 있다. 자바스크립트의 함수는 일급 객체이므로 값으로 취급할 수 있다. 프로퍼티 값이 함수일 경우, 일반 함수와 구분하기 위해 메서드라 부른다.

![method](./images/method.png)

- **프로퍼티**: 객체의 상태를 나타내는 값
- **메서드**: 프로퍼티를 참조하고 조작할 수 있는 동작

## 10.2 객체 리터럴에 의한 객체 생성

자바스크립트는 다양한 객체 생성 방법을 지원한다.

- 객체 리터럴
- Object 생성자 함수
- 생성자 함수
- Object.create 메서드
- 클래스(ES6)

객체 리터럴은 중괄호({ ... }) 내에 0개 이상의 프로퍼티를 정의한다. 변수에 할당되는 시점에 자바스크립트 엔진은 객체 리터럴을 해석해 객체를 생성한다.

```js
var person = {
	name: 'Lee',
	sayHello: function () {
		console.log(`Hello! My name is ${this.name}.`);
	},
};

console.log(typeof person); // object
console.log(person); // {name: "Lee", sayHello: ƒ}
```

## 10.3 프로퍼티

**객체는 프로퍼티의 집합이며, 프로퍼티는 키와 값으로 구성된다.**

프로퍼티 키는 프로퍼티 값에 접근할 수 있는 이름으로서 식별자 역할을 한다.

심벌 값도 프로퍼티 키로 사용할 수 있지만 일반적으로 문자열을 사용한다. 이때 프로퍼티 키는 문자열이므로 따옴표('...' 또는 "...")로 묶어야 한다. 하지만 식별자 네이밍 규칙을 준수하는 이름, 즉 자바스크립트에서 사용 가능한 유효한 이름인 경우 따옴표를 생략할 수 있다. 반대로 말하면 **식별자 네이밍 규칙을 따르지 않는 이름에는 반드시 따옴표를 사용해야 한다.**

식별자 네이밍 규칙을 준수하는 프로퍼티 키를 사용할 것을 권장한다.

```js
var person = {
	firstName: 'Ung-mo', // 식별자 네이밍 규칙을 준수하는 프로퍼티 키
	'last-name': 'Lee', // 식별자 네이밍 규칙을 준수하지 않는 프로퍼티 키
};

console.log(person); // {firstName: "Ung-mo", last-name: "Lee"}
```

자바스크립트 엔진은 따옴표를 생략한 `last-name`을 - 연산자가 있는 표현식으로 해석한다.

```js
var person = {
  firstName: 'Ung-mo',
  last-name: 'Lee' // SyntaxError: Unexpected token -
};
```

문자열 또는 문자열로 평가할 수 있는 표현식을 사용해 프로퍼티 키를 동적으로 생성할 수도 있다. 이 경우에는 프로퍼티 키로 사용할 표현식을 대괄호([...])로 묶어야 한다.

```js
var obj = {};
var key = 'hello';

// ES5: 프로퍼티 키 동적 생성
obj[key] = 'world';
// ES6: 계산된 프로퍼티 이름
// var obj = { [key]: 'world' };

console.log(obj); // {hello: "world"}
```

빈 문자열을 프로퍼티 키로 사용해도 에러가 발생하지는 않는다. 하지만 키로서의 의미를 갖지 못하므로 권장하지 않는다.

프로퍼티 키에 문자열이나 심벌 값 외의 값을 사용하면 암묵적으로 타입 변환을 통해 문자열이 된다. 예를 들어, 프로퍼티 키로 숫자 리터럴을 사용하면 따옴표는 붙지 않지만 내부적으로는 문자열로 변환된다.

```js
var foo = {
	0: 1,
	1: 2,
	2: 3,
};

console.log(foo); // {0: 1, 1: 2, 2: 3}
```

`var`, `function`과 같은 예약어를 프로퍼티 키로 사용해도 에러가 발생하지 않는다. 하지만 예상치 못한 에러가 발생할 여지가 있으므로 권장하지 않는다.

이미 존재하는 프로퍼티 키를 중복 선언하면 나중에 선언한 프로퍼티가 먼저 선언한 프로퍼티를 덮어쓴다. 이때 에러가 발생하지 않는다는 점에 주의하자.

## 10.4 메서드

```js
var circle = {
	radius: 5, // ← 프로퍼티

	// 원의 지름
	getDiameter: function () {
		// ← 메서드
		return 2 * this.radius; // this는 circle을 가리킨다.
	},
};

console.log(circle.getDiameter()); // 10
```

## 10.5 프로퍼티 접근

프로퍼티에 접근하는 방법은 다음과 같이 두 가지다.

- 마침표 프로퍼티 접근 연산자(.)를 사용하는 **마침표 표기법**
- 대괄호 프로퍼티 접근 연산자([...])를 사용하는 **대괄호 표기법**

대괄호 표기법을 사용하는 경우 **대괄호 프로퍼티 접근 연산자 내부에 지정하는 프로퍼티 키는 반드시 따옴표로 감싼 문자열**이어야 한다. 대괄호 프로퍼티 접근 연산자 내에 따옴표로 감싸지 않은 이름을 프로퍼티 키로 사용하면 자바스크립트 엔진은 식별자로 해석한다.

```js
var person = {
	name: 'Lee',
};

console.log(person[name]); // ReferenceError: name is not defined
```

위 예제에서 ReferenceError가 발생한 이유는 대괄호 연산자 내의 따옴표로 감싸지 않은 이름, 즉 식별자 name을 평가하기 위해 선언된 name을 찾았지만 찾지 못했기 때문이다.

**객체에 존재하지 않는 프로퍼티에 접근하면 undefined를 반환한다.** 이때 ReferenceError가 발생하지 않는데 주의하자.

```js
var person = {
	name: 'Lee',
};

console.log(person.age); // undefined
```

프로퍼티 키가 식별자 네이밍 규칙을 준수하지 않는 이름, 즉 자바스크립트에서 사용 가능한 유효한 이름이 아니면 반드시 대괄호 표기법을 사용해야 한다. 단, 프로퍼티 키가 숫자로 이뤄진 문자열인 경우 따옴표를 생략할 수 있다. 그 외의 경우 대괄호 내에 들어가는 프로퍼티 키는 반드시 따옴표로 감싼 문자열이어야 한다는 점을 잊지 말자.

```js
var person = {
  'last-name': 'Lee',
  1: 10
};

person.'last-name';  // -> SyntaxError: Unexpected string
person.last-name;    // -> 브라우저 환경: NaN
                     // -> Node.js 환경: ReferenceError: name is not defined
person[last-name];   // -> ReferenceError: last is not defined
person['last-name']; // -> Lee

// 프로퍼티 키가 숫자로 이뤄진 문자열인 경우 따옴표를 생략할 수 있다.
person.1;     // -> SyntaxError: Unexpected number
person.'1';   // -> SyntaxError: Unexpected string
person[1];    // -> 10 : person[1] -> person['1']
person['1'];  // -> 10
```

`person.last-name`을 실행할 때 자바스크립트 엔진은 먼저 `person.last`를 평가한다. `person` 객체에는 프로퍼티 키가 `last`인 프로퍼티가 없기 때문에 `person.last`는 `undefined`로 평가된다. 따라서 `person.last-name`은 `undefined - name`과 같다. 다음으로 자바스크립트 엔진은 `name`이라는 식별자를 찾는다. 이때 `name`은 프로퍼티 키가 아니라 식별자로 해석되는 것에 주의하자.

Node.js 환경에서는 현재 어디에도 `name`이라는 식별자(변수, 함수 등의 이름) 선언이 없으므로 "ReferenceError: name is not defined"라는 에러가 발생한다. 그런데 브라우저 환경에서는 `name`이라는 전역 변수가 암묵적으로 존재한다. 전역 변수 `name`은 창의 이름을 가리키며, 기본값은 빈 문자열이다. 따라서 `person.last-name`은 `undefined - ''`과 같으므로 `NaN`이 된다.

## 10.6 프로퍼티 값 갱신

```js
var person = {
	name: 'Lee',
};

// person 객체에 name 프로퍼티가 존재하므로 name 프로퍼티의 값이 갱신된다.
person.name = 'Kim';

console.log(person); // {name: "Kim"}
```

## 10.7 프로퍼티 동적 생성

```js
var person = {
	name: 'Lee',
};

// person 객체에는 age 프로퍼티가 존재하지 않는다.
// 따라서 person 객체에 age 프로퍼티가 동적으로 생성되고 값이 할당된다.
person.age = 20;

console.log(person); // {name: "Lee", age: 20}
```

## 10.8 프로퍼티 삭제

```js
var person = {
	name: 'Lee',
};

// 프로퍼티 동적 생성
person.age = 20;

// person 객체에 age 프로퍼티가 존재한다.
// 따라서 delete 연산자로 age 프로퍼티를 삭제할 수 있다.
delete person.age;

// person 객체에 address 프로퍼티가 존재하지 않는다.
// 따라서 delete 연산자로 address 프로퍼티를 삭제할 수 없다. 이때 에러가 발생하지 않는다.
delete person.address;

console.log(person); // {name: "Lee"}
```

## 10.9 ES6에서 추가된 객체 리터럴의 확장 기능

### 10.9.1 프로퍼티 축약 표현

ES6에서는 프로퍼티 값으로 변수를 사용하는 경우 변수 이름과 프로퍼티 키가 동일한 이름일 때 프로퍼티 키를 생략할 수 있다. 이때 프로퍼티 키는 변수 이름으로 자동 생성된다.

```js
// ES6
let x = 1,
	y = 2;

// 프로퍼티 축약 표현
const obj = { x, y };

console.log(obj); // {x: 1, y: 2}
```

### 10.9.2 계산된 프로퍼티 이름

문자열 또는 문자열로 타입 변환할 수 있는 값으로 평가되는 표현식을 사용해 프로퍼티 키를 동적으로 생성할 수도 있다. 단, 프로퍼티 키로 사용할 표현식을 대괄호([...])로 묶어야 한다. 이를 계산된 프로퍼티 이름이라 한다.

```js
// ES5
var prefix = 'prop';
var i = 0;

var obj = {};

// 계산된 프로퍼티 이름으로 프로퍼티 키 동적 생성
obj[prefix + '-' + ++i] = i;
obj[prefix + '-' + ++i] = i;
obj[prefix + '-' + ++i] = i;

console.log(obj); // {prop-1: 1, prop-2: 2, prop-3: 3}
```

```js
// ES6
const prefix = 'prop';
let i = 0;

// 객체 리터럴 내부에서 계산된 프로퍼티 이름으로 프로퍼티 키 동적 생성
const obj = {
	[`${prefix}-${++i}`]: i,
	[`${prefix}-${++i}`]: i,
	[`${prefix}-${++i}`]: i,
};

console.log(obj); // {prop-1: 1, prop-2: 2, prop-3: 3}
```

### 10.9.3 메서드 축약 표현

```js
// ES5
var obj = {
	name: 'Lee',
	sayHi: function () {
		console.log('Hi! ' + this.name);
	},
};

obj.sayHi(); // Hi! Lee
```

```js
// ES6
const obj = {
	name: 'Lee',
	// 메서드 축약 표현
	sayHi() {
		console.log('Hi! ' + this.name);
	},
};

obj.sayHi(); // Hi! Lee
```
