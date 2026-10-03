## 4주차 반응형 수정

### 확인할 문제

작은 화면에서 메뉴, 기능 카드, 이메일 폼이 좁여 보였다.

### 수정한 내용

- viewport 메타 태그를 추가했다.
- 콘텐츠에 width와 max-width를 함께 사용했다.
- 기능 카드 목록을 반응형 Grid로 변경했다.
- 768px 이하에서 메뉴, 카드, 폼을 한 열로 구성했다.

### 확인할 화면 너비

1100px / 769px / 768px / 390px

## 5주차 JavaScript 인터랙션

### 사용자 행동

러닝 소식 받기에서 이메일을 입력하고 `러닝 소식 신청하기` 버튼을 누른다.

이메일을 비워 둔 채 버튼을 누르면 안내만 바뀌고 이메일을 입력한 뒤 누르면 신청 완료로 바뀐다.

### 화면에서 바뀌는 것

- 이메일이 비어 있으면 `#subscribeMessage`가 "이메일을 일벽한 뒤 신청해주세요."로 바뀌고 이메일 입력칸으로 포커스가 이동한다.
- 이메일을 입력하면 `#subscribeMessage`가 "입력한 이메일로 신청이 완료되었습니다."로 바뀐다. 예를 들어 `runner@email.com`을 입력하면 `runner@email.com로 신청이 완료되었습니다.`가 보인다.
- 완료 문구에는 `is-success`가 붙어 글자가 진해지고 배경색이 있는 박스로 바뀐다.
- 버튼 글자가 `신청 완료`로 바뀌고 버튼이 비활성화된다. 비활성화되면 배경이 회색이 되고 다시 누를 수 없다.
- 버튼을 눌러도 페이지는 새로고침되지 않는다.

### 연결한 코드

- `index.html`의 `#subscribe-form` 제출을 `script.js`의 `subscribeForm.addEventListener("submit", handleSubscribe)`에 연결했다.
- `handleSubscribe`는 `event.preventDefault()`로 새로고침을 막는다.
- 입력값은 `#email`을 `emailInput.value.trim()`으로 읽는다. 비어 있으면 `#subscribeMessage` 문구를 바꾸고 `emailInput.focus()`로 입력칸에 포커스를 준다.
- 이메일이 있으면 `isSubscribed`를 `true`로 바꾸고 `submitCount`를 1 올린 뒤, `makeSubscribeMessage(subscriberEmail, isSubscribed)` 결과를 `#subscribeMessage`에 넣는다.
- 완료 스타일은 `subscribeMessage.classList.add("is-success")`로 붙이고, 모양은 `style.css`의 `#subscribeMessage.is-success`가 담당한다.
- 버튼 글자와 비활성 상태는 `subscribeButton.textContent`, `subscribeButton.disabled`로 바꾸고 비활성 모양은 `style.css`의 `#subscribeButton:disabled`가 담당한다.
