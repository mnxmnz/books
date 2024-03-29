---
sidebar_position: 5
---

# 5장 객체 지향 프로그래밍

좋은 아키텍처를 만드는 일은 객체 지향 OO 설계 원칙을 이해하고 응용하는 데서 출발한다.

## 캡슐화?

`point.h`를 사용하는 측에서 `struct Point`의 멤버에게 접근할 방법이 전혀 없다. 사용자는 `makePoint()` 함수와 `distance()` 함수를 호출할 수는 있지만, `Point` 구조체의 데이터 구조와 함수가 어떻게 구현되었는지에 대해서는 조금도 알지 못한다.

이것이 바로 완벽한 캡슐화이며, OO가 아닌 언어에서도 충분히 가능하다.

C++라는 형태로 OO가 등장했고, C가 제공하던 완전한 캡슐화가 깨지게 되었다.

`point.h` 헤더 파일을 사용하는 측에서는 멤버 변수인 `x`와 `y`를 알게 된다. 물론 멤버 변수에 접근하는 일은 컴파일러가 막겠지만, 사용자는 멤버 변수가 존재한다는 사실 자체를 알게 된다. 예를 들어 멤버 변수의 이름이 바뀐다면 `point.cc` 파일은 다시 컴파일해야 한다. 캡슐화가 깨진 것이다.

OO가 강력한 캡슐화에 의존한다는 정의는 받아들이기 힘들다. 실제로 많은 OO 언어가 캡슐화를 거의 강제하지 않는다.

OO 프로그래밍은 프로그래머가 충분히 올바르게 행동함으로써 캡슐화된 데이터를 우회해서 사용하지 않을 거라는 믿음을 기반으로 한다. 하지만 OO를 제공한다고 주창한 언어들이 실제로는 C 언어에서 누렸던 완벽한 캡슐화를 약화해 온 것은 틀림없다.

## 상속?

main 프로그램을 잘 살펴보면 `NamePoint` 데이터 구조가 마치 `Point` 데이터 구조로부터 파생된 구조인 것처럼 동작한다는 사실을 볼 수 있다. 이는 `NamedPoint`에 선언된 두 변수의 순서가 `Point`와 동일하기 때문이다. 다시 말해 `NamedPoint`는 `Point`의 가면을 쓴 것처럼 동작할 수 있는데, 이는 `NamedPoint`가 순전히 `Point`를 포함하는 상위 집합으로, `Point`에 대응하는 멤버 변수의 순서가 그대로 유지되기 때문이다.

OO 언어가 완전히 새로운 개념을 만들지는 못했지만, 데이터 구조에 가면을 씌우는 일을 상당히 편리한 방식으로 제공했다고 볼 수는 있다.

## 다형성?

함수에 대한 포인터를 직접 사용하여 다형적 행위를 만드는 이 방식에는 문제가 있는데, 함수 포인터는 위험하다는 사실이다. 이러한 기법은 프로그래머가 특정 관례를 수동으로 따르는 방식이다. 즉, 이들 포인터를 초기화하는 관례를 준수해야 한다는 사실을 기억해야 한다. 그리고 이들 포인터를 통해 모든 함수를 호출하는 관례를 지켜야 한다는 점도 기억해야 한다. 만약 프로그래머가 관례를 지켜야 한다는 사실을 망각하게 되면 버그가 발생하고, 이러한 버그는 찾아내고 없애기가 힘들다.

OO 언어는 이러한 관례를 없애주며, 따라서 실수할 위험이 없다. OO 언어를 사용하면 다형성은 대수롭지 않은 일이 된다. 이러한 이유로 OO는 제어흐름을 간접적으로 전환하는 규칙을 부과한다고 결론지을 수 있다.

### 다형성이 가진 힘

장치에 의존적인 수많은 프로그램을 만들고 나서야, 이들 프로그램이 다른 장치에서도 동일하게 동작할 수 있도록 만드는 것이 우리가 진정 바랐던 일임을 깨달았다.

플러그인 아키텍처는 이처럼 입출력 장치 독립성을 지원하기 위해 만들어졌고, 등장 이후 거의 모든 운영체제에서 구현되었다. 그럼에도 대다수의 프로그래머는 직접 작성하는 프로그램에서는 이러한 개념을 확장하여 적용하지 않았는데, 함수를 가리키는 포인터를 사용하면 위험을 수반하기 때문이었다.

### 의존성 역전

전형적인 호출 트리의 경우 main 함수가 고수준 함수를 호출하고, 고수준 함수는 다시 중간 수준 함수를 호출하며, 중간 수준 함수는 다시 저수준 함수를 호출한다. 이러한 호출 트리에서 소스 코드 의존성의 방향은 반드시 제어흐름을 따르게 된다.

OO 언어로 개발된 시스템을 다루는 소프트웨어 아키텍트는 시스템의 소스 코드 의존성 전부에 대해 방향을 결정할 수 있는 절대적인 권한을 갖는다. 즉, 소스 코드 의존성이 제어흐름의 방향과 일치되도록 제한되지 않는다. 호출하는 모듈이든 아니면 호출받는 모듈이든 관계없이 소프트웨어 아키텍트는 소스 코드 의존성을 원하는 방향으로 설정할 수 있다.

이것이 바로 OO가 지향하는 것이다.

업무 규칙이 데이터베이스와 사용자 인터페이스에 의존하는 대신에, 시스템의 소스 코드 의존성을 반대로 배치하여 데이터베이스와 UI가 업무 규칙에 의존하게 만들 수 있다.

즉, UI와 데이터베이스가 업무 규칙의 플러그인이 된다는 뜻이다. 다시 말해 업무 규칙의 소스 코드에서는 UI나 데이터베이스를 호출하지 않는다.

결과적으로 업무 규칙, UI, 데이터베이스는 세 가지로 분리된 컴포넌트 또는 배포할 수 있는 단위로 컴파일할 수 있고, 이 배포 단위들의 의존성 역시 소스 코드 사이의 의존성과 같다.

따라서 업무 규칙을 UI와 데이터베이스와는 독립적으로 배포할 수 있다. UI나 데이터베이스에서 발생한 변경 사항은 업무 규칙에 일절 영향을 미치지 않는다. 즉, 이들 컴포넌트는 개별적이며 독립적으로 배포할 수 있다.

다시 말해 특정 컴포넌트의 소스 코드가 변경되면, 해당 코드가 포함된 컴포넌트만 다시 배포하면 된다. 이것이 바로 배포 독립성이다.

시스템의 모듈을 독립적으로 배포할 수 있게 되면, 서로 다른 팀에서 각 모듈을 독립적으로 개발할 수 있다. 그리고 이것이 개발 독립성이다.

## 결론

OO란 다형성을 이용하여 전체 시스템의 모든 소스 코드 의존성에 대한 절대적인 제어 권한을 획득할 수 있는 능력이다. OO를 사용하면 아키텍트는 플러그인 아키텍처를 구성할 수 있고, 이를 통해 고수준의 정책을 포함하는 모듈은 저수준의 세부 사항을 포함하는 모듈에 대해 독립성을 보장할 수 있다. 저수준의 세부 사항은 중요도가 낮은 플러그인 모듈로 만들 수 있고, 고수준의 정책을 포함하는 모듈과는 독립적으로 개발하고 배포할 수 있다.
