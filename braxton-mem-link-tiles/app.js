/*
===============================================================================
Mnemply Apps

App:       Braxton Mem-Link Tiles
Version:   1.1.1
Author:    Andrew Campbell
Created:   12 June 2026

Description:
Children practise Braxton's Mem-Link Tiles by thinking of the answer, then flipping
the tile to check. This deck includes both image tiles and position tiles.

Change Log:
1.1.1 - Removed template literals for safer copying
1.1.0 - Added both image and position tiles to the same deck
1.0.0 - Initial release
===============================================================================
*/

const CONFIG = {
  folder: "02-braxton",
  cousinNumber: "02",
  cousinName: "Braxton",
  maxCard: 2
};

const card = document.getElementById("card");
const frontImg = document.getElementById("frontImg");
const backImg = document.getElementById("backImg");
const counter = document.getElementById("counter");
const prevBtn = document.getElementById("prevBtn");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let flashcards = [];

function pad(num) {
  return String(num).padStart(2, "0");
}

function assetPath(filename) {
  return "../assets/" + CONFIG.folder + "/" + filename;
}

function buildDeck() {
  const deck = [];

  deck.push({
    front: assetPath(CONFIG.cousinNumber + "_" + CONFIG.cousinName + "_Front.png"),
    back: assetPath(CONFIG.cousinNumber + "_" + CONFIG.cousinName + "_Back.png")
  });

  for (let i = 0; i <= CONFIG.maxCard; i++) {
    const number = pad(i);

    deck.push({
      front: assetPath(CONFIG.cousinNumber + "_img_" + number + "_front.png"),
      back: assetPath(CONFIG.cousinNumber + "_img_" + number + "_back.png")
    });

    deck.push({
      front: assetPath(CONFIG.cousinNumber + "_pos_" + number + "_front.png"),
      back: assetPath(CONFIG.cousinNumber + "_pos_" + number + "_back.png")
    });
  }

  return deck;
}

function showCard(index) {
  const tile = flashcards[index];

  card.classList.remove("flipped");
  frontImg.src = tile.front;
  backImg.src = tile.back;

  counter.textContent = "Tile " + (index + 1) + " of " + flashcards.length;
}

function flipCard() {
  card.classList.toggle("flipped");
}

function nextCard() {
  currentIndex = (currentIndex + 1) % flashcards.length;
  showCard(currentIndex);
}

function previousCard() {
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  showCard(currentIndex);
}

card.addEventListener("click", flipCard);
flipBtn.addEventListener("click", flipCard);
nextBtn.addEventListener("click", nextCard);
prevBtn.addEventListener("click", previousCard);

flashcards = buildDeck();
showCard(currentIndex);