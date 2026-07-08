/*
===============================================================================
Mnemply Apps

App:       Memory Spot Match
Version:   1.0.0
Author:    Andrew Campbell
Created:   11 June 2026

Description:
Children match the Memory Spot image cards to the correct Memory Spot number.

Change Log:
1.0.0 - Initial release
===============================================================================
*/

const spots = [1, 2, 3, 4, 5, 6];

const board = document.getElementById("board");
const tray = document.getElementById("tray");
const message = document.getElementById("message");
const playAgain = document.getElementById("playAgain");
const successSound = document.getElementById("successSound");

let selectedTile = null;
let draggingTile = null;
let originalParent = null;
let originalNextSibling = null;
let activePointerId = null;
let dragStartX = 0;
let dragStartY = 0;
let dragMoved = false;
let draggedTile = null;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function imagePath(num) {
  return `../assets/memory-spots/MS_img_${String(num).padStart(2, "0")}_Front.png`;
}

function startGame() {
  if (draggingTile) {
    cancelDrag();
  }

  successSound.pause();
  successSound.currentTime = 0;
  selectedTile = null;
  draggingTile = null;
  activePointerId = null;
  dragMoved = false;
  draggedTile = null;
  board.innerHTML = "";
  tray.innerHTML = "";
  message.textContent = "Drag or tap a card to begin.";
  playAgain.classList.add("hidden");

  shuffle(spots).forEach(num => {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.number = num;

    const number = document.createElement("div");
    number.className = "slot-number";
    number.textContent = num;

    slot.appendChild(number);
    slot.addEventListener("click", () => handleSlotTap(slot));
    board.appendChild(slot);
  });

  shuffle(spots).forEach(num => {
    tray.appendChild(createTile(num));
  });
}

function createTile(num) {
  const img = document.createElement("img");
  img.className = "tile";
  img.src = imagePath(num);
  img.alt = `Memory Spot ${num}`;
  img.dataset.number = num;
  img.draggable = false;

  img.addEventListener("click", (e) => {
    if (dragMoved && draggedTile === img) {
      e.preventDefault();
      dragMoved = false;
      draggedTile = null;
      return;
    }

    selectTile(img);
  });
  img.addEventListener("pointerdown", startDrag);

  return img;
}

function startDrag(e) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();

  if (draggingTile) {
    cancelDrag();
  }

  const tile = e.currentTarget;
  draggingTile = tile;
  activePointerId = e.pointerId;
  originalParent = tile.parentElement;
  originalNextSibling = tile.nextSibling;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragMoved = false;
  draggedTile = tile;

  if (tile.setPointerCapture) {
    tile.setPointerCapture(e.pointerId);
  }

  const rect = tile.getBoundingClientRect();

  tile.dataset.offsetX = e.clientX - rect.left;
  tile.dataset.offsetY = e.clientY - rect.top;

  tile.style.width = `${rect.width}px`;
  tile.style.height = `${rect.height}px`;
  tile.style.position = "fixed";
  tile.style.left = `${rect.left}px`;
  tile.style.top = `${rect.top}px`;
  tile.style.zIndex = "1000";
  tile.style.pointerEvents = "none";

  document.body.appendChild(tile);

  window.addEventListener("pointermove", dragMove);
  window.addEventListener("pointerup", endDrag, { once: true });
  window.addEventListener("pointercancel", cancelDrag, { once: true });
  window.addEventListener("blur", cancelDrag, { once: true });
}

function dragMove(e) {
  if (!draggingTile || e.pointerId !== activePointerId) return;

  if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 6) {
    dragMoved = true;
  }

  const x = e.clientX - Number(draggingTile.dataset.offsetX);
  const y = e.clientY - Number(draggingTile.dataset.offsetY);

  draggingTile.style.left = `${x}px`;
  draggingTile.style.top = `${y}px`;
}

function endDrag(e) {
  if (!draggingTile || e.pointerId !== activePointerId) return;

  const tile = draggingTile;
  tile.style.pointerEvents = "none";

  const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
  const slot = dropTarget ? dropTarget.closest(".slot") : null;

  resetDraggedTileStyle(tile);

  if (tile.releasePointerCapture && tile.hasPointerCapture && tile.hasPointerCapture(activePointerId)) {
    tile.releasePointerCapture(activePointerId);
  }

  if (slot) {
    tryPlaceTile(tile, slot);
  } else {
    returnTile(tile);
  }

  finishDrag();
}

function cancelDrag() {
  if (!draggingTile) return;

  const tile = draggingTile;
  resetDraggedTileStyle(tile);
  returnTile(tile);
  finishDrag();
}

function finishDrag() {
  draggingTile = null;
  activePointerId = null;
  originalParent = null;
  originalNextSibling = null;
  window.removeEventListener("pointermove", dragMove);
  window.removeEventListener("pointerup", endDrag);
  window.removeEventListener("pointercancel", cancelDrag);
  window.removeEventListener("blur", cancelDrag);
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
  const parent = originalParent || tray;

  if (originalNextSibling) {
    parent.insertBefore(tile, originalNextSibling);
  } else {
    parent.appendChild(tile);
  }
}

function selectTile(tile) {
  document.querySelectorAll(".tile").forEach(t => t.classList.remove("selected"));
  selectedTile = tile;
  tile.classList.add("selected");
  message.textContent = "Now tap the matching number.";
}

function handleSlotTap(slot) {
  if (!selectedTile) return;
  tryPlaceTile(selectedTile, slot);
}

function tryPlaceTile(tile, slot) {
  if (slot.querySelector(".tile") && !slot.contains(tile)) {
    message.textContent = "That spot already has a card.";
    clearSelection();
    returnTile(tile);
    return;
  }

  if (tile.dataset.number === slot.dataset.number) {
    placeTile(tile, slot);
  } else {
    message.textContent = "Try again.";
    clearSelection();
    if (originalParent) {
      returnTile(tile);
    }
  }
}

function placeTile(tile, slot) {
  slot.innerHTML = "";
  slot.appendChild(tile);
  clearSelection();
  message.textContent = "Yes!";
  checkComplete();
}

function clearSelection() {
  document.querySelectorAll(".tile").forEach(t => t.classList.remove("selected"));
  selectedTile = null;
}

function checkComplete() {
  const slots = [...document.querySelectorAll(".slot")];

  const complete = slots.every(slot => {
    const tile = slot.querySelector(".tile");
    return tile && tile.dataset.number === slot.dataset.number;
  });

  if (complete) completeGame();
}

function completeGame() {
  message.textContent = "🎉 Great Job! 🎉";
  playAgain.classList.remove("hidden");
  successSound.currentTime = 0;
  successSound.play().catch(() => {});
  startFireworks();
}

playAgain.addEventListener("click", startGame);

/* Fireworks */
const canvas = document.getElementById("fxCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startFireworks() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
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
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 70,
      hue: Math.random() * 360
    });
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life--;

    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.life / 70})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  particles = particles.filter(p => p.life > 0);
  requestAnimationFrame(animateFireworks);
}

animateFireworks();
startGame();
