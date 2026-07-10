/*
===============================================================================
Mnemply Apps

App:       Foundation Ultimate Challenge
Version:   1.0.0
Author:    Andrew Campbell / Mnemply
Created:   14 June 2026

Description:
Final Foundation challenge. Children solve all Foundation combinations from
1×0 through 6×6 by mentally applying the Flip-It Rule when needed, selecting
the correct Cousin, selecting the correct Mem-Link, decoding the Mem-Link, and
typing the final answer.

Design:
- 42 challenges
- No timer
- No hints or visible Flip-It prompt
- Independently checks Cousin, Mem-Link, and answer
- Only incorrect parts are reset
===============================================================================
*/

const cousins = [
  { number: 1, name: "Olive", file: "Bg_01_Olive.png" },
  { number: 2, name: "Braxton", file: "Bg_02_Braxton.png" },
  { number: 3, name: "Lily", file: "Bg_03_Lily.png" },
  { number: 4, name: "Laiken", file: "Bg_04_Laiken.png" },
  { number: 5, name: "Alice", file: "Bg_05_Alice.png" },
  { number: 6, name: "Joshua", file: "Bg_06_Joshua.png" }
];

const memLinksByCousin = {
  1: [
    { position: 0, name: "Hussey", file: "ML_00_Hussey.png" },
    { position: 1, name: "Hat", file: "ML_01_Hat.png" }
  ],
  2: [
    { position: 0, name: "Hussey", file: "ML_00_Hussey.png" },
    { position: 1, name: "Hen", file: "ML_02_Hen.png" },
    { position: 2, name: "Hare", file: "ML_04_Hare.png" }
  ],
  3: [
    { position: 0, name: "Hussey", file: "ML_00_Hussey.png" },
    { position: 1, name: "Ham", file: "ML_03_Ham.png" },
    { position: 2, name: "Witch", file: "ML_06_Witch.png" },
    { position: 3, name: "Hoop", file: "ML_09_Hoop.png" }
  ],
  4: [
    { position: 0, name: "Hussey", file: "ML_00_Hussey.png" },
    { position: 1, name: "Hare", file: "ML_04_Hare.png" },
    { position: 2, name: "Hoofy", file: "ML_08_Hoofy.png" },
    { position: 3, name: "Tuna", file: "ML_12_Tuna.png" },
    { position: 4, name: "Dish", file: "ML_16_Dish.png" }
  ],
  5: [
    { position: 0, name: "Hussey", file: "ML_00_Hussey.png" },
    { position: 1, name: "Holly", file: "ML_05_Holly.png" },
    { position: 2, name: "Dice", file: "ML_10_Dice.png" },
    { position: 3, name: "Doll", file: "ML_15_Doll.png" },
    { position: 4, name: "Nosey", file: "ML_20_Nosey.png" },
    { position: 5, name: "Nellie", file: "ML_25_Nellie.png" }
  ],
  6: [
    { position: 0, name: "Hussey", file: "ML_00_Hussey.png" },
    { position: 1, name: "Witch", file: "ML_06_Witch.png" },
    { position: 2, name: "Tuna", file: "ML_12_Tuna.png" },
    { position: 3, name: "Dove", file: "ML_18_Dove.png" },
    { position: 4, name: "Winner", file: "ML_24_Winner.png" },
    { position: 5, name: "Mice", file: "ML_30_Mice.png" },
    { position: 6, name: "Mitch", file: "ML_36_Mitch.png" }
  ]
};

const challengeCounter = document.getElementById("challengeCounter");
const equation = document.getElementById("equation");
const cousinDrop = document.getElementById("cousinDrop");
const memLinkDrop = document.getElementById("memLinkDrop");
const cousinTray = document.getElementById("cousinTray");
const memLinkTray = document.getElementById("memLinkTray");
const answerInput = document.getElementById("answerInput");
const message = document.getElementById("message");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const successSound = document.getElementById("successSound");

let challenges = [];
let currentChallengeNumber = 0;
let currentChallenge = null;
let selectedTile = null;

let dragCandidate = null;
let draggingTile = null;
let originalParent = null;
let originalNextSibling = null;
let startX = 0;
let startY = 0;
let lastDragX = 0;
let lastDragY = 0;
let activePointerId = null;
let didDrag = false;
let dragRecoveryTimer = null;
let touchDragActive = false;

const successMessages=["🌟 Excellent!","🎉 Great Job!","⭐ Fantastic!","🥳 You got it!","💚 Brilliant!","🎈 Awesome!","🎊 Well done!"];

const SAVE_KEY = "mnemplyFoundationUltimateChallengeSave_v1";
let isRestoring = false;

function shuffle(array) {
  return array.slice().sort(function () {
    return Math.random() - 0.5;
  });
}

function cousinPath(file) {
  return "../assets/bg-cousins/" + file;
}

function memLinkPath(file) {
  return "../assets/mem-links/" + file;
}

function stopSuccessSound() {
  if (!successSound) return;
  successSound.pause();
  successSound.currentTime = 0;
}

function getPlacedTileData(zone) {
  const tile = zone.querySelector(".tile");
  if (!tile) return null;

  return {
    type: tile.dataset.type,
    value: tile.dataset.value,
    alt: tile.alt
  };
}

function saveProgress() {
  if (isRestoring || !currentChallenge) return;

  const state = {
    challenges: challenges,
    currentChallengeNumber: currentChallengeNumber,
    currentChallenge: currentChallenge,
    cousinTile: getPlacedTileData(cousinDrop),
    memLinkTile: getPlacedTileData(memLinkDrop),
    answer: answerInput.value,
    awaitingNext: !nextBtn.classList.contains("hidden"),
    messageText: message.textContent
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // If localStorage is unavailable, the app still works normally.
  }
}

function clearSavedProgress() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {}
}

function getSavedProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    clearSavedProgress();
    return null;
  }
}

function findTileInTray(type, data) {
  if (!data) return null;

  const tray = type === "cousin" ? cousinTray : memLinkTray;
  const tiles = tray.querySelectorAll(".tile");

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    if (type === "cousin" && tile.dataset.value === String(data.value)) {
      return tile;
    }

    if (type === "memlink" && tile.alt === data.alt) {
      return tile;
    }
  }

  return null;
}

function restorePlacedTiles(state) {
  const cousinTile = findTileInTray("cousin", state.cousinTile);
  const memLinkTile = findTileInTray("memlink", state.memLinkTile);

  if (cousinTile) {
    cousinDrop.innerHTML = "";
    cousinDrop.appendChild(cousinTile);
  }

  if (memLinkTile) {
    memLinkDrop.innerHTML = "";
    memLinkDrop.appendChild(memLinkTile);
  }
}

function showResumePrompt(savedState) {
  const overlay = document.createElement("div");
  overlay.className = "resume-overlay";
  overlay.innerHTML =
    "<div class='resume-card'>" +
    "<h2>🏆 Continue Challenge?</h2>" +
    "<p>We found a saved Foundation Ultimate Challenge.</p>" +
    "<button id='continueChallengeBtn'>Continue</button>" +
    "<button id='startAgainBtn' class='secondary-btn'>Start Again</button>" +
    "</div>";

  document.body.appendChild(overlay);

  document.getElementById("continueChallengeBtn").addEventListener("click", function () {
    overlay.remove();
    restoreGame(savedState);
  });

  document.getElementById("startAgainBtn").addEventListener("click", function () {
    overlay.remove();
    clearSavedProgress();
    startGame();
  });
}

function initialiseGame() {
  const savedState = getSavedProgress();

  if (savedState && savedState.currentChallenge) {
    showResumePrompt(savedState);
  } else {
    startGame();
  }
}

function restoreGame(savedState) {
  isRestoring = true;

  challenges = Array.isArray(savedState.challenges) ? savedState.challenges : [];
  currentChallengeNumber = savedState.currentChallengeNumber || 1;
  currentChallenge = savedState.currentChallenge;

  renderCurrentChallenge();

  answerInput.value = savedState.answer || "";
  restorePlacedTiles(savedState);

  if (savedState.awaitingNext) {
    checkBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    message.textContent = savedState.messageText || "Great work! Tap Next to continue.";
  }

  isRestoring = false;
  saveProgress();
}

function renderCurrentChallenge() {
  challengeCounter.textContent = "Challenge " + currentChallengeNumber;
  equation.textContent = currentChallenge.first + " × " + currentChallenge.second;

  cousinDrop.innerHTML = "";
  memLinkDrop.innerHTML = "";
  cousinTray.innerHTML = "";
  memLinkTray.innerHTML = "";
  answerInput.value = "";
  answerInput.disabled = false;

  message.textContent = "Tap a tile, then tap where it belongs.";
  checkBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  nextBtn.textContent = "Next";
  selectedTile = null;

  shuffle(cousins).forEach(function (cousin) {
    cousinTray.appendChild(
      createTile("cousin", cousin.number, cousinPath(cousin.file), cousin.name)
    );
  });

  shuffle(getUniqueMemLinks()).forEach(function (memLink) {
    memLinkTray.appendChild(
      createTile("memlink", memLink.name, memLinkPath(memLink.file), memLink.name)
    );
  });

  answerInput.focus();
}

function buildChallenges() {
  const list = [];

  for (let first = 1; first <= 6; first++) {
    for (let second = 0; second <= 6; second++) {
      const solved = solveChallenge(first, second);
      list.push({
        first: first,
        second: second,
        correctCousin: solved.correctCousin,
        correctPosition: solved.correctPosition,
        correctAnswer: first * second
      });
    }
  }

  return shuffle(list);
}

function solveChallenge(first, second) {
  if (second > first) {
    return {
      correctCousin: second,
      correctPosition: first
    };
  }

  return {
    correctCousin: first,
    correctPosition: second
  };
}

function startGame() {
  stopSuccessSound();
  clearSavedProgress();
  particles = [];
  challenges = buildChallenges();
  currentChallengeNumber = 0;
  nextBtn.textContent = "Next";
  loadNextChallenge();
}

function loadNextChallenge() {
  stopSuccessSound();

  if (challenges.length === 0) {
    completeGame();
    return;
  }

  currentChallenge = challenges.pop();
  currentChallengeNumber++;

  renderCurrentChallenge();
  saveProgress();
}

function getUniqueMemLinks() {
  const seen = {};
  const list = [];

  Object.keys(memLinksByCousin).forEach(function (key) {
    memLinksByCousin[key].forEach(function (memLink) {
      if (!seen[memLink.file]) {
        seen[memLink.file] = true;
        list.push(memLink);
      }
    });
  });

  return list;
}

function createTile(type, value, src, alt) {
  const img = document.createElement("img");
  img.className = "tile";
  img.src = src;
  img.alt = alt;
  img.dataset.type = type;
  img.dataset.value = value;
  img.draggable = false;

  img.addEventListener("click", function (e) {
    e.stopPropagation();

    if (didDrag) {
      didDrag = false;
      return;
    }

    selectTile(img);
  });

  img.addEventListener("pointerdown", beginPossibleDrag);
  img.addEventListener("touchstart", beginPossibleTouchDrag, { passive: false });

  return img;
}

function beginPossibleDrag(e) {
  if (touchDragActive) return;
  if (e.button !== undefined && e.button !== 0) return;

  dragCandidate = e.currentTarget;
  activePointerId = e.pointerId;
  startX = e.clientX;
  startY = e.clientY;
  lastDragX = e.clientX;
  lastDragY = e.clientY;
  didDrag = false;

  window.addEventListener("pointermove", watchForDrag);
  window.addEventListener("pointerup", cancelPossibleDrag, { once: true });
  window.addEventListener("pointercancel", cancelDrag, { once: true });
  window.addEventListener("blur", cancelDrag, { once: true });
  window.addEventListener("touchend", endDragFromTouch, { once: true });
  window.addEventListener("touchcancel", cancelDrag, { once: true });
  window.addEventListener("pagehide", cancelDrag, { once: true });
  document.addEventListener("visibilitychange", cancelDragIfHidden);
  dragRecoveryTimer = window.setTimeout(cancelDrag, 6000);
}

function beginPossibleTouchDrag(e) {
  if (e.touches.length !== 1 || draggingTile) return;

  e.preventDefault();

  const touch = e.touches[0];
  touchDragActive = true;
  dragCandidate = e.currentTarget;
  activePointerId = "touch";
  startX = touch.clientX;
  startY = touch.clientY;
  lastDragX = touch.clientX;
  lastDragY = touch.clientY;
  didDrag = false;

  startActualDragFromPoint(touch.clientX, touch.clientY);

  window.addEventListener("touchmove", watchForTouchDrag, { passive: false });
  window.addEventListener("touchend", endPossibleTouchDrag, { once: true });
  window.addEventListener("touchcancel", cancelDrag, { once: true });
  window.addEventListener("blur", cancelDrag, { once: true });
  window.addEventListener("pagehide", cancelDrag, { once: true });
  document.addEventListener("visibilitychange", cancelDragIfHidden);
  dragRecoveryTimer = window.setTimeout(cancelDrag, 6000);
}

function watchForDrag(e) {
  if (!dragCandidate || draggingTile || e.pointerId !== activePointerId) return;

  lastDragX = e.clientX;
  lastDragY = e.clientY;

  const dx = Math.abs(e.clientX - startX);
  const dy = Math.abs(e.clientY - startY);

  if (dx > 6 || dy > 6) {
    startActualDrag(e);
  }
}

function watchForTouchDrag(e) {
  if (!dragCandidate || e.touches.length !== 1) return;

  e.preventDefault();

  const touch = e.touches[0];
  lastDragX = touch.clientX;
  lastDragY = touch.clientY;

  if (draggingTile) {
    if (Math.hypot(touch.clientX - startX, touch.clientY - startY) > 6) {
      didDrag = true;
    }

    moveDraggedTile(touch.clientX, touch.clientY);
  }
}

function cancelPossibleDrag() {
  clearDragRecoveryTimer();
  window.removeEventListener("pointermove", watchForDrag);
  window.removeEventListener("pointercancel", cancelDrag);
  window.removeEventListener("blur", cancelDrag);
  window.removeEventListener("touchend", endDragFromTouch);
  window.removeEventListener("touchcancel", cancelDrag);
  window.removeEventListener("pagehide", cancelDrag);
  document.removeEventListener("visibilitychange", cancelDragIfHidden);
  dragCandidate = null;
  activePointerId = null;
}

function endPossibleTouchDrag(e) {
  if (!draggingTile) {
    cleanupTouchDrag();
    return;
  }

  e.preventDefault();

  if (!didDrag) {
    const tile = draggingTile;
    resetDraggedTileStyle(tile);
    returnTileToTray(tile);
    finishDrag();
    selectTile(tile);
    return;
  }

  dropDraggedTile(lastDragX, lastDragY);
}

function cleanupTouchDrag() {
  clearDragRecoveryTimer();
  window.removeEventListener("touchmove", watchForTouchDrag);
  window.removeEventListener("touchend", endPossibleTouchDrag);
  window.removeEventListener("touchcancel", cancelDrag);
  window.removeEventListener("blur", cancelDrag);
  window.removeEventListener("pagehide", cancelDrag);
  document.removeEventListener("visibilitychange", cancelDragIfHidden);
  touchDragActive = false;
  dragCandidate = null;
  activePointerId = null;
}

function startActualDrag(e) {
  startActualDragFromPoint(e.clientX, e.clientY);
}

function startActualDragFromPoint(clientX, clientY) {
  const tile = dragCandidate;
  draggingTile = tile;
  originalParent = tile.parentElement;
  originalNextSibling = tile.nextSibling;

  const rect = tile.getBoundingClientRect();

  tile.dataset.offsetX = clientX - rect.left;
  tile.dataset.offsetY = clientY - rect.top;

  tile.style.width = rect.width + "px";
  tile.style.height = rect.height + "px";
  tile.style.position = "fixed";
  tile.style.left = rect.left + "px";
  tile.style.top = rect.top + "px";
  tile.style.zIndex = "1000";
  tile.style.pointerEvents = "none";

  document.body.appendChild(tile);

  window.removeEventListener("pointermove", watchForDrag);
  window.removeEventListener("pointerup", cancelPossibleDrag);
  window.addEventListener("pointermove", dragMove);
  window.addEventListener("pointerup", endDrag, { once: true });

  moveDraggedTile(clientX, clientY);
}

function dragMove(e) {
  if (!draggingTile || e.pointerId !== activePointerId) return;

  lastDragX = e.clientX;
  lastDragY = e.clientY;

  moveDraggedTile(e.clientX, e.clientY);
}

function moveDraggedTile(clientX, clientY) {
  const x = clientX - Number(draggingTile.dataset.offsetX);
  const y = clientY - Number(draggingTile.dataset.offsetY);

  draggingTile.style.left = x + "px";
  draggingTile.style.top = y + "px";
}

function endDrag(e) {
  if (!draggingTile || e.pointerId !== activePointerId) return;

  dropDraggedTile(e.clientX, e.clientY);
}

function endDragFromTouch() {
  if (!draggingTile) return;

  dropDraggedTile(lastDragX, lastDragY);
}

function dropDraggedTile(clientX, clientY) {
  if (!draggingTile) return;

  const tile = draggingTile;
  tile.style.pointerEvents = "none";

  const dropTarget = document.elementFromPoint(clientX, clientY);
  const zone = dropTarget ? dropTarget.closest(".drop-zone") : null;

  resetDraggedTileStyle(tile);

  if (zone) {
    placeTile(tile, zone);
  } else {
    returnTileToTray(tile);
  }

  finishDrag();
}

function cancelDrag() {
  if (draggingTile) {
    const tile = draggingTile;
    resetDraggedTileStyle(tile);
    returnTileToTray(tile);
    finishDrag();
    return;
  }

  if (touchDragActive) {
    cleanupTouchDrag();
    return;
  }

  cancelPossibleDrag();
}

function cancelDragIfHidden() {
  if (document.hidden) {
    cancelDrag();
  }
}

function finishDrag() {
  clearDragRecoveryTimer();
  draggingTile = null;
  dragCandidate = null;
  activePointerId = null;
  originalParent = null;
  originalNextSibling = null;
  window.removeEventListener("pointermove", dragMove);
  window.removeEventListener("pointerup", endDrag);
  window.removeEventListener("pointercancel", cancelDrag);
  window.removeEventListener("touchmove", watchForTouchDrag);
  window.removeEventListener("touchend", endPossibleTouchDrag);
  window.removeEventListener("blur", cancelDrag);
  window.removeEventListener("touchend", endDragFromTouch);
  window.removeEventListener("touchcancel", cancelDrag);
  window.removeEventListener("pagehide", cancelDrag);
  document.removeEventListener("visibilitychange", cancelDragIfHidden);
  touchDragActive = false;
}

function clearDragRecoveryTimer() {
  if (!dragRecoveryTimer) return;

  window.clearTimeout(dragRecoveryTimer);
  dragRecoveryTimer = null;
}

function resetDraggedTileStyle(tile) {
  tile.style.position = "";
  tile.style.left = "";
  tile.style.top = "";
  tile.style.zIndex = "";
  tile.style.width = "";
  tile.style.height = "";
  tile.style.pointerEvents = "";
}

function returnTile(tile) {
  const parent = originalParent || (tile.dataset.type === "cousin" ? cousinTray : memLinkTray);

  if (originalNextSibling) {
    parent.insertBefore(tile, originalNextSibling);
  } else {
    parent.appendChild(tile);
  }
}

function selectTile(tile) {
  document.querySelectorAll(".tile").forEach(function (t) {
    t.classList.remove("selected");
  });

  selectedTile = tile;
  tile.classList.add("selected");
  message.textContent = "Now tap where it belongs.";
}

function placeTile(tile, zone) {
  if (tile.dataset.type !== zone.dataset.type) {
    message.textContent = "Try the other box.";
    clearSelection();
    returnTileToTray(tile);
    return;
  }

  const existingTile = zone.querySelector(".tile");

  if (existingTile && existingTile !== tile) {
    returnTileToTray(existingTile);
  }

  zone.innerHTML = "";
  zone.appendChild(tile);
  clearSelection();
  saveProgress();
}

function returnTileToTray(tile) {
  if (!tile) return;

  resetDraggedTileStyle(tile);

  if (tile.dataset.type === "cousin") {
    cousinTray.appendChild(tile);
  } else {
    memLinkTray.appendChild(tile);
  }
}

function clearSelection() {
  document.querySelectorAll(".tile").forEach(function (t) {
    t.classList.remove("selected");
  });

  selectedTile = null;
}

function handleDropTap(zone) {
  if (!selectedTile) return;
  placeTile(selectedTile, zone);
}

cousinDrop.addEventListener("click", function () {
  handleDropTap(cousinDrop);
});

memLinkDrop.addEventListener("click", function () {
  handleDropTap(memLinkDrop);
});

answerInput.addEventListener("input", saveProgress);

answerInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !checkBtn.classList.contains("hidden")) {
    checkAnswer();
  }
});

function checkAnswer() {
  const cousinTile = cousinDrop.querySelector(".tile");
  const memLinkTile = memLinkDrop.querySelector(".tile");
  const typedAnswer = answerInput.value.trim();

  if (!cousinTile || !memLinkTile || typedAnswer === "") {
    message.textContent = "Place both tiles and type the answer first.";
    saveProgress();
    return;
  }

  const correctCousin =
    Number(cousinTile.dataset.value) === currentChallenge.correctCousin;

  const correctMemLink =
    memLinkTile.alt === findCorrectMemLinkName(
      currentChallenge.correctCousin,
      currentChallenge.correctPosition
    );

  const correctAnswer =
    Number(typedAnswer) === currentChallenge.correctAnswer;

  if (correctCousin && correctMemLink && correctAnswer) {
    message.textContent=successMessages[Math.floor(Math.random()*successMessages.length)];
    successSound.currentTime = 0;
    successSound.play().catch(function () {});
    checkBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    clearSelection();
    saveProgress();
    return;
  }

  let feedback = [];

  if (!correctCousin) {
    returnTileToTray(cousinTile);
    feedback.push("Cousin");
  }

  if (!correctMemLink) {
    returnTileToTray(memLinkTile);
    feedback.push("Mem-Link");
  }

  if (!correctAnswer) {
    answerInput.value = "";
    answerInput.focus();
    feedback.push("answer");
  }

  clearSelection();

  if (feedback.length === 1 && feedback[0] === "answer") {
    message.textContent = "Almost there! Try decoding the Mem-Link again. 😊";
  } else {
    message.textContent = "Try again. Check your " + formatFeedback(feedback) + ". 😊";
  }

  saveProgress();
}

function formatFeedback(parts) {
  if (parts.length === 0) return "work";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts[0] + " and " + parts[1];

  return parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];
}

function findCorrectMemLinkName(cousinNumber, position) {
  const links = memLinksByCousin[cousinNumber];

  for (let i = 0; i < links.length; i++) {
    if (links[i].position === position) {
      return links[i].name;
    }
  }

  return "";
}

function completeGame() {
  stopSuccessSound();
  clearSavedProgress();
  challengeCounter.textContent = "Challenge Complete";
  equation.textContent = "🏆";
  message.innerHTML = "<div class='completion-card'><h2>🏆 Foundation Complete!</h2><p>🎉 Congratulations!</p><p>You used your Memory Spots, Cousins, Mem-Link Chains, Secret Code and the Flip-It Rule to solve every challenge.</p><p><strong>You are now a Mnemply Foundation Champion!</strong></p><p>💚 Jace is proud of you.</p><p>🚀 Your next adventure is waiting...</p></div>";

  cousinDrop.innerHTML = "";
  memLinkDrop.innerHTML = "";
  cousinTray.innerHTML = "";
  memLinkTray.innerHTML = "";
  answerInput.value = "";
  answerInput.disabled = true;

  checkBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
  nextBtn.textContent = "Play Again";
  startFireworks();
}

checkBtn.addEventListener("click", checkAnswer);

nextBtn.addEventListener("click", function () {
  stopSuccessSound();

  if (nextBtn.textContent === "Play Again") {
    startGame();
  } else {
    loadNextChallenge();
  }
});

/* Fireworks */
let canvas = document.getElementById("fxCanvas");

if (!canvas) {
  canvas = document.createElement("canvas");
  canvas.id = "fxCanvas";
  document.body.insertBefore(canvas, document.body.firstChild);
}

const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startFireworks() {
  particles = [];

  for (let i = 0; i < 6; i++) {
    setTimeout(function () {
      createBurst(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6
      );
    }, i * 300);
  }
}

function createBurst(x, y) {
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 70,
      hue: Math.random() * 360
    });
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(function (p) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life--;

    ctx.fillStyle = "hsla(" + p.hue + ", 100%, 60%, " + p.life / 70 + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  particles = particles.filter(function (p) {
    return p.life > 0;
  });

  requestAnimationFrame(animateFireworks);
}

animateFireworks();
initialiseGame();
