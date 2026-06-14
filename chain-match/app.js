/*
===============================================================================
Mnemply Apps

App:       Chain Match
Version:   1.3.0
Author:    Andrew Campbell
Created:   13 June 2026

Description:
Children match a Cousin tile and Mem-Link tile to valid Foundation chain positions.
Includes all 27 valid Foundation chain positions, including Hussey at position 0.

Change Log:
1.3.0 - Added challenge counter and ensured fireworks are created if missing
1.2.3 - Fixed tap selection by only starting drag after a real mouse movement
1.2.2 - Restored PC tap by allowing click events after pointerdown
1.2.1 - Restored mobile tap behaviour by making drag mouse-only
1.2.0 - Incorrect tiles return to tray when Check is pressed
1.1.0 - Improved tap-to-place behaviour on mobile
1.0.1 - Stops success sound when Next is clicked
1.0.0 - Initial release
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

const cousinNumber = document.getElementById("cousinNumber");
const memLinkNumber = document.getElementById("memLinkNumber");
const cousinDrop = document.getElementById("cousinDrop");
const memLinkDrop = document.getElementById("memLinkDrop");
const cousinTray = document.getElementById("cousinTray");
const memLinkTray = document.getElementById("memLinkTray");
const message = document.getElementById("message");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const successSound = document.getElementById("successSound");

let challengeCounter = document.getElementById("challengeCounter");
if (!challengeCounter) {
  challengeCounter = document.createElement("p");
  challengeCounter.id = "challengeCounter";
  challengeCounter.className = "challenge-counter";

  const instructions = document.querySelector(".instructions");
  if (instructions && instructions.parentNode) {
    instructions.parentNode.insertBefore(challengeCounter, instructions.nextSibling);
  }
}

let challenges = [];
let totalChallenges = 0;
let currentChallengeNumber = 0;
let currentChallenge = null;
let selectedTile = null;

let dragCandidate = null;
let draggingTile = null;
let originalParent = null;
let originalNextSibling = null;
let startX = 0;
let startY = 0;
let didDrag = false;

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
  successSound.pause();
  successSound.currentTime = 0;
}

function updateChallengeCounter() {
  if (!challengeCounter) return;

  if (totalChallenges <= 0) {
    challengeCounter.textContent = "";
    return;
  }

  challengeCounter.textContent =
    "Challenge " + currentChallengeNumber + " of " + totalChallenges;
}

function buildChallenges() {
  const list = [];

  cousins.forEach(function (cousin) {
    memLinksByCousin[cousin.number].forEach(function (memLink) {
      list.push({
        cousinNumber: cousin.number,
        memLinkPosition: memLink.position
      });
    });
  });

  return shuffle(list);
}

function startGame() {
  stopSuccessSound();
  particles = [];
  challenges = buildChallenges();
  totalChallenges = challenges.length;
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
  updateChallengeCounter();

  cousinNumber.textContent = currentChallenge.cousinNumber;
  memLinkNumber.textContent = currentChallenge.memLinkPosition;

  cousinDrop.innerHTML = "";
  memLinkDrop.innerHTML = "";
  cousinTray.innerHTML = "";
  memLinkTray.innerHTML = "";

  message.textContent = "Tap the correct tile, then tap where it belongs.";
  checkBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
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

  return img;
}

function beginPossibleDrag(e) {
  if (e.pointerType !== "mouse") {
    return;
  }

  dragCandidate = e.currentTarget;
  startX = e.clientX;
  startY = e.clientY;
  didDrag = false;

  window.addEventListener("pointermove", watchForDrag);
  window.addEventListener("pointerup", cancelPossibleDrag, { once: true });
}

function watchForDrag(e) {
  if (!dragCandidate || draggingTile) return;

  const dx = Math.abs(e.clientX - startX);
  const dy = Math.abs(e.clientY - startY);

  if (dx > 6 || dy > 6) {
    startActualDrag(e);
  }
}

function cancelPossibleDrag() {
  window.removeEventListener("pointermove", watchForDrag);
  dragCandidate = null;
}

function startActualDrag(e) {
  didDrag = true;

  const tile = dragCandidate;
  draggingTile = tile;
  originalParent = tile.parentElement;
  originalNextSibling = tile.nextSibling;

  const rect = tile.getBoundingClientRect();

  tile.dataset.offsetX = startX - rect.left;
  tile.dataset.offsetY = startY - rect.top;

  tile.style.width = rect.width + "px";
  tile.style.height = rect.height + "px";
  tile.style.position = "fixed";
  tile.style.left = rect.left + "px";
  tile.style.top = rect.top + "px";
  tile.style.zIndex = "1000";
  tile.style.pointerEvents = "none";

  document.body.appendChild(tile);

  window.removeEventListener("pointermove", watchForDrag);
  window.addEventListener("pointermove", dragMove);
  window.addEventListener("pointerup", endDrag, { once: true });

  dragMove(e);
}

function dragMove(e) {
  if (!draggingTile) return;

  const x = e.clientX - Number(draggingTile.dataset.offsetX);
  const y = e.clientY - Number(draggingTile.dataset.offsetY);

  draggingTile.style.left = x + "px";
  draggingTile.style.top = y + "px";
}

function endDrag(e) {
  if (!draggingTile) return;

  const tile = draggingTile;
  tile.style.pointerEvents = "none";

  const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
  const zone = dropTarget ? dropTarget.closest(".drop-zone") : null;

  resetDraggedTileStyle(tile);

  if (zone) {
    placeTile(tile, zone);
  } else {
    returnTile(tile);
  }

  draggingTile = null;
  dragCandidate = null;
  window.removeEventListener("pointermove", dragMove);
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
  if (originalParent && originalNextSibling) {
    originalParent.insertBefore(tile, originalNextSibling);
  } else if (originalParent) {
    originalParent.appendChild(tile);
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
    returnTile(tile);
    return;
  }

  const existingTile = zone.querySelector(".tile");

  if (existingTile && existingTile !== tile) {
    returnTileToTray(existingTile);
  }

  zone.innerHTML = "";
  zone.appendChild(tile);
  clearSelection();
}

function returnTileToTray(tile) {
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

function checkAnswer() {
  const cousinTile = cousinDrop.querySelector(".tile");
  const memLinkTile = memLinkDrop.querySelector(".tile");

  if (!cousinTile || !memLinkTile) {
    message.textContent = "Place both tiles first.";
    return;
  }

  const correctCousin =
    Number(cousinTile.dataset.value) === currentChallenge.cousinNumber;

  const correctMemLink =
    memLinkTile.alt === findCorrectMemLinkName();

  if (correctCousin && correctMemLink) {
    message.textContent = "Yes!";
    successSound.currentTime = 0;
    successSound.play().catch(function () {});
    checkBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    clearSelection();
    return;
  }

  if (!correctCousin) {
    returnTileToTray(cousinTile);
  }

  if (!correctMemLink) {
    returnTileToTray(memLinkTile);
  }

  clearSelection();
  message.textContent = "Try again.";
}

function findCorrectMemLinkName() {
  const links = memLinksByCousin[currentChallenge.cousinNumber];

  for (let i = 0; i < links.length; i++) {
    if (links[i].position === currentChallenge.memLinkPosition) {
      return links[i].name;
    }
  }

  return "";
}

function completeGame() {
  stopSuccessSound();
  if (challengeCounter) {
    challengeCounter.textContent = "Challenge " + totalChallenges + " of " + totalChallenges;
  }
  message.textContent = "🎉 Great Job! You completed all " + totalChallenges + " challenges! 🎉";
  cousinDrop.innerHTML = "";
  memLinkDrop.innerHTML = "";
  cousinTray.innerHTML = "";
  memLinkTray.innerHTML = "";
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

  for (let i = 0; i < 5; i++) {
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
startGame();
