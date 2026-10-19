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

## 6주차 이벤트와 동적 UI

### 구현한 이벤트

| 이벤트 | 요소 | 사용자 행동 | 화면 변화 |
| --- | --- | --- | --- |
| `click` | `#themeButton` | 테마 버튼을 누른다. | `body`에 `dark` 클래스가 붙거나 빠지고, 버튼 문구가 `어두운 테마로 바꾸기` ↔ `밝은 테마로 바꾸기`로 바뀐다. |
| `input` | `#userName` | 러너 닉네임을 입력하거나 지운다. | `#userNameCount`가 `0 / 10` 형식으로 현재 글자 수를 즉시 보여 준다. `maxlength="10"`으로 10자를 넘지 않는다. |
| `change` | `#agreeCheck` | 준비운동·안전 안내 체크박스를 선택하거나 해제한다. | `#agreeMessage` 문구와 `is-ready` 클래스, `#startButton`의 `disabled`가 함께 바뀐다. 체크해야 `러닝 시작하기` 버튼을 누를 수 있다. |
| `click` | `.tab` (3개) | 러닝 기능 탭을 누른다. | 선택한 탭에 `is-active`와 `aria-selected="true"`가 붙고, `data-target`으로 연결된 패널 하나만 보인다. |

### 탭 구성

기존 `러닝 기능` 카드 세 개의 내용을 그대로 세 개의 탭으로 옮겼다.

- `맞춤형 러닝 계획` → `#panel-plan`
- `단계별 러닝 훈련` → `#panel-training`
- `러닝 피드백` → `#panel-feedback`

탭을 누르면 `resetTabsAndPanels()`로 모든 탭과 패널의 선택 상태를 해제한 뒤, `activateTab()`이 누른 탭의 `dataset.target`으로 패널을 찾아 활성화한다.

### 서비스에 맞게 바꾼 부분

- 설정 섹션 제목은 `러닝 코치 이용 설정`, 이름 입력은 `러너 닉네임`, 확인 항목은 `러닝 전 준비운동과 안전 안내`, 시작 버튼은 `러닝 시작하기`로 바꿨다.
- 탭 색상은 기존 페이지의 초록색(`#277a68`)에 맞췄다.
- 메뉴에 `러닝 설정` 링크(`#interaction-practice`)를 추가했다.
- 설정 카드 세 개는 넓은 화면에서 `display: grid`와 `grid-template-columns: repeat(3, minmax(0, 1fr))`로 가로 3열로 배치하고, 섹션 제목 `h2`는 `grid-column: 1 / -1`로 한 줄 전체를 쓰게 했다. 768px 이하에서는 1열로 바뀐다.
- 처음에 `align-items: start`를 써서 카드마다 내용 높이가 달랐다. `align-items: stretch`로 바꿔 세 카드의 높이를 가장 긴 카드에 맞췄다.
- 어두운 테마에서 제목, 탭 패널, 이메일 카드, 안내 문구도 배경과 구분되도록 색을 지정했다.
- 768px 이하에서 기존 `input { width: 100% }` 규칙 때문에 체크박스가 가로로 늘어나서 `.agree-row input { width: auto; }`를 추가했다.

### 테스트 결과

1100px / 768px / 390px에서 확인했다.

- 세 탭을 차례로 눌러도 선택된 탭과 보이는 패널이 항상 하나씩이다.
- 닉네임을 입력하면 글자 수가 즉시 바뀐다. (`runner` 입력 시 `6 / 10`)
- 체크 전에는 시작 버튼이 비활성화되어 있고, 체크하면 활성화되며 안내 문구가 바뀐다.
- 테마 버튼을 누르면 화면 색과 버튼 문구가 함께 바뀐다.
- 768px 이하에서 탭이 세로로 배치되고, 가로 스크롤이 생기지 않는다.
- Console 오류가 없다.

### 추가 수정

- 어두운 테마에서 설정 섹션만 띠처럼 배경색이 생기던 문제를 없애고, 탭 버튼·입력창·체크박스·이메일 안내 문구·비활성 버튼도 어두운 색에 맞췄다.
- 한글을 입력하면 글자를 조합하는 동안 `maxlength`를 넘는 글자가 잠깐 들어와 `11 / 10`이 보일 때가 있었다. `input` 이벤트에서 조합 중(`event.isComposing`)이 아니면 값을 10자로 자르고, `compositionend` 이벤트에도 같은 함수를 연결해 조합이 끝난 뒤 다시 계산하게 했다. 표시하는 글자 수도 `Math.min()`으로 10을 넘지 않게 했다.
