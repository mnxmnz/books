---
sidebar_position: 8
---

# 8장 클래스

## 8.1 클래스 메서드

클래스 생성자는 매개변수와 관련하여 전형적인 클래스 메서드처럼 취급된다.

## 8.2 클래스 속성

클래스의 속성을 읽거나 쓰려면 클래스에 명시적으로 선언해야 한다.

### 8.2.1 함수 속성

메서드 접근 방식은 함수를 클래스 프로토타입에 할당하므로 모든 클래스 인스턴스는 동일한 함수 정의를 사용한다.

```ts
class WithMethod {
  myMethod() {
    // ...
  }
}

new WithMethod().myMethod === new WithMethod().myMethod; // true
```

값이 함수인 속성을 선언하는 방식도 있다. 이렇게 하면 클래스의 인스턴스당 새로운 함수가 생성되며 항상 클래스 인스턴스를 가리켜야 하는 화살표 함수에서 this 스코프를 사용하면 클래스 인스턴스당 새로운 함수를 생성하는 시간과 메모리 비용 측면에서 유용할 수 있다.

```ts
class WithProperty {
  myProperty: () => {
    // ERROR: 속성 'myProperty'은(는) 이니셜라이저가 없고 생성자에 할당되어 있지 않습니다.
    // ...
  };
}

new WithMethod().myProperty === new WithMethod().myProperty;
// ERROR: 'WithMethod' 형식에 'myProperty' 속성이 없습니다.
```

함수 속성에는 클래스 메서드와 독립 함수의 동일한 구문을 사용해 매개변수와 반환 타입을 지정할 수 있다. 함수 속성은 클래스 멤버로 할당된 값이고 그 값은 함수이다.

### 8.2.2 초기화 검사

엄격한 컴파일러 설정이 활성화된 상태에서 타입스크립트는 undefined 타입으로 선언된 각 속성이 생성자에서 할당되었는지 확인한다. 이와 같은 엄격한 초기화 검사는 클래스 속성에 값을 할당하지 않는 실수를 예방할 수 있어 유용하다.

```ts
class WithValue {
  immediate = 0; // OK
  later: number; // OK: constructor에서 할당
  mayBeUndefined: number | undefined; // OK: undefined가 되는 것이 허용
  unused: number; // ERROR: 속성 'unused'은(는) 이니셜라이저가 없고 생성자에 할당되어 있지 않습니다.

  constructor() {
    this.later = 1;
  }
}
```

엄격한 초기화 검사가 없다면 비록 타입 시스템이 undefined 값에 접근할 수 없다고 말할지라도 클래스 인스턴스는 undefined 값에 접근할 수 있다.

**확실하게 할당된 속성**

엄격한 초기화 검사가 유용한 경우가 대부분이지만 클래스 생성자 다음에 클래스 속성을 의도적으로 할당하지 않는 경우가 있을 수도 있다. 엄격한 초기화 검사를 적용하면 안 되는 속성인 경우에는 이름 뒤에 `!`를 추가해 검사를 비활성화하도록 설정할 수 있다. 이렇게 하면 타입스크립트 속성이 처음 사용되기 전에 `undefined` 값이 할당된다.

```ts
class ActivitiesQueue {
  pending!: string[]; // OK

  initialize(pending: string[]) {
    this.pending = pending;
  }

  next() {
    return this.pending.pop();
  }
}

const activities = new ActivitiesQueue();

activities.initialize(['eat', 'sleep', 'learn']);
activities.next();
```

클래스 속성에 대해 엄격한 초기화 검사를 비활성화하는 것은 종종 타입 검사에는 적합하지 않은 방식으로 코드가 설정된다는 신호이다. `!` 어서션을 추가하고 속성에 대한 타입 안정성을 줄이는 대신 클래스를 리팩터링해서 어서션이 필요하지 않도록 하는 것을 권장한다.

### 8.2.3 선택적 속성

선언된 속성 이름 뒤에 `?`를 추가해 속성을 옵션으로 선언한다.

### 8.2.4 읽기 전용 속성

선언된 속성 이름 앞에 readonly 키워드를 추가해 속성을 읽기 전용으로 선언한다. readonly 키워드는 타입 시스템에만 존재하며 자바스크립트로 컴파일할 때 삭제된다.

readonly로 선언된 속성은 선언된 위치 또는 생성자에서 초깃값만 할당할 수 있다. 클래스 내의 메서드를 포함한 다른 모든 위치에서 속성은 읽을 수만 있고, 쓸 수는 없다.

```ts
class Quote {
  readonly text: string;

  constructor(text: string) {
    this.text = '';
  }

  emphasize() {
    this.text += '!'; // ERROR: 읽기 전용 속성이므로 'text'에 할당할 수 없습니다.
  }
}

const quote = new Quote('There is a brilliant child locked inside every student');

Quote.text = 'Ha!'; // ERROR: 'typeof Quote' 형식에 'text' 속성이 없습니다.
```

읽기 전용 보호가 필요하면 readonly 키워드 대신 `# private` 필드나 `get()` 함수 속성을 사용하는 것을 권장한다.

원시 타입의 초깃값을 갖는 readonly로 선언된 속성은 다른 속성과 조금 다르다. 이런 속성은 더 넓은 원싯값이 아니라 값의 타입이 가능한 한 좁혀진 리터럴 타입으로 유추된다. 타입스크립트는 값이 나중에 변경되지 않는다는 것을 알기 때문에 더 공격적인 초기 타입 내로잉을 편하게 느낀다.

```ts
class RandomQuote {
  readonly explicit: string = 'Home is the nicest word there is.';
  readonly implicit = 'Home is the nicest word there is.';

  constructor() {
    if (0.5 < Math.random()) {
      this.explicit = "We start learning the minute we're born."; // OK
      this.implicit = "We start learning the minute we're born."; // ERROR: '"We start learning the minute we're born."' 형식은 '"Home is the nicest word there is."' 형식에 할당할 수 없습니다.
    }
  }
}

const quote = new RandomQuote();

quote.explicit; // 타입: string
quote.implicit; // 타입: "Home is the nicest word there is."
```

## 8.3 타입으로서의 클래스

클래스 선언이 런타임 값(클래스 자체)과 타입 애너테이션에서 사용할 수 있는 타입을 모두 생성한다.

클래스의 동일한 멤버를 모두 포함하는 모든 객체 타입을 클래스에 할당할 수 있는 것으로 간주한다. 타입스크립트의 구조적 타이핑이 선언되는 방식이 아니라 객체의 형태만 고려하기 때문이다.

## 8.4 클래스와 인터페이스

클래스 이름 뒤에 `implements` 키워드와 인터페이스 이름을 추가함으로써 클래스의 해당 인스턴스가 인터페이스를 준수한다고 선언할 수 있다.

```ts
interface Learner {
  name: string;
  study(hours: number): void;
}

class Student implements Learner {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  study(hours: number) {
    for (let i = 0; i < hours; i += 1) {
      console.log('...studying...');
    }
  }
}

class Slacker implements Learner {
  // ERROR
  // 'Slacker' 클래스가 'Learner' 인터페이스를 잘못 구현합니다.
  // 'Slacker' 형식에 'Learner' 형식의 name, study 속성이 없습니다.
}
```

인터페이스를 구현하는 것으로 클래스를 만들어도 클래스가 사용되는 방식은 변경되지 않는다. 클래스가 이미 인터페이스와 일치하는 경우 타입스크립트의 타입 검사기는 인터페이스의 인스턴스가 필요한 곳에서 해당 인스턴스를 사용할 수 있도록 허용한다. 타입스크립트는 인터페이스에서 클래스의 메서드 또는 속성 타입을 유추하지 않는다.

```ts
interface Learner {
  name: string;
  study(hours: number): void;
}

class Student implements Learner {
  name;
  // ERROR: 'name' 멤버에는 암시적으로 'any' 형식이 포함됩니다.

  study(hours) {
    // ERROR: 'hours' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.
  }
}
```

인터페이스를 구현하는 것은 순전히 안정성 검사를 위해서이다. 모든 인터페이스 멤버를 클래스 정의로 복사하지 않는다. 대신 인터페이스를 구현하면 클래스 인터페이스가 사용되는 곳에서 나중에 타입 검사기로 신호를 보내고 클래스 정의에서 표면적인 타입 오류가 발생한다.

### 8.4.1 다중 인터페이스 구현

타입스크립트의 클래스는 다중 인터페이스를 구현해 선언할 수 있다. 클래스에 구현된 인터페이스 목록은 인터페이스 이름 사이에 쉼표를 넣고 개수 제한 없이 인터페이스를 사용할 수 있다.

```ts
interface Graded {
  grades: number[];
}

interface Reporter {
  report: () => string;
}

class ReportCard implements Graded, Reporter {
  grades: number[];

  constructor(grades: number[]) {
    this.grades = grades;
  }

  report() {
    return this.grades.join(', ');
  }
}

class Empty implements Graded, Reporter {
  // ERROR
  // 'Empty' 클래스가 'Graded' 인터페이스를 잘못 구현합니다.
  // 'grades' 속성이 'Empty' 형식에 없지만 'Graded' 형식에서 필수입니다.
  // 'Empty' 클래스가 'Reporter' 인터페이스를 잘못 구현합니다.
  // 'report' 속성이 'Empty' 형식에 없지만 'Reporter' 형식에서 필수입니다.
}
```

클래스가 한 번에 두 인터페이스를 구현할 수 없도록 정의하는 인터페이스가 있을 수 있다. 두 개의 충돌하는 인터페이스를 구현하는 클래스를 선언하려고 하면 클래스에 하나 이상의 타입 오류가 발생한다.

```ts
interface AgeIsANumber {
  age: number;
}

interface AgeIsNotANumber {
  age: () => string;
}

class AsNumber implements AgeIsANumber, AgeIsNotANumber {
  age = 0;
  // ERROR
  // 'AsNumber' 형식의 'age' 속성을 기본 형식 'AgeIsNotANumber'의 동일한 속성에 할당할 수 없습니다.
  // 'number' 형식은 '() => string' 형식에 할당할 수 없습니다.
}

class NotAsNumber implements AgeIsANumber, AgeIsNotANumber {
  age() {
    return '';
  }
  // ERROR
  // 'NotAsNumber' 형식의 'age' 속성을 기본 형식 'AgeIsANumber'의 동일한 속성에 할당할 수 없습니다.
  // '() => string' 형식은 'number' 형식에 할당할 수 없습니다.
}
```

## 8.5 클래스 확장

다른 클래스를 확장하거나 하위 클래스를 만드는 자바스크립트 개념에 타입 검사를 추가한다.

### 8.5.1 할당 가능성 확장

파생 인터페이스가 기본 인터페이스를 확장하는 것과 마찬가지로 하위 클래스도 기본 클래스의 멤버를 상속한다. 하위 클래스의 인스턴스는 기본 클래스의 모든 멤버를 가지므로 기본 클래스의 인스턴스가 필요한 모든 곳에서 사용할 수 있다.

타입스크립트의 구조적 타입에 따라 하위 클래스의 모든 멤버가 동일한 타입의 기본 클래스에 이미 존재하는 경우 기본 클래스의 인스턴스를 하위 클래스 대신 사용할 수 있다.

```ts
class PastGrades {
  grades: number[] = [];
}

class LabeledPastGrades extends PastGrades {
  label?: string;
}

let subClass: LabeledPastGrades;

subClass = new LabeledPastGrades(); // OK
subClass = new PastGrades(); // OK
```

### 8.5.2 재정의된 생성자

타입스크립트에서 하위 클래스는 자체 생성자를 정의할 필요가 없다. 자체 생성자가 없는 하위 클래스는 암묵적으로 기본 클래스의 생성자를 사용한다.

자바스크립트에서 하위 클래스가 자체 생성자를 선언하면 super 키워드를 통해 기본 클래스 생성자를 호출해야 한다. 하위 클래스 생성자는 기본 클래스에서의 필요 여부와 상관없이 모든 매개변수를 선언할 수 있다. 타입 검사기는 기본 클래스 생성자를 호출할 때 올바른 매개변수를 사용하는지 확인한다.

```ts
class GradeAnnouner {
  message: string;

  constructor(grade: number) {
    this.message = grade >= 65 ? 'Maybe next time...' : 'You pass!';
  }
}

class PassingAnnouncer extends GradeAnnouner {
  constructor() {
    super(100);
  }
}

class FailingAnnouncer extends GradeAnnouner {
  constructor() {
    // ERROR: 파생 클래스의 생성자는 'super' 호출을 포함해야 합니다.
  }
}
```

자바스크립트 규칙에 따르면 하위 클래스의 생성자는 this 또는 super에 접근하기 전에 반드시 기본 클래스의 생성자를 호출해야 한다. 타입스크립트는 super()를 호출하기 전에 this 또는 super에 접근하려고 하는 경우 타입 오류를 보고한다.

```ts
class GradesTally {
  grades: number[] = [];

  addGrades(...grades: number[]) {
    this.grades.push(...grades);
    return this.grades.length;
  }
}

class ContinuedGradesTally extends GradesTally {
  constructor(previousGrades: number[]) {
    this.grades = [...previousGrades]; // ERROR: 파생 클래스의 생성자에서 'this'에 액세스하기 전에 'super'를 호출해야 합니다.

    super();

    console.log('Starting with length', this.grades.length); // OK
  }
}
```

### 8.5.3 재정의된 메서드

하위 클래스의 메서드가 기본 클래스의 메서드에 할당될 수 있는 한 하위 클래스는 기본 클래스와 동일한 이름으로 새 메서드를 다시 선언할 수 있다. 기본 클래스를 사용하는 모든 곳에 하위 클래스를 사용할 수 있으므로 새 메서드의 타입도 기본 메서드 대신 사용할 수 있어야 한다.

```ts
class GradeCounter {
  countGrades(grades: string[], letter: string) {
    return grades.filter(grade => grade === letter).length;
  }
}

class FailureCounter extends GradeCounter {
  countGrades(grades: string[]) {
    return super.countGrades(grades, 'F');
  }
}

class AnyFailureChecker extends GradeCounter {
  countGrades(grades: string[]) {
    // ERROR
    // 'AnyFailureChecker' 형식의 'countGrades' 속성을 기본 형식 'GradeCounter'의 동일한 속성에 할당할 수 없습니다.
    // '(grades: string[]) => boolean' 형식은 '(grades: string[], letter: string) => number' 형식에 할당할 수 없습니다.
    // 'boolean' 형식은 'number' 형식에 할당할 수 없습니다.
    return super.countGrades(grades, 'F') !== 0;
  }
}

const counter: GradeCounter = new AnyFailureChecker();

// 예상 타입: number
// 실제 타입: boolean
const count = counter.countGrades(['A', 'B', 'F']);
```

### 8.5.4 재정의된 속성

하위 클래스는 새 타입을 기본 클래스의 타입에 할당할 수 있는 한 동일한 이름으로 기본 클래스의 속성을 명시적으로 다시 선언할 수 있다. 재정의된 메서드와 마찬가지로 하위 클래스는 기본 클래스와 구조적으로 일치해야 한다.

속성을 다시 선언하는 대부분의 하위 클래스는 해당 속성을 유니언 타입의 더 구체적인 하위 집합으로 만들거나 기본 클래스 속성 타입에서 확장되는 타입으로 만든다.

```ts
class Assignment {
  grade?: number;
}

class GradedAssignment extends Assignment {
  grade: number;

  constructor(grade: number) {
    super();
    this.grade = grade;
  }
}
```

속성의 유니언 타입의 허용된 값 집합을 확장할 수는 없다. 만약 확장한다면 하위 클래스 속성은 더 이상 기본 클래스 속성 타입에 할당할 수 없다.

```ts
class NumericGrade {
  value = 0;
}

class VagueGrade extends NumericGrade {
  value = Math.random() > 0.5 ? 1 : '...';
  // ERROR
  // 'VagueGrade' 형식의 'value' 속성을 기본 형식 'NumericGrade'의 동일한 속성에 할당할 수 없습니다.
  // 'string | number' 형식은 'number' 형식에 할당할 수 없습니다.
  // 'string' 형식은 'number' 형식에 할당할 수 없습니다.
}

const instance: NumericGrade = new VagueGrade();

// 예상 타입: number
// 실제 타입: number | string
instance.value;
```

## 8.6 추상 클래스

추상화하려는 클래스 이름과 메서드 앞에 타입스크립트의 abstract 키워드를 추가한다. 이러한 추상화 메서드 선언은 추상화 기본 클래스에서 메서드의 본문을 제공하는 것을 건너뛰고 대신 인터페이스와 동일한 방식으로 선언된다.

```ts
abstract class School {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getStudentTypes(): string[];
}

class Preschool extends School {
  getStudentTypes() {
    return ['preschooler'];
  }
}

class Absence extends School {
  // ERROR
  // 비추상 클래스 'Absence'은(는) 'School' 클래스에서 상속된 추상 멤버 'getStudentTypes'을(를) 구현하지 않습니다.
}
```

구현이 존재한다고 가정할 수 있는 일부 메서드에 대한 정의가 없기 때문에 추상 클래스를 직접 인스턴스화할 수 없다. 추상 클래스가 아닌 클래스만 인스턴스화할 수 있다.

```ts
let school: School;

school = new Preschool('Sunnyside Daycare'); // OK

school = new School('somewhere else');
// ERROR: 추상 클래스의 인스턴스를 만들 수 없습니다.
```

## 8.7 멤버 접근성

자바스크립트에서는 클래스 멤버 이름 앞에 `#`을 추가해 private 클래스 멤버임을 나타낸다. private 클래스 멤버는 해당 클래스 인스턴스에서만 접근할 수 있다. 자바스크립트 런타임은 클래스 외부 코드 영역에서 private 메서드나 속성에 접근하려고 하면 오류를 발생시킴으로써 프라이버시를 강화한다.

타입스크립트의 클래스 지원은 자바스크립트의 # 프라이버시보다 먼저 만들어졌다. 타입스크립트는 private 클래스 멤버를 지원하지만 타입 시스템에만 존재하는 클래스 메서드와 속성에 대해 조금 더 미묘한 프라이버시 정의 집합을 허용한다. 타입스크립트의 멤버 접근성은 클래스 멤버의 선언 이름 앞에 다음 키워드 중 하나를 추가해 만든다.

- public: 모든 곳에서 누구나 접근 가능
- protected: 클래스 내부 또는 하위 클래스에서만 접근 가능
- private: 클래스 내부에서만 접근 가능

타입스크립트의 멤버 접근성은 타입 시스템에서만 존재하는 반면 자바스크립트의 private 선언은 런타임에도 존재한다는 점이 주요 차이점이다. protected 또는 private으로 선언된 타입스크립트 클래스 멤버는 명시적으로 또는 암묵적으로 public으로 선언된 것처럼 동일한 자바스크립트 코드로 컴파일된다. 인터페이스와 타입 애너테이션처럼 접근성 키워드는 자바스크립트로 컴파일될 때 제거된다. 자바스크립트 런타임에서는 # private 필드만 진정한 private이다.

접근성 제한자는 readonly와 함께 표시할 수 있다. readonly와 명시적 접근성 키워드로 멤버를 선언하려면 접근성 키워드를 먼저 적어야 한다.

```ts
class TwoKeywords {
  private readonly name: string;

  constructor() {
    this.name = 'Anne Sullivan'; // OK
  }

  log() {
    console.log(this.name); // OK
  }
}

const two = new TwoKeywords();

two.name = 'Savitribai Phule';
// ERROR
// 'name' 속성은 private이며 'TwoKeywords' 클래스 내에서만 액세스할 수 있습니다.
// 읽기 전용 속성이므로 'name'에 할당할 수 없습니다.
```

### 8.7.1 정적 필드 제한자

자바스크립트는 static 키워드를 사용해 클래스 자체에서 멤버를 선언한다. 타입스크립트는 static 키워드를 단독으로 사용하거나 readonly와 접근성 키워드를 함께 사용할 수 있도록 지원한다. 함께 사용할 경우 접근성 키워드를 먼저 작성하고 그다음 static, readonly 키워드가 온다.

```ts
class Question {
  protected static readonly answer: 'bash';
  protected static readonly prompt = "What's an ogre's favorite programming language?";

  guess(getAnswer: (prompt: string) => string) {
    const answer = getAnswer(Question.prompt);

    // OK
    if (answer === Question.answer) {
      console.log('You got it!');
    } else {
      console.log('Try again...');
    }
  }
}

Question.answer;
// ERROR: 'answer' 속성은 보호된 속성이며 'Question' 클래스 및 해당 하위 클래스 내에서만 액세스할 수 있습니다.
```
