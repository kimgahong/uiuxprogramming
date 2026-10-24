const serviceName = "RunMate";
let isSubscribed = false;
let submitCount = 0;

// 이메일 구독
function makeSubscribeMessage(email, subscribed) {
  if (subscribed) {
    return email + "로 신청이 완료되었습니다.";
  }

  return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
  event.preventDefault();

  const subscriberEmail = emailInput.value.trim();

  if (subscriberEmail === "") {
    subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
    subscribeMessage.classList.remove("is-success");
    emailInput.focus();
    return;
  }

  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  isSubscribed = true;
  submitCount += 1;

  subscribeMessage.textContent = makeSubscribeMessage(
    subscriberEmail,
    isSubscribed,
  );

  subscribeMessage.classList.add("is-success");
  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

// 테마, 닉네임, 안전 확인
const themeButton = document.querySelector("#themeButton");
const userNameInput = document.querySelector("#userName");
const userNameCount = document.querySelector("#userNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark
    ? "밝은 테마로 바꾸기"
    : "어두운 테마로 바꾸기";
}

function handleUserNameInput(event) {
  if (!event.isComposing && userNameInput.value.length > 10) {
    userNameInput.value = userNameInput.value.slice(0, 10);
  }

  const currentLength = Math.min(userNameInput.value.length, 10);
  userNameCount.textContent = currentLength + " / 10";
}

function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startButton.disabled = !agreed;

  agreeMessage.textContent = agreed
    ? "확인이 완료되었습니다. 러닝 설정을 시작할 수 있습니다."
    : "안내 확인 후 러닝을 시작할 수 있습니다.";

  agreeMessage.classList.toggle("is-ready", agreed);
}

themeButton.addEventListener("click", handleThemeClick);
userNameInput.addEventListener("input", handleUserNameInput);
userNameInput.addEventListener("compositionend", handleUserNameInput);
agreeCheck.addEventListener("change", handleAgreeChange);

// 러닝 기능 탭
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach((tab) => {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach((panel) => {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  if (!targetPanel) return;

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", handleTabClick);
});

// 러닝 세션 설정
const runningFlow = document.querySelector("#running-flow");
const runningSteps = runningFlow.querySelectorAll(".step");
const progressItems = runningFlow.querySelectorAll(".progress_item");

const sessionTitleInput = document.querySelector("#session-title");
const sessionTitleError = document.querySelector("#session-title-error");
const sessionTitleNext = document.querySelector("#session-title-next");

const runningDurationRange = document.querySelector("#running-duration-range");
const runningDurationValue = document.querySelector("#running-duration-value");
const breakOption = document.querySelector("#break-option");
const breakOptions = document.querySelector("#break-options");

const sessionOptionPrev = document.querySelector("#session-option-prev");
const sessionOptionNext = document.querySelector("#session-option-next");
const sessionSummaryPrev = document.querySelector("#session-summary-prev");
const sessionFinishButton = document.querySelector("#session-finish-button");
const sessionRestartButton = document.querySelector("#session-restart-button");

const summarySessionTitle = document.querySelector("#summary-session-title");
const summaryRunningDuration = document.querySelector(
  "#summary-running-duration",
);
const summaryBreaks = document.querySelector("#summary-breaks");

const runningDurationValues = ["10", "20", "30"];

const sessionData = {
  title: "",
  duration: "20",
  includeBreaks: false,
  breakCount: "2",
};

function showRunningStep(index) {
  runningSteps.forEach((step, i) => {
    step.hidden = i !== index;
  });

  progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
  });
}

// 러닝 안전 안내 다이얼로그
const runningGuideDialog = document.querySelector("#running-guide-dialog");
const runningGuideCancel = document.querySelector("#running-guide-cancel");
const runningGuideConfirm = document.querySelector("#running-guide-confirm");

function revokeRunningAgreement() {
  agreeCheck.checked = false;
  runningFlow.hidden = true;
  handleAgreeChange();
  agreeCheck.focus();
}

startButton.addEventListener("click", () => {
  if (!agreeCheck.checked) return;

  runningGuideDialog.showModal();
});

runningGuideCancel.addEventListener("click", () => {
  runningGuideDialog.close();
  revokeRunningAgreement();
});

runningGuideDialog.addEventListener("cancel", revokeRunningAgreement);

runningGuideConfirm.addEventListener("click", () => {
  if (!agreeCheck.checked) return;

  runningGuideDialog.close();
  runningFlow.hidden = false;
  showRunningStep(0);
  runningFlow.scrollIntoView({ behavior: "smooth" });
  sessionTitleInput.focus();
});

// 세션 이름 확인
function validateSessionTitle() {
  const value = sessionTitleInput.value.trim();

  if (!value) {
    sessionTitleError.textContent = "러닝 세션 이름을 입력해주세요.";
    sessionTitleInput.classList.add("has-error");
    sessionTitleInput.focus();
    return false;
  }

  sessionTitleError.textContent = "";
  sessionTitleInput.classList.remove("has-error");
  sessionData.title = value;

  return true;
}

sessionTitleNext.addEventListener("click", () => {
  if (!validateSessionTitle()) return;

  showRunningStep(1);
});

// 러닝 시간 변경
runningDurationRange.addEventListener("input", () => {
  runningDurationValue.value =
    runningDurationValues[Number(runningDurationRange.value)] + "분";
});

// 휴식 설정 표시
breakOption.addEventListener("change", () => {
  breakOptions.hidden = !breakOption.checked;
});

// 이전 단계
sessionOptionPrev.addEventListener("click", () => {
  showRunningStep(0);
});

// 설정 확인
sessionOptionNext.addEventListener("click", () => {
  sessionData.duration =
    runningDurationValues[Number(runningDurationRange.value)];

  sessionData.includeBreaks = breakOption.checked;

  const selectedBreakCount = document.querySelector(
    'input[name="break-count"]:checked',
  );

  sessionData.breakCount = selectedBreakCount ? selectedBreakCount.value : "2";

  summarySessionTitle.textContent = sessionData.title;
  summaryRunningDuration.textContent = sessionData.duration + "분";

  summaryBreaks.textContent = sessionData.includeBreaks
    ? sessionData.breakCount + "회"
    : "설정하지 않음";

  showRunningStep(2);
});

// 확인 화면에서 수정하기
sessionSummaryPrev.addEventListener("click", () => {
  showRunningStep(1);
});

// 설정 완료
sessionFinishButton.addEventListener("click", () => {
  showRunningStep(3);
});

// 처음부터 다시 설정
sessionRestartButton.addEventListener("click", () => {
  sessionData.title = "";
  sessionData.duration = "20";
  sessionData.includeBreaks = false;
  sessionData.breakCount = "2";

  sessionTitleInput.value = "";
  sessionTitleError.textContent = "";
  sessionTitleInput.classList.remove("has-error");

  runningDurationRange.value = "1";
  runningDurationValue.value = "20분";

  breakOption.checked = false;
  breakOptions.hidden = true;

  const defaultBreakCount = document.querySelector(
    'input[name="break-count"][value="2"]',
  );

  if (defaultBreakCount) {
    defaultBreakCount.checked = true;
  }

  summarySessionTitle.textContent = "";
  summaryRunningDuration.textContent = "";
  summaryBreaks.textContent = "";

  showRunningStep(0);
});
