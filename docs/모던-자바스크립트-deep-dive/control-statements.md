---
sidebar_position: 8
---

# 8장 제어문

## 8.1 블록문

자바스크립트는 블록문을 하나의 실행 단위로 취급한다.

블록문은 언제나 문의 종료를 의미하는 자체 종결성을 갖기 때문에 블록문의 끝에는 세미콜론을 붙이지 않는다.

## 8.2 조건문

### 8.2.1 if ... else 문

`if` 문의 조건식이 불리언 값이 아닌 값으로 평가되면 자바스크립트 엔진에 의해 암묵적으로 불리언 값으로 강제 변환되어 실행할 코드 블록을 결정한다.

### 8.2.2 switch 문

`if ... else` 문의 조건식은 불리언 값으로 평가되어야 하지만 `switch` 문의 표현식은 불리언 값보다는 문자열이나 숫자 값인 경우가 많다. 다시 말해, `if ... else` 문은 논리적으로 참, 거짓으로 실행할 코드 블록을 결정한다. `switch` 문은 논리적으로 참, 거짓보다는 다양한 상황에 따라 실행할 코드 블록을 결정할 때 사용한다.

```js
// 월을 영어로 변환한다. (11 → 'November')
var month = 11;
var monthName;

switch (month) {
  case 1:
    monthName = 'January';
  case 2:
    monthName = 'February';
  case 3:
    monthName = 'March';
  case 4:
    monthName = 'April';
  case 5:
    monthName = 'May';
  case 6:
    monthName = 'June';
  case 7:
    monthName = 'July';
  case 8:
    monthName = 'August';
  case 9:
    monthName = 'September';
  case 10:
    monthName = 'October';
  case 11:
    monthName = 'November';
  case 12:
    monthName = 'December';
  default:
    monthName = 'Invalid month';
}

console.log(monthName); // Invalid month
```

위 예제를 실행하면 'November'가 출력되지 않고 'Invalid month'가 출력된다. 이는 `switch` 문의 표현식의 평가 결과와 일치하는 `case` 문으로 실행 흐름이 이동하여 문을 실행한 것은 맞지만 문을 실행한 후 `switch` 문을 탈출하지 않고 `switch` 문이 끝날 때까지 이후의 모든 `case` 문과 `default` 문을 실행했기 때문이다. 이를 **폴스루(fall through)**라 한다.

이러한 결과가 나온 이유는 `case` 문에 해당하는 문의 마지막에 `break` 문을 사용하지 않았기 때문이다. `break` 문이 없다면 `case` 문의 표현식과 일치하지 않더라도 실행 흐름이 다음 `case` 문으로 연이어 이동한다.

`default` 문에는 `break` 문을 생략하는 것이 일반적이다.

`break` 문을 생략한 폴스루가 유용한 경우도 있다. 다음 예제와 같이 폴스루를 활용해 여러 개의 `case` 문을 하나의 조건으로 사용할 수도 있다.

```js
var year = 2000; // 2000년은 윤년으로 2월이 29일이다.
var month = 2;
var days = 0;

switch (month) {
  case 1:
  case 3:
  case 5:
  case 7:
  case 8:
  case 10:
  case 12:
    days = 31;
    break;
  case 4:
  case 6:
  case 9:
  case 11:
    days = 30;
    break;
  case 2:
    // 윤년 계산 알고리즘
    // 1. 연도가 4로 나누어떨어지는 해(2000, 2004, 2008, 2012, 2016, 2020...)는 윤년이다.
    // 2. 연도가 4로 나누어떨어지더라도 연도가 100으로 나누어떨어지는 해(2000, 2100, 2200...)는 평년이다.
    // 3. 연도가 400으로 나누어떨어지는 해(2000, 2400, 2800...)는 윤년이다.
    days = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    break;
  default:
    console.log('Invalid month');
}

console.log(days); // 29
```

## 8.3 반복문

### 8.3.1 for 문

```js
for (var i = 0; i < 2; i++) {
  console.log(i);
}
```

### 8.3.2 while 문

```js
var count = 0;

// count가 3보다 작을 때까지 코드 블록을 계속 반복 실행한다.
while (count < 3) {
  console.log(count); // 0 1 2
  count++;
}
```

### 8.3.3 do ... while 문

```js
var count = 0;

// count가 3보다 작을 때까지 코드 블록을 계속 반복 실행한다.
do {
  console.log(count);
  count++;
} while (count < 3); // 0 1 2
```

## 8.4 break 문

`break` 문은 레이블 문, 반복문 또는 `switch` 문의 코드 블록을 탈출한다. 레이블 문, 반복문, `switch` 문의 코드 블록 외에 `break` 문을 사용하면 `SyntaxError(문법 에러)`가 발생한다.

레이블 문이란 식별자가 붙은 문을 말한다.

```js
// foo라는 레이블 식별자가 붙은 레이블 문
foo: console.log('foo');
```

레이블 문은 프로그램의 실행 순서를 제어하는 데 사용한다. `switch` 문의 `case` 문과 `default` 문도 레이블 문이다.

```js
// foo라는 식별자가 붙은 레이블 블록문
foo: {
  console.log(1);
  break foo; // foo 레이블 블록문을 탈출한다.
  console.log(2);
}

console.log('Done!');
```

중첩된 `for` 문의 내부 `for` 문에서 `break` 문을 실행하면 내부 `for` 문을 탈출하여 외부 `for` 문으로 진입한다. 이때 내부 `for` 문이 아닌 외부 `for` 문을 탈출하려면 레이블 문을 사용한다.

```js
// outer라는 식별자가 붙은 레이블 for 문
outer: for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    // i + j === 3이면 outer라는 식별자가 붙은 레이블 for 문을 탈출한다.
    if (i + j === 3) break outer;
    console.log(`inner [${i}, ${j}]`);
  }
}

console.log('Done!');
```

레이블 문은 중첩된 `for` 문을 외부로 탈출할 때 유용하지만 그 밖의 경우에는 일반적으로 권장하지 않는다. 레이블 문을 사용하면 프로그램의 흐름이 복잡해져서 가독성이 나빠지고 오류를 발생시킬 가능성이 높아지기 때문이다.

## 8.5 continue 문

```js
var string = 'Hello World.';
var search = 'l';
var count = 0;

// 문자열은 유사배열이므로 for 문으로 순회할 수 있다.
for (var i = 0; i < string.length; i++) {
  // 'l'이 아니면 현 지점에서 실행을 중단하고 반복문의 증감식으로 이동한다.
  if (string[i] !== search) continue;
  count++; // continue 문이 실행되면 이 문은 실행되지 않는다.
}

console.log(count); // 3

// 참고로 String.prototype.match 메서드를 사용해도 같은 동작을 한다.
const regexp = new RegExp(search, 'g');
console.log(string.match(regexp).length); // 3
```

```js
// continue 문을 사용하지 않으면 if 문 내에 코드를 작성해야 한다.
for (var i = 0; i < string.length; i++) {
  // 'l'이면 카운트를 증가시킨다.
  if (string[i] === search) {
    count++;
    // code
    // code
    // code
  }
}

// continue 문을 사용하면 if 문 밖에 코드를 작성할 수 있다.
for (var i = 0; i < string.length; i++) {
  // 'l'이 아니면 카운트를 증가시키지 않는다.
  if (string[i] !== search) continue;

  count++;
  // code
  // code
  // code
}
```
