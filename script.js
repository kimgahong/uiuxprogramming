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

  // 11주차: 브라우저 말풍선 대신 화면 문구 + aria-invalid + 입력칸 초점으로 오류를 알린다
  if (subscriberEmail === "") {
    showSubscribeError("이메일을 입력해 주세요. 예: runner@example.com");
    return;
  }

  if (!emailInput.checkValidity()) {
    showSubscribeError(
      "이메일 형식을 확인해 주세요. ‘@’와 도메인이 필요해요. 예: runner@example.com",
    );
    return;
  }

  emailInput.removeAttribute("aria-invalid");
  subscribeMessage.classList.remove("is-error");
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

function showSubscribeError(message) {
  subscribeMessage.textContent = message;
  subscribeMessage.classList.remove("is-success");
  subscribeMessage.classList.add("is-error");
  emailInput.setAttribute("aria-invalid", "true");
  emailInput.focus();
}

// 오류가 난 뒤 다시 입력하면 형식이 맞는 순간 오류 표시를 걷어 낸다
emailInput.addEventListener("input", () => {
  if (emailInput.getAttribute("aria-invalid") !== "true") return;
  if (emailInput.value.trim() === "" || !emailInput.checkValidity()) return;

  emailInput.removeAttribute("aria-invalid");
  subscribeMessage.classList.remove("is-error");
  subscribeMessage.textContent = "올바른 이메일 형식이에요. 신청 버튼을 눌러 주세요.";
});

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
  userNameCount.textContent = currentLength + " / 10자";
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
const sessionForm = document.querySelector("#session-form");

const sessionTitleField = document.querySelector("#session-title-field");
const sessionTitleInput = document.querySelector("#session-title");
const sessionTitleHelp = document.querySelector("#session-title-help");
const sessionTitleCount = document.querySelector("#session-title-count");
const sessionTitleError = document.querySelector("#session-title-error");
const sessionTitleNext = document.querySelector("#session-title-next");
const sessionTitleHelpDefault =
  "세션을 구분할 수 있도록 2자 이상 입력해 주세요.";

const runningDurationRange = document.querySelector("#running-duration-range");
const runningDurationValue = document.querySelector("#running-duration-value");
const breakOption = document.querySelector("#break-option");
const breakOptions = document.querySelector("#break-options");

const sessionOptionPrev = document.querySelector("#session-option-prev");
const sessionOptionNext = document.querySelector("#session-option-next");
const sessionSummaryPrev = document.querySelector("#session-summary-prev");
const sessionFinishButton = document.querySelector("#session-finish-button");
const sessionFinishLabel = "설정 완료하기";
const sessionRestartButton = document.querySelector("#session-restart-button");
const sessionSubmitStatus = document.querySelector("#session-submit-status");
const sessionCompleteMessage = document.querySelector(
  "#session-complete-message",
);
const sessionCompleteDefaultText =
  "설정한 러닝 조건을 확인했습니다. 이 설정으로 바로 러닝을 시작하거나 처음부터 다시 설정할 수 있습니다.";

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

// 주소에 ?save-error=1 이 있으면 저장을 일부러 실패시킨다
const forceSaveFailure = new URLSearchParams(location.search).has("save-error");

let currentRunningStep = 0;

function showRunningStep(index) {
  runningSteps.forEach((step, i) => {
    step.hidden = i !== index;
  });

  // 단계마다 data-progress로 진행 표시 칸을 연결한다 (완료 화면은 표시 없음)
  const activeProgress = runningSteps[index].dataset.progress;

  progressItems.forEach((item) => {
    const isCurrent = item.dataset.progress === activeProgress;

    item.classList.toggle("is-active", isCurrent);

    // 11주차: 색뿐 아니라 코드에도 현재 단계를 알린다
    if (isCurrent) {
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  currentRunningStep = index;

  const activeStep = runningSteps[index];
  const heading =
    activeStep.querySelector("h3") ||
    activeStep.querySelector("h1, h2, h4, h5, h6");

  if (!heading) return;

  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

// 러닝 안전 안내 다이얼로그
const runningGuideDialog = document.querySelector("#running-guide-dialog");
const runningGuideCancel = document.querySelector("#running-guide-cancel");
const runningGuideConfirm = document.querySelector("#running-guide-confirm");

function revokeRunningAgreement() {
  resetPlayer();
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
  resetPlayer();
  runningFlow.hidden = false;
  showRunningStep(0);
  runningFlow.scrollIntoView({ behavior: "smooth" });
  sessionTitleInput.focus();
});

// 세션 이름: 글자 수와 조건 충족 표시. 오류가 확정되기 전에는 빨갛게 바꾸지 않는다
function updateTitleExperience() {
  const length = sessionTitleInput.value.length;
  sessionTitleCount.textContent = length + " / 20자";

  const meetsLength = sessionTitleInput.value.trim().length >= 2;
  const invalid = sessionTitleInput.getAttribute("aria-invalid") === "true";

  if (!invalid && meetsLength) {
    sessionTitleField.classList.add("is-valid");
    sessionTitleHelp.textContent = "입력 조건을 충족했습니다.";
    return;
  }

  sessionTitleField.classList.remove("is-valid");
  sessionTitleHelp.textContent = sessionTitleHelpDefault;
}

function showTitleError(message) {
  sessionTitleInput.setAttribute("aria-invalid", "true");
  sessionTitleError.textContent = message;
  sessionTitleField.classList.remove("is-valid");
  sessionTitleField.classList.add("has-error");
  sessionTitleHelp.textContent = sessionTitleHelpDefault;
  return false;
}

function clearTitleError() {
  sessionTitleInput.removeAttribute("aria-invalid");
  sessionTitleError.textContent = "";
  sessionTitleField.classList.remove("has-error");
  updateTitleExperience();
}

function validateSessionTitle() {
  const value = sessionTitleInput.value.trim();

  if (!value) {
    return showTitleError("러닝 세션 이름을 입력해 주세요.");
  }

  if (value.length < 2) {
    return showTitleError("러닝 세션 이름을 2자 이상 입력해 주세요.");
  }

  clearTitleError();
  return true;
}

sessionTitleInput.addEventListener("input", () => {
  const invalid = sessionTitleInput.getAttribute("aria-invalid") === "true";

  updateTitleExperience();

  if (invalid) validateSessionTitle();
});

sessionTitleNext.addEventListener("click", () => {
  if (!validateSessionTitle()) {
    sessionTitleInput.focus();
    return;
  }

  showRunningStep(1);
});

// 러닝 시간 변경
runningDurationRange.addEventListener("input", () => {
  runningDurationValue.value =
    runningDurationValues[Number(runningDurationRange.value)] + "분";
});

// 휴식 체크와 횟수 라디오를 같이 맞춘다. 꺼지면 라디오가 제출에서 빠진다
function syncBreakFields() {
  const included = breakOption.checked;

  breakOption.setAttribute("aria-expanded", included ? "true" : "false");
  breakOptions.hidden = !included;

  breakOptions.querySelectorAll('input[name="break-count"]').forEach((input) => {
    input.disabled = !included;
  });
}

breakOption.addEventListener("change", syncBreakFields);
syncBreakFields();

// 이전 단계
sessionOptionPrev.addEventListener("click", () => {
  showRunningStep(0);
});

function collectSessionData() {
  const formData = new FormData(sessionForm);
  const titleValue = formData.get("title");
  const title = titleValue ? String(titleValue).trim() : "";
  const duration = runningDurationValues[Number(formData.get("duration-index"))];
  const includeBreaks = formData.get("breaks") === "included";
  const breakCountValue = formData.get("break-count");
  const breakCount = breakCountValue ? String(breakCountValue) : "2";

  return {
    title: title,
    duration: duration,
    includeBreaks: includeBreaks,
    breakCount: breakCount,
  };
}

function applySessionData(data) {
  sessionData.title = data.title;
  sessionData.duration = data.duration;
  sessionData.includeBreaks = data.includeBreaks;
  sessionData.breakCount = data.breakCount;
}

// 설정 확인
sessionOptionNext.addEventListener("click", () => {
  const data = collectSessionData();
  applySessionData(data);

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

function setSubmitState(loading, message) {
  sessionForm.setAttribute("aria-busy", loading ? "true" : "false");
  sessionFinishButton.disabled = loading;
  sessionFinishButton.textContent = loading ? "저장하는 중…" : sessionFinishLabel;
  sessionSummaryPrev.disabled = loading;
  sessionSubmitStatus.textContent = message;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function persistSession(data) {
  return wait(600).then(() => {
    if (forceSaveFailure) {
      throw new Error("러닝 세션 설정을 저장하지 못했습니다.");
    }

    try {
      const saved = localStorage.getItem("runmate-sessions");
      const sessions = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(sessions)) {
        throw new Error("러닝 세션 저장 형식이 올바르지 않습니다.");
      }

      const id =
        window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : String(Date.now()) + Math.random().toString(16).slice(2);

      sessions.unshift({
        id: id,
        ...data,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("runmate-sessions", JSON.stringify(sessions));
    } catch (error) {
      throw error;
    }
  });
}

function handleSessionSubmit(event) {
  event.preventDefault();

  if (sessionForm.getAttribute("aria-busy") === "true") return;

  if (currentRunningStep === 0) {
    sessionTitleNext.click();
    return;
  }

  if (currentRunningStep === 1) {
    sessionOptionNext.click();
    return;
  }

  if (currentRunningStep !== 2) return;

  if (!validateSessionTitle()) {
    showRunningStep(0);
    requestAnimationFrame(() => {
      const invalidField = sessionForm.querySelector('[aria-invalid="true"]');

      if (invalidField) invalidField.focus();
    });
    return;
  }

  const data = collectSessionData();
  applySessionData(data);
  setSubmitState(true, "러닝 세션 설정을 저장하고 있습니다.");

  persistSession(data).then(
    () => {
      setSubmitState(false, "러닝 세션 설정을 저장했습니다.");
      renderRecords();
      sessionCompleteMessage.textContent =
        "‘" +
        data.title +
        "’ 설정을 저장했습니다. 이제 이 설정으로 러닝을 시작할 수 있습니다.";
      showRunningStep(3);
    },
    () => {
      setSubmitState(
        false,
        "저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요.",
      );
    },
  );
}

sessionForm.addEventListener("submit", handleSessionSubmit);

// 처음부터 다시 설정
function resetSessionSetup() {
  sessionForm.reset();
  syncBreakFields();

  sessionTitleInput.removeAttribute("aria-invalid");
  sessionTitleError.textContent = "";
  sessionTitleField.classList.remove("is-valid", "has-error");
  updateTitleExperience();
  setSubmitState(false, "");

  sessionData.title = "";
  sessionData.duration = "20";
  sessionData.includeBreaks = false;
  sessionData.breakCount = "2";

  runningDurationValue.value = "20분";

  summarySessionTitle.textContent = "";
  summaryRunningDuration.textContent = "";
  summaryBreaks.textContent = "";
  sessionCompleteMessage.textContent = sessionCompleteDefaultText;

  showRunningStep(0);
  sessionTitleInput.focus();
}

sessionRestartButton.addEventListener("click", resetSessionSetup);

// ===== 중간고사: 인터벌 러닝 세션 플레이어 =====

// 화면 단계 번호 (runningSteps 안의 순서)
const COMPLETE_STEP = 3;
const READY_STEP = 4;
const RUN_STEP = 5;
const RESULT_STEP = 6;

// 구간 생성 기준 (모두 초 단위)
const REST_SECONDS = 60;
const MIN_RUN_SECONDS = 120;
const TICK_MS = 200;

const segmentNames = {
  warmup: "워밍업 걷기",
  run: "달리기",
  rest: "걷기 휴식",
  cooldown: "쿨다운 걷기",
};

const playerOpenButton = document.querySelector("#player-open-button");

const readySessionTitle = document.querySelector("#ready-session-title");
const readyTotalTime = document.querySelector("#ready-total-time");
const readyDemoTime = document.querySelector("#ready-demo-time");
const readyBreakCount = document.querySelector("#ready-break-count");
const readySegmentCount = document.querySelector("#ready-segment-count");
const readyAdjustMessage = document.querySelector("#ready-adjust-message");
const readyTimeline = document.querySelector("#ready-timeline");

const voiceOption = document.querySelector("#voice-option");
const voiceOptionHelp = document.querySelector("#voice-option-help");
const vibrateOption = document.querySelector("#vibrate-option");
const vibrateOptionHelp = document.querySelector("#vibrate-option-help");
const speedOption = document.querySelector("#speed-option");
const speedTimeNote = document.querySelector("#speed-time-note");

const playerReadyPrev = document.querySelector("#player-ready-prev");
const playerStartButton = document.querySelector("#player-start-button");

const playerStage = document.querySelector("#player-stage");
const playerSegmentLabel = document.querySelector("#player-segment-label");
const playerRing = document.querySelector("#player-ring");
const playerRemaining = document.querySelector("#player-remaining");
const playerRemainingCaption = document.querySelector(
  "#player-remaining-caption",
);
const playerNext = document.querySelector("#player-next");
const playerSpeedNote = document.querySelector("#player-speed-note");
const playerStatus = document.querySelector("#player-status");
const playerOverallText = document.querySelector("#player-overall-text");
const playerOverallBar = document.querySelector("#player-overall-bar");
const runTimeline = document.querySelector("#run-timeline");

const playerCountdownCancel = document.querySelector(
  "#player-countdown-cancel",
);
const playerPauseButton = document.querySelector("#player-pause-button");
const playerResumeButton = document.querySelector("#player-resume-button");
const playerSkipButton = document.querySelector("#player-skip-button");
const playerStopButton = document.querySelector("#player-stop-button");

const stopRunDialog = document.querySelector("#stop-run-dialog");
const stopRunContinue = document.querySelector("#stop-run-continue");
const stopRunConfirm = document.querySelector("#stop-run-confirm");

const resultCard = document.querySelector("#result-card");
const resultBadge = document.querySelector("#result-badge");
const resultTitle = document.querySelector("#result-title");
const resultDescription = document.querySelector("#result-description");
const resultStats = document.querySelector("#result-stats");
const resultSessionTitle = document.querySelector("#result-session-title");
const resultElapsed = document.querySelector("#result-elapsed");
const resultDemoRow = document.querySelector("#result-demo-row");
const resultDemoElapsed = document.querySelector("#result-demo-elapsed");
const resultRunElapsed = document.querySelector("#result-run-elapsed");
const resultCompleted = document.querySelector("#result-completed");
const resultSkipped = document.querySelector("#result-skipped");
const resultRate = document.querySelector("#result-rate");
const resultSpeedNote = document.querySelector("#result-speed-note");
const resultSuggestion = document.querySelector("#result-suggestion");

const playerNewSession = document.querySelector("#player-new-session");
const playerAgainButton = document.querySelector("#player-again-button");

const canSpeak =
  "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

// 데스크톱 Chrome에도 vibrate가 있지만 울리지 않으므로 터치 기기인지도 확인한다
const canVibrate =
  "vibrate" in navigator && window.matchMedia("(pointer: coarse)").matches;

// 상태: ready | countdown | running | paused | finished | stopped | empty
const player = {
  state: "ready",
  plan: null,
  index: 0,
  segmentElapsed: 0,
  totalElapsed: 0,
  runElapsed: 0,
  demoElapsed: 0,
  lastTick: 0,
  completed: 0,
  skipped: 0,
  segmentStatus: [],
  countdown: 3,
  timerId: null,
  countdownId: null,
  resumeAfterDialog: false,
};

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;

  return minutes + ":" + String(rest).padStart(2, "0");
}

function formatKoreanTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);

  if (minutes === 0) return rest + "초";
  if (rest === 0) return minutes + "분";

  return minutes + "분 " + rest + "초";
}

// 7주차 설정값(sessionData)으로 구간을 만든다
function buildIntervals(data) {
  const totalSeconds = Number(data.duration) * 60;
  const edgeSeconds = totalSeconds <= 600 ? 60 : 120;
  const requestedBreaks = data.includeBreaks ? Number(data.breakCount) : 0;

  let breaks = requestedBreaks;

  // 달리기 한 구간이 최소 시간보다 짧아지면 휴식을 하나씩 줄인다
  function runLength(count) {
    return (totalSeconds - edgeSeconds * 2 - REST_SECONDS * count) / (count + 1);
  }

  while (breaks > 0 && runLength(breaks) < MIN_RUN_SECONDS) {
    breaks -= 1;
  }

  let adjustMessage = "";

  if (breaks !== requestedBreaks) {
    adjustMessage =
      data.duration +
      "분 세션에 휴식 " +
      requestedBreaks +
      "회를 넣으면 달리기 한 구간이 " +
      formatKoreanTime(runLength(requestedBreaks)) +
      "로 너무 짧아져요. 달리기 한 구간을 최소 2분으로 지키기 위해 휴식을 " +
      breaks +
      "회로 줄였어요.";
  }

  const runCount = breaks + 1;
  const runTotal = totalSeconds - edgeSeconds * 2 - REST_SECONDS * breaks;
  const baseRun = Math.floor(runTotal / runCount);
  const extra = runTotal - baseRun * runCount;

  const segments = [{ kind: "warmup", seconds: edgeSeconds }];

  for (let i = 0; i < runCount; i += 1) {
    const isLastRun = i === runCount - 1;

    segments.push({
      kind: "run",
      seconds: baseRun + (isLastRun ? extra : 0),
      runNumber: i + 1,
      runCount,
    });

    if (i < breaks) {
      segments.push({ kind: "rest", seconds: REST_SECONDS });
    }
  }

  segments.push({ kind: "cooldown", seconds: edgeSeconds });

  return {
    title: data.title,
    duration: Number(data.duration),
    totalSeconds,
    requestedBreaks,
    breaks,
    adjustMessage,
    segments,
  };
}

function segmentLabel(segment) {
  if (segment.kind === "run" && segment.runCount > 1) {
    return segmentNames.run + " " + segment.runNumber + "/" + segment.runCount;
  }

  return segmentNames[segment.kind];
}

function renderTimeline(container) {
  container.textContent = "";

  const bar = document.createElement("div");
  bar.className = "timeline-bar";
  bar.setAttribute("aria-hidden", "true");

  const list = document.createElement("ol");
  list.className = "timeline-list";

  player.plan.segments.forEach((segment, i) => {
    const status = player.segmentStatus[i] || "";
    const isCurrent =
      i === player.index &&
      ["running", "paused"].includes(player.state);

    const block = document.createElement("span");
    block.className = "timeline-block kind-" + segment.kind;
    block.style.flexGrow = segment.seconds;
    block.classList.toggle("is-current", isCurrent);
    block.classList.toggle("is-done", status === "done");
    block.classList.toggle("is-skipped", status === "skipped");
    bar.append(block);

    const item = document.createElement("li");
    item.className = "kind-" + segment.kind;
    item.classList.toggle("is-current", isCurrent);
    item.classList.toggle("is-done", status === "done");
    item.classList.toggle("is-skipped", status === "skipped");

    let stateText = "";
    if (isCurrent) stateText = "진행 중";
    if (status === "done") stateText = "완료";
    if (status === "skipped") stateText = "건너뜀";

    // 상태 글자는 이름 옆이 아니라 두 번째 줄에 따로 둔다
    item.innerHTML =
      '<span class="timeline-name"></span><span class="timeline-time"></span>' +
      '<span class="timeline-state"></span>';
    item.querySelector(".timeline-name").textContent = segmentLabel(segment);
    item.querySelector(".timeline-state").textContent = stateText;
    item.querySelector(".timeline-time").textContent = formatKoreanTime(
      segment.seconds,
    );

    if (isCurrent) item.setAttribute("aria-current", "step");

    list.append(item);
  });

  container.append(bar, list);
}

// 음성·진동 지원 여부 안내
function setupFeedbackOptions() {
  if (!canSpeak) {
    voiceOption.checked = false;
    voiceOption.disabled = true;
    voiceOptionHelp.textContent =
      "이 브라우저는 음성 안내를 지원하지 않아요. 화면 안내로 진행돼요.";
  }

  if (!canVibrate) {
    vibrateOption.checked = false;
    vibrateOption.disabled = true;
    vibrateOptionHelp.textContent =
      "진동을 지원하는 휴대폰에서만 사용할 수 있어요.";
  }
}

function speak(text) {
  if (!canSpeak || !voiceOption.checked) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  window.speechSynthesis.speak(utterance);
}

function vibrate() {
  if (!canVibrate || !vibrateOption.checked) return;

  navigator.vibrate([200, 100, 200]);
}

function clearPlayerTimers() {
  clearInterval(player.timerId);
  clearInterval(player.countdownId);
  player.timerId = null;
  player.countdownId = null;
}

// 플레이어만 초기화 (7주차 설정과 옵션은 그대로)
function resetPlayer() {
  clearPlayerTimers();

  if (stopRunDialog.open) stopRunDialog.close();
  if (canSpeak) window.speechSynthesis.cancel();

  player.state = "ready";
  player.index = 0;
  player.segmentElapsed = 0;
  player.totalElapsed = 0;
  player.runElapsed = 0;
  player.demoElapsed = 0;
  player.lastTick = 0;
  player.completed = 0;
  player.skipped = 0;
  player.segmentStatus = [];
  player.countdown = 3;
  player.resumeAfterDialog = false;
  playerStatus.textContent = "";
}

function openReadyScreen() {
  resetPlayer();
  player.plan = buildIntervals(sessionData);

  const plan = player.plan;

  readySessionTitle.textContent = "‘" + plan.title + "’";
  readyTotalTime.textContent = plan.duration + "분";
  readyBreakCount.textContent =
    plan.requestedBreaks === 0
      ? "설정하지 않음"
      : plan.breaks === plan.requestedBreaks
        ? plan.breaks + "회 (1회 1분)"
        : plan.breaks + "회 (요청 " + plan.requestedBreaks + "회에서 조정)";
  readySegmentCount.textContent = plan.segments.length + "개";
  updateSpeedNote();

  readyAdjustMessage.textContent = plan.adjustMessage;
  readyAdjustMessage.hidden = plan.adjustMessage === "";

  renderTimeline(readyTimeline);
  showRunningStep(READY_STEP);
  playerStartButton.focus();
}

// 11주차(10주차 코멘트 반영): 배속·휴식을 바꿔도 실제 운동 시간과 화면 시연 시간을 구분해 보여 준다
function updateSpeedNote() {
  const plan = player.plan;

  if (!plan) return;

  const speed = Number(speedOption.value);
  const demoSeconds = Math.round(plan.totalSeconds / speed);
  const restText =
    plan.breaks > 0 ? "걷기 휴식 " + plan.breaks + "회 포함" : "휴식 없음";

  if (speed === 1) {
    readyDemoTime.textContent = plan.duration + "분 (실제 시간과 같음)";
    speedTimeNote.textContent =
      "1배는 실제 시간 그대로 진행해요. 실제 운동 " +
      plan.duration +
      "분(" +
      restText +
      ")이 화면에서도 " +
      plan.duration +
      "분 걸려요.";
    playerSpeedNote.hidden = true;
    playerSpeedNote.textContent = "";
    return;
  }

  readyDemoTime.textContent =
    "약 " + formatKoreanTime(demoSeconds) + " (" + speed + "배 시연)";
  speedTimeNote.textContent =
    "실제 운동 " +
    plan.duration +
    "분(" +
    restText +
    ")을 화면에서는 약 " +
    formatKoreanTime(demoSeconds) +
    " 만에 보여 줘요. 남은 시간 숫자는 실제 운동 시간 기준이에요.";
  playerSpeedNote.hidden = false;
  playerSpeedNote.textContent =
    speed +
    "배 시연 중 · 남은 시간은 실제 운동 시간 기준이에요. 화면에서는 약 " +
    formatKoreanTime(demoSeconds) +
    " 만에 끝나요.";
}

speedOption.addEventListener("change", updateSpeedNote);

// 진행 화면 버튼 표시를 상태에 맞춘다
function updateControls() {
  const state = player.state;
  const isCountdown = state === "countdown";

  playerCountdownCancel.hidden = !isCountdown;
  playerPauseButton.hidden = isCountdown || state === "paused";
  playerResumeButton.hidden = state !== "paused";
  playerSkipButton.hidden = isCountdown;
  playerStopButton.hidden = isCountdown;
}

function renderPlayer() {
  const plan = player.plan;
  playerStage.classList.toggle("is-paused", player.state === "paused");
  updateControls();

  if (player.state === "countdown") {
    playerStage.dataset.kind = "ready";
    playerSegmentLabel.textContent = "곧 시작해요";
    playerRemaining.textContent = player.countdown;
    playerRemainingCaption.textContent = "초 후 시작";
    playerRing.style.setProperty("--progress", player.countdown / 3);
    playerNext.textContent = "첫 구간: " + segmentLabel(plan.segments[0]);
    playerOverallText.textContent = "0%";
    playerOverallBar.style.width = "0%";
    return;
  }

  const segment = plan.segments[player.index];
  const remaining = segment.seconds - player.segmentElapsed / 1000;
  const next = plan.segments[player.index + 1];
  const overall = Math.min(
    100,
    Math.floor((player.totalElapsed / 1000 / plan.totalSeconds) * 100),
  );

  playerStage.dataset.kind = segment.kind;
  playerSegmentLabel.textContent = segmentLabel(segment);
  playerRemaining.textContent = formatTime(remaining);
  playerRemainingCaption.textContent =
    player.state === "paused" ? "일시정지 중" : "남음";
  playerRing.style.setProperty(
    "--progress",
    Math.max(0, remaining / segment.seconds),
  );
  playerNext.textContent = next
    ? "다음: " + segmentLabel(next) + " " + formatKoreanTime(next.seconds)
    : "마지막 구간이에요";
  playerOverallText.textContent = overall + "%";
  playerOverallBar.style.width = overall + "%";
}

function announceSegment() {
  const segment = player.plan.segments[player.index];
  const time = formatKoreanTime(segment.seconds);
  const voiceName =
    segment.kind === "run" && segment.runCount > 1
      ? segment.runNumber + "번째 달리기"
      : segmentLabel(segment);

  playerStatus.textContent = segmentLabel(segment) + " 시작 · " + time;
  speak(voiceName + " 시작, " + time);
  vibrate();
}

function startCountdown() {
  resetPlayer();
  player.state = "countdown";

  // 사용자가 버튼을 누른 순간 첫 음성을 재생해야 이후 안내도 나온다
  speak("3초 후 러닝을 시작합니다");

  showRunningStep(RUN_STEP);
  renderTimeline(runTimeline);
  renderPlayer();
  playerStatus.textContent = "3초 후 러닝을 시작해요.";
  playerCountdownCancel.focus();

  // 카운트다운은 배속과 상관없이 실제 3초
  player.countdownId = setInterval(() => {
    player.countdown -= 1;

    if (player.countdown > 0) {
      renderPlayer();
      return;
    }

    clearInterval(player.countdownId);
    player.countdownId = null;
    beginSession();
  }, 1000);
}

function cancelCountdown(message) {
  openReadyScreen();
  readyAdjustMessage.hidden = false;
  readyAdjustMessage.textContent = message;

  if (player.plan.adjustMessage) {
    readyAdjustMessage.textContent += " " + player.plan.adjustMessage;
  }
}

function beginSession() {
  player.state = "running";
  player.index = 0;
  announceSegment();
  startTicking();
  renderTimeline(runTimeline);
  renderPlayer();
  playerPauseButton.focus();
}

function startTicking() {
  clearInterval(player.timerId);
  player.lastTick = Date.now();
  player.timerId = setInterval(tick, TICK_MS);
}

// 실제 흐른 시간 × 배속만큼 세션 시간을 진행한다
function tick() {
  if (player.state !== "running") return;

  const now = Date.now();
  const delta = (now - player.lastTick) * Number(speedOption.value);
  player.lastTick = now;

  let leftDelta = delta;

  // 배속이 커서 한 번에 구간을 넘어가도 구간별로 나눠서 시간을 더한다
  while (leftDelta > 0) {
    const segment = player.plan.segments[player.index];
    const step = Math.min(
      segment.seconds * 1000 - player.segmentElapsed,
      leftDelta,
    );

    player.segmentElapsed += step;
    player.totalElapsed += step;
    player.demoElapsed += step / Number(speedOption.value);
    if (segment.kind === "run") player.runElapsed += step;
    leftDelta -= step;

    if (player.segmentElapsed < segment.seconds * 1000) break;

    markSegment("done");

    if (player.index === player.plan.segments.length - 1) {
      finishSession();
      return;
    }

    player.index += 1;
    player.segmentElapsed = 0;
    announceSegment();
    renderTimeline(runTimeline);
  }

  renderPlayer();
}

function markSegment(status) {
  player.segmentStatus[player.index] = status;

  if (status === "done") {
    player.completed += 1;
  } else {
    player.skipped += 1;
  }
}

function pausePlayer(message) {
  if (player.state !== "running") return;

  tick();
  if (player.state !== "running") return;

  clearInterval(player.timerId);
  player.timerId = null;
  player.state = "paused";
  playerStatus.textContent = message;
  renderTimeline(runTimeline);
  renderPlayer();
}

function resumePlayer() {
  if (player.state !== "paused") return;

  player.state = "running";
  playerStatus.textContent = "다시 달려요. 남은 시간부터 이어서 진행해요.";
  startTicking();
  renderTimeline(runTimeline);
  renderPlayer();
  playerPauseButton.focus();
}

function skipSegment() {
  if (!["running", "paused"].includes(player.state)) return;

  if (player.state === "running") tick();
  if (!["running", "paused"].includes(player.state)) return;

  const skippedName = segmentLabel(player.plan.segments[player.index]);
  markSegment("skipped");

  if (player.index === player.plan.segments.length - 1) {
    finishSession();
    return;
  }

  player.index += 1;
  player.segmentElapsed = 0;
  player.lastTick = Date.now();

  if (player.state === "running") {
    announceSegment();
    playerStatus.textContent =
      skippedName + " 구간을 건너뛰었어요. " + playerStatus.textContent;
  } else {
    playerStatus.textContent =
      skippedName +
      " 구간을 건너뛰었어요. 일시정지 중이에요. 계속하려면 [계속]을 눌러주세요.";
  }

  renderTimeline(runTimeline);
  renderPlayer();
}

// 달리기 구간을 1초도 진행하지 않았으면(시작 전이거나 모두 건너뜀) 결과 없음
function hasRunResult() {
  return player.runElapsed >= 1000;
}

function finishSession() {
  endSession(hasRunResult() ? "finished" : "empty");
}

function endSession(result) {
  clearPlayerTimers();
  player.state = result;

  const plan = player.plan;
  const total = plan.segments.length;
  const rate = Math.round((player.completed / total) * 100);
  const speed = Number(speedOption.value);

  resultCard.dataset.result = result;
  resultStats.hidden = result === "empty";
  resultSessionTitle.textContent = plan.title;
  resultElapsed.textContent = formatKoreanTime(
    Math.round(player.totalElapsed / 1000),
  );
  resultRunElapsed.textContent = formatKoreanTime(
    Math.round(player.runElapsed / 1000),
  );
  resultCompleted.textContent = player.completed + " / " + total + "개";
  resultSkipped.textContent = player.skipped + "개";
  resultRate.textContent = rate + "%";

  const isDemo = speed !== 1;
  resultDemoRow.hidden = !isDemo;
  resultDemoElapsed.textContent =
    "약 " + formatKoreanTime(Math.round(player.demoElapsed / 1000));

  resultSpeedNote.hidden = result === "empty" || !isDemo;
  resultSpeedNote.textContent =
    "시연 배속 " +
    speed +
    "배로 진행했어요. 위의 진행 시간은 실제로 달렸다면 걸렸을 운동 시간이고, 화면에서는 약 " +
    formatKoreanTime(Math.round(player.demoElapsed / 1000)) +
    "가 걸렸어요. 거리·페이스는 측정하지 않아요.";

  if (result === "finished") {
    resultBadge.textContent = "완주";
    resultTitle.textContent = "세션을 끝까지 완주했어요!";
    resultDescription.textContent =
      player.skipped === 0
        ? "모든 구간을 계획대로 마쳤어요."
        : "마지막 구간까지 도착했지만 건너뛴 구간이 " +
          player.skipped +
          "개 있어요.";
  } else if (result === "stopped") {
    resultBadge.textContent = "중단";
    resultTitle.textContent = "세션을 중간에 마쳤어요.";
    resultDescription.textContent =
      "그만둔 시점까지 끝까지 마친 구간만 완료로 셌어요. 진행 중이던 구간은 완료에 넣지 않았어요.";
  } else {
    resultBadge.textContent = "결과 없음";
    resultTitle.textContent =
      "아직 달리기 구간을 진행하지 않아 기록할 결과가 없어요.";
    resultDescription.textContent =
      "같은 설정으로 다시 달리거나 새 세션을 설정해보세요.";
  }

  resultSuggestion.textContent = makeSuggestion(result);
  resultSuggestion.hidden = result === "empty";

  speak(resultTitle.textContent);
  showRunningStep(RESULT_STEP);
  playerAgainButton.focus();
}

// 결과에 따라 다음 세션을 제안한다
function makeSuggestion(result) {
  const plan = player.plan;
  const perfect = result === "finished" && player.skipped === 0;

  if (perfect) {
    if (plan.duration < 30) {
      return (
        "다음 세션 제안: 러닝 시간을 " +
        (plan.duration + 10) +
        "분으로 조금 늘려보세요."
      );
    }

    return plan.breaks > 0
      ? "다음 세션 제안: 30분은 그대로 두고 걷기 휴식을 1회 줄여보세요."
      : "다음 세션 제안: 지금 강도를 유지하며 꾸준히 이어가요.";
  }

  return plan.breaks < 3
    ? "다음 세션 제안: " +
        plan.duration +
        "분에 익숙해질 때까지 같은 시간으로 달리고, 걷기 휴식을 1회 늘려보세요."
    : "다음 세션 제안: " +
        plan.duration +
        "분에 익숙해질 때까지 같은 설정으로 다시 달려보세요.";
}

function openStopDialog() {
  if (!["running", "paused"].includes(player.state)) return;

  player.resumeAfterDialog = player.state === "running";
  pausePlayer("그만둘지 확인하는 동안 잠시 멈췄어요.");
  stopRunDialog.showModal();
}

function continueAfterStopDialog() {
  if (player.resumeAfterDialog) {
    resumePlayer();
  } else if (player.state === "paused") {
    playerStatus.textContent =
      "일시정지 중이에요. 계속하려면 [계속]을 눌러주세요.";
  }

  player.resumeAfterDialog = false;
}

// 이벤트 연결
setupFeedbackOptions();

playerOpenButton.addEventListener("click", openReadyScreen);

playerReadyPrev.addEventListener("click", () => {
  resetPlayer();
  showRunningStep(COMPLETE_STEP);
  playerOpenButton.focus();
});

playerStartButton.addEventListener("click", startCountdown);

playerCountdownCancel.addEventListener("click", () => {
  cancelCountdown("시작을 취소했어요. 준비되면 [러닝 시작]을 눌러주세요.");
});

playerPauseButton.addEventListener("click", () => {
  pausePlayer("일시정지 중이에요. 계속하려면 [계속]을 눌러주세요.");
  playerResumeButton.focus();
});

playerResumeButton.addEventListener("click", resumePlayer);
playerSkipButton.addEventListener("click", skipSegment);
playerStopButton.addEventListener("click", openStopDialog);

stopRunContinue.addEventListener("click", () => {
  stopRunDialog.close();
  continueAfterStopDialog();
});

// Esc로 닫으면 계속하기와 같게 처리한다
stopRunDialog.addEventListener("cancel", continueAfterStopDialog);

stopRunConfirm.addEventListener("click", () => {
  stopRunDialog.close();
  player.resumeAfterDialog = false;
  endSession(hasRunResult() ? "stopped" : "empty");
});

playerAgainButton.addEventListener("click", openReadyScreen);

playerNewSession.addEventListener("click", () => {
  resetPlayer();
  resetSessionSetup();
  sessionTitleInput.focus();
});

// 탭을 벗어나면 자동 일시정지 (돌아와도 자동 재개하지 않음)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) return;

  if (player.state === "countdown") {
    cancelCountdown("다른 화면으로 이동해서 시작을 취소했어요.");
    return;
  }

  if (stopRunDialog.open) return;

  pausePlayer(
    "다른 화면으로 이동해서 자동으로 일시정지했어요. 준비되면 [계속]을 눌러주세요.",
  );
});

// ===== 10주차: 내비게이션과 내 러닝 기록 필터 =====

// 주요 메뉴와 현재 위치
const navLinks = document.querySelectorAll(".main-nav a");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

function updateCurrentNav() {
  const currentHash = window.location.hash;
  const hasMatch = Array.from(navLinks).some(
    (link) => link.getAttribute("href") === currentHash,
  );

  navLinks.forEach((link) => {
    // 주소에 메뉴 목적지가 없으면 첫 메뉴를 현재 위치로 본다
    const current = hasMatch
      ? link.getAttribute("href") === currentHash
      : link === navLinks[0];

    link.classList.toggle("is-current", current);

    if (current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // 11주차: 현재 메뉴 이름을 브라우저 탭 제목에도 반영한다
  const currentLink = document.querySelector('.main-nav a[aria-current="page"]');
  const pageName = currentLink ? currentLink.textContent.trim() : "서비스 소개";
  document.title = pageName + " | " + serviceName;
}

window.addEventListener("hashchange", updateCurrentNav);
updateCurrentNav();

function setMenuOpen(isOpen) {
  mainNav.classList.toggle("is-open", isOpen);
  menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!mainNav.classList.contains("is-open"));
});

// 목적지를 고르면 메뉴를 닫는다
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMenuOpen(false);
  });
});

// Esc로 열린 메뉴를 닫고 메뉴 버튼으로 돌아간다
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !mainNav.classList.contains("is-open")) return;

  setMenuOpen(false);
  menuToggle.focus();
});

// 내 러닝 기록: 9주차에 저장한 runmate-sessions를 카드로 보여 준다
const RECORDS_KEY = "runmate-sessions";
const recordsList = document.querySelector("#records-list");
const recordsEmpty = document.querySelector("#records-empty");
const recordsCount = document.querySelector("#records-count");
const recordsMessage = document.querySelector("#records-message");
const filterButtons = document.querySelectorAll(".filter-button");
const openRecordIds = new Set();
let currentFilter = "all";

function getSessions() {
  try {
    const saved = localStorage.getItem(RECORDS_KEY);
    const sessions = saved ? JSON.parse(saved) : [];

    return Array.isArray(sessions) ? sessions : [];
  } catch (error) {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(sessions));
    return true;
  } catch (error) {
    return false;
  }
}

// all: 전체, active: 취소하지 않은 설정, cancelled: 취소한 설정
function getVisibleSessions(sessions) {
  return sessions.filter((session) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "cancelled") return session.cancelled === true;
    return session.cancelled !== true;
  });
}

function formatSavedDate(isoText) {
  const date = new Date(isoText);

  if (Number.isNaN(date.getTime())) return "날짜 정보 없음";

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function createSummaryRow(label, value) {
  const row = document.createElement("div");
  const name = document.createElement("span");
  const text = document.createElement("strong");

  name.textContent = label;
  text.textContent = value;
  row.append(name, text);

  return row;
}

function createRecordCard(session) {
  const cancelled = session.cancelled === true;
  const isOpen = openRecordIds.has(session.id);
  const detailId = "record-detail-" + session.id;

  const card = document.createElement("li");
  card.className = "record-card";
  card.dataset.status = cancelled ? "cancelled" : "active";

  const badge = document.createElement("p");
  badge.className = "record-badge";
  badge.textContent = cancelled ? "취소됨" : "저장됨";

  const title = document.createElement("h3");
  title.textContent = session.title || "이름 없는 세션";

  const date = document.createElement("p");
  date.className = "record-date";
  date.textContent = formatSavedDate(session.createdAt) + " 저장";

  const detail = document.createElement("div");
  detail.id = detailId;
  detail.className = "summary-list record-detail";
  detail.hidden = !isOpen;
  detail.append(
    createSummaryRow("러닝 시간", (session.duration || "-") + "분"),
    createSummaryRow(
      "중간 휴식",
      session.includeBreaks ? session.breakCount + "회" : "설정하지 않음",
    ),
    createSummaryRow("상태", cancelled ? "취소한 설정" : "저장된 설정"),
  );

  const actions = document.createElement("div");
  actions.className = "record-actions";

  const viewButton = document.createElement("button");
  viewButton.type = "button";
  viewButton.className = "button-secondary";
  viewButton.dataset.action = "view";
  viewButton.dataset.id = session.id;
  viewButton.setAttribute("aria-expanded", String(isOpen));
  viewButton.setAttribute("aria-controls", detailId);
  viewButton.textContent = isOpen ? "내용 접기" : "내용 보기";
  // 11주차: 카드마다 같은 버튼 문구라 어느 세션인지 이름에 붙인다
  viewButton.setAttribute(
    "aria-label",
    "‘" + (session.title || "이름 없는 세션") + "’ " + viewButton.textContent,
  );
  actions.append(viewButton);

  if (!cancelled) {
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "button-danger";
    cancelButton.dataset.action = "cancel";
    cancelButton.dataset.id = session.id;
    cancelButton.textContent = "설정 취소하기";
    cancelButton.setAttribute(
      "aria-label",
      "‘" + (session.title || "이름 없는 세션") + "’ 설정 취소하기",
    );
    actions.append(cancelButton);
  }

  card.append(badge, title, date, detail, actions);

  return card;
}

function renderRecords() {
  const sessions = getSessions();
  const visibleSessions = getVisibleSessions(sessions);

  recordsList.replaceChildren();
  recordsEmpty.hidden = visibleSessions.length !== 0;
  recordsList.hidden = visibleSessions.length === 0;

  const emptyTitle = recordsEmpty.querySelector("h3");
  const emptyDescription = recordsEmpty.querySelector("p");
  const emptyAction = recordsEmpty.querySelector("a");

  if (visibleSessions.length === 0) {
    const filtered = currentFilter !== "all";

    emptyTitle.textContent = filtered
      ? "선택한 상태의 러닝 설정이 없어요."
      : "아직 저장한 러닝 설정이 없어요.";
    emptyDescription.textContent = filtered
      ? "다른 상태를 선택하거나 전체 기록을 다시 확인해 보세요."
      : "러닝 세션을 설정하고 저장하면 이곳에서 다시 볼 수 있습니다.";

    // 11주차: 필터 결과만 없을 때는 ‘전체 보기’로 돌아갈 길을 보여 준다
    emptyAction.hidden = false;
    emptyAction.textContent = filtered ? "전체 보기" : "러닝 설정하러 가기";
    emptyAction.href = filtered ? "#records" : "#interaction-practice";
  }

  recordsCount.textContent = String(visibleSessions.length);

  visibleSessions.forEach((session) => {
    recordsList.append(createRecordCard(session));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    recordsMessage.textContent = "";

    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    renderRecords();

    // 11주차: 필터 결과 수와 결과 없음을 상태 문장(role="status")으로 알린다
    const count = getVisibleSessions(getSessions()).length;
    const recordName = {
      all: "전체 기록",
      active: "저장된 기록",
      cancelled: "취소된 기록",
    }[currentFilter];

    recordsMessage.textContent =
      count > 0
        ? recordName + " " + count + "개를 표시합니다."
        : recordName +
          "이 없습니다. 다른 상태를 고르거나 ‘전체 보기’를 눌러 보세요.";
  });
});

// 결과 없음의 ‘전체 보기’: 주소 이동 대신 전체 필터를 누르고 초점을 그 버튼에 둔다
recordsEmpty.querySelector("a").addEventListener("click", (event) => {
  if (currentFilter === "all") return;

  event.preventDefault();
  const allButton = document.querySelector('.filter-button[data-filter="all"]');
  allButton.click();
  allButton.focus();
});

recordsList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.action === "view") {
    if (openRecordIds.has(id)) {
      openRecordIds.delete(id);
    } else {
      openRecordIds.add(id);
    }

    renderRecords();
    const sameButton = recordsList.querySelector(
      'button[data-action="view"][data-id="' + CSS.escape(id) + '"]',
    );

    if (sameButton) sameButton.focus();
    return;
  }

  if (button.dataset.action === "cancel") {
    const sessions = getSessions();
    const target = sessions.find((session) => session.id === id);

    if (!target) return;

    target.cancelled = true;
    target.cancelledAt = new Date().toISOString();

    if (!saveSessions(sessions)) {
      recordsMessage.textContent =
        "설정을 취소하지 못했습니다. 잠시 후 다시 시도해 주세요.";
      return;
    }

    renderRecords();
    recordsMessage.textContent =
      "‘" + (target.title || "이름 없는 세션") + "’ 설정을 취소했습니다.";

    // 11주차: 카드가 남아 있으면 그 카드의 버튼으로, 필터에서 사라지면 선택한 필터로 초점을 옮긴다
    const nextButton = recordsList.querySelector(
      'button[data-action="view"][data-id="' + CSS.escape(id) + '"]',
    );
    const selectedFilter = document.querySelector(
      '.filter-button[aria-pressed="true"]',
    );
    (nextButton || selectedFilter).focus();
  }
});

renderRecords();
