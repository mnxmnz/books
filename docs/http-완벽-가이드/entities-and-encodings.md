---
sidebar_position: 15
---

# 15장 엔터티와 인코딩

HTTP는 다음을 보장한다.

- 객체는 올바르게 식별되므로(Content-Type 미디어 포맷과 Content-Language 헤더를 이용해서) 브라우저나 다른 클라이언트는 콘텐츠를 바르게 처리할 수 있다.
- 객체는 올바르게 압축이 풀릴 것이다(Content-Length와 Content-Encoding 헤더를 이용해서).
- 객체는 항상 최신이다(엔터티 검사기와 캐시 만료 제어를 이용해서).
- 사용자의 요구를 만족할 것이다(내용 협상을 위한 Accept 관련 헤더에 기반하여).
- 네트워크 사이를 빠르고 효율적으로 이동할 것이다(범위 요청, 델타 인코딩, 그 외의 데이터 압축을 이용해서).
- 조작되지 않고 온전하게 도착할 것이다(전송 인코딩 헤더와 Content-MD5 체크섬을 이용해서).
