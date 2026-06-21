const validFoundationProducts = [
  1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36,
];

const validExpansionProducts = [
  1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 7, 11, 14, 21,
  22, 27, 28, 32, 33, 35, 40, 42, 44, 45, 48, 49, 50, 54, 55, 56, 60, 63, 64,
  66, 70, 72, 77, 80, 81, 84, 88, 90, 96, 99, 100, 108, 110, 120, 121, 132,
  144,
];

const appConfig = {
  foundation: {
    eyebrow: "Foundation Level",
    intro: "Draw two number tiles, reveal the cousin and Mem-Link, then find the match on your Bingo card.",
    maxNumber: 6,
    bluePrefix: "blue",
    greenPrefix: "green",
    showCousin: true,
    blueLabel: "Cousin Tile",
    greenLabel: "Mem-Link Tile",
    cardHref: "assets/cards/bingo-cards-level-1.pdf",
    cardText: "Open Foundation Cards",
    validProducts: validFoundationProducts,
  },
  expansion: {
    eyebrow: "Expansion Level",
    intro: "Draw two number tiles from the 1 to 12 set, reveal the Mem-Link, then find it on your Bingo card.",
    maxNumber: 12,
    bluePrefix: "blue",
    greenPrefix: "green",
    showCousin: true,
    blueLabel: "Cousin Tile",
    greenLabel: "Mem-Link Tile",
    cardHref: "assets/cards/bingo-cards-level-2.pdf",
    cardText: "Open Expansion Cards",
    validProducts: validExpansionProducts,
  },
};

const cousins = [
  {
    name: "Olive",
    image: "assets/cousins/01_Olive.png",
  },
  {
    name: "Braxton",
    image: "assets/cousins/02_Braxton.png",
  },
  {
    name: "Lily",
    image: "assets/cousins/03_Lilly.png",
  },
  {
    name: "Laiken",
    image: "assets/cousins/04_Laiken.png",
  },
  {
    name: "Alice",
    image: "assets/cousins/05_Alice.png",
  },
  {
    name: "Joshua",
    image: "assets/cousins/06_Joshua.png",
  },
  {
    name: "Belle",
    image: "assets/cousins/07_Belle.png",
  },
  {
    name: "Adam",
    image: "assets/cousins/08_Adam.png",
  },
  {
    name: "Lianna",
    image: "assets/cousins/09_Lianna.png",
  },
  {
    name: "Harrison",
    image: "assets/cousins/10_Harrison.png",
  },
  {
    name: "Lenny",
    image: "assets/cousins/11_Lenny.png",
  },
  {
    name: "Matthew",
    image: "assets/cousins/12_Matthew.png",
  },
];

const mnemonics = {
  1: { name: "Hat", image: "assets/mem-links/01Hat.png" },
  2: { name: "Hen", image: "assets/mem-links/02Hen.png" },
  3: { name: "Ham", image: "assets/mem-links/03Ham.png" },
  4: { name: "Hare", image: "assets/mem-links/04Hare.png" },
  5: { name: "Holly", image: "assets/mem-links/05Holly.png" },
  6: { name: "Witch", image: "assets/mem-links/06Witch.png" },
  7: { name: "Kay", image: "assets/mem-links/07Kay.png" },
  8: { name: "Hoofy", image: "assets/mem-links/08hoof.png" },
  9: { name: "Hoop", image: "assets/mem-links/09Hoop.png" },
  10: { name: "Dice", image: "assets/mem-links/10Dice.png" },
  11: { name: "Tattoo", image: "assets/mem-links/11Tattoo.png" },
  12: { name: "Tuna", image: "assets/mem-links/12Tuna.png" },
  14: { name: "Door", image: "assets/mem-links/14Door.png" },
  15: { name: "Doll", image: "assets/mem-links/15Doll.png" },
  16: { name: "Dish", image: "assets/mem-links/16Dish.png" },
  18: { name: "Dove", image: "assets/mem-links/18Dove.png" },
  20: { name: "Nosey", image: "assets/mem-links/20Nosey.png" },
  21: { name: "Knight", image: "assets/mem-links/21Knight.png" },
  22: { name: "Nun", image: "assets/mem-links/22Nun.png" },
  24: { name: "Winner", image: "assets/mem-links/24Winner.png" },
  25: { name: "Nellie", image: "assets/mem-links/25Nellie.png" },
  27: { name: "Nikki", image: "assets/mem-links/27Nikki.png" },
  28: { name: "Nova", image: "assets/mem-links/28Nova.png" },
  30: { name: "Mice", image: "assets/mem-links/30Mice.png" },
  32: { name: "Manny", image: "assets/mem-links/32Manny.png" },
  33: { name: "Mummy", image: "assets/mem-links/33Mummy.png" },
  35: { name: "Mole", image: "assets/mem-links/35Mole.png" },
  36: { name: "Mitch", image: "assets/mem-links/36Mitch.png" },
  40: { name: "Rose", image: "assets/mem-links/40Rose.png" },
  42: { name: "Horny", image: "assets/mem-links/42Horny.png" },
  44: { name: "Rower", image: "assets/mem-links/44Rower.png" },
  45: { name: "Errol", image: "assets/mem-links/45Errol.png" },
  48: { name: "Ruffo", image: "assets/mem-links/48Ruffo.png" },
  49: { name: "Ruby", image: "assets/mem-links/49Rub.png" },
  50: { name: "Lizzie", image: "assets/mem-links/50Lizzie.png" },
  54: { name: "Lorry", image: "assets/mem-links/54Lorry.png" },
  55: { name: "Lollie", image: "assets/mem-links/55Lollie.png" },
  56: { name: "Welsh", image: "assets/mem-links/56Welsh.png" },
  60: { name: "Shoes", image: "assets/mem-links/60Shoes.png" },
  63: { name: "Jimmy", image: "assets/mem-links/63Jimmy.png" },
  64: { name: "Jerry", image: "assets/mem-links/64Jerry.png" },
  66: { name: "Judge", image: "assets/mem-links/66Judge.png" },
  70: { name: "Casey", image: "assets/mem-links/70Casey.png" },
  72: { name: "Queen", image: "assets/mem-links/72Queen.png" },
  77: { name: "Cake", image: "assets/mem-links/77Cake.png" },
  80: { name: "Face", image: "assets/mem-links/80Face.png" },
  81: { name: "Foot", image: "assets/mem-links/81Foot.png" },
  84: { name: "Furry", image: "assets/mem-links/84Fury.png" },
  88: { name: "Fifi", image: "assets/mem-links/88Fifi.png" },
  90: { name: "Bus", image: "assets/mem-links/90Bus.png" },
  96: { name: "Patch", image: "assets/mem-links/96Patch.png" },
  99: { name: "Poppy", image: "assets/mem-links/99Poppy.png" },
  100: { name: "Daisies", image: "assets/mem-links/100Daisies.png" },
  108: { name: "Adhesive", image: "assets/mem-links/108Adhesive.png" },
  110: { name: "Toads", image: "assets/mem-links/110Toads.png" },
  120: { name: "Twins", image: "assets/mem-links/120Twins.png" },
  121: { name: "Donut", image: "assets/mem-links/121Donut.png" },
  132: { name: "Domino", image: "assets/mem-links/132Domino.png" },
  144: { name: "Dryer", image: "assets/mem-links/144Dryer.png" },
};

const elements = {
  levelEyebrow: document.querySelector("#level-eyebrow"),
  levelIntro: document.querySelector("#level-intro"),
  cardLink: document.querySelector("#card-link"),
  blueTileLabel: document.querySelector("#blue-tile-label"),
  greenTileLabel: document.querySelector("#green-tile-label"),
  blueTileImage: document.querySelector("#cousin-tile-image"),
  greenTileImage: document.querySelector("#mnemonic-tile-image"),
  blueTileValue: document.querySelector("#cousin-tile-value"),
  greenTileValue: document.querySelector("#mnemonic-tile-value"),
  drawButton: document.querySelector("#draw-button"),
  flipButton: document.querySelector("#flip-button"),
  revealButton: document.querySelector("#reveal-button"),
  resetButton: document.querySelector("#reset-button"),
  gameStatus: document.querySelector("#game-status"),
  resultPanel: document.querySelector("#result-panel"),
  resultGrid: document.querySelector(".result-grid"),
  resultEquation: document.querySelector("#result-equation"),
  cousinResultCard: document.querySelector("#cousin-result-card"),
  cousinImage: document.querySelector("#cousin-image"),
  cousinName: document.querySelector("#cousin-name"),
  mnemonicImage: document.querySelector("#mnemonic-image"),
  mnemonicName: document.querySelector("#mnemonic-name"),
  historyList: document.querySelector("#history-list"),
  historyCount: document.querySelector("#history-count"),
};

const state = {
  level: document.body.dataset.level || "foundation",
  blueTile: 1,
  greenTile: 1,
  deck: [],
  deckIndex: 0,
  history: [],
  hasActiveDraw: false,
  isRevealed: false,
};

function paddedNumber(value) {
  return String(value).padStart(2, "0");
}

function tilePath(prefix, value) {
  return `assets/tokens/${prefix}-${paddedNumber(value)}.png`;
}

function shuffle(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function currentLevel() {
  return appConfig[state.level];
}

function matchingPairs(product, maxNumber) {
  const pairs = [];

  for (let blue = 1; blue <= maxNumber; blue += 1) {
    for (let green = 1; green <= maxNumber; green += 1) {
      if (blue * green === product) {
        pairs.push([blue, green]);
      }
    }
  }

  return pairs;
}

function buildDeck(level) {
  state.deck = shuffle(
    level.validProducts
      .map((product) => {
        const pairs = matchingPairs(product, level.maxNumber);
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        return pair ? { product, pair } : null;
      })
      .filter(Boolean),
  );
  state.deckIndex = 0;
}

function applyLevelContent() {
  const level = currentLevel();

  elements.levelEyebrow.textContent = level.eyebrow;
  elements.levelIntro.textContent = level.intro;
  elements.blueTileLabel.textContent = level.blueLabel;
  elements.greenTileLabel.textContent = level.greenLabel;
  elements.cousinResultCard.hidden = !level.showCousin;
  elements.resultGrid.classList.toggle("single-result", !level.showCousin);

  if (level.cardHref) {
    elements.cardLink.href = level.cardHref;
    elements.cardLink.textContent = level.cardText;
    elements.cardLink.hidden = false;
  } else {
    elements.cardLink.hidden = true;
  }

  updateStatus();
}

function updateTileImages() {
  const level = currentLevel();

  elements.blueTileImage.src = tilePath(level.bluePrefix, state.blueTile);
  elements.blueTileImage.alt = `Blue number tile ${state.blueTile}`;
  elements.greenTileImage.src = tilePath(level.greenPrefix, state.greenTile);
  elements.greenTileImage.alt = `Green number tile ${state.greenTile}`;
  elements.blueTileValue.textContent = state.blueTile;
  elements.greenTileValue.textContent = state.greenTile;
}

function needsFlip() {
  return state.hasActiveDraw && !state.isRevealed && state.greenTile > state.blueTile;
}

function canReveal() {
  return state.hasActiveDraw && !state.isRevealed && !needsFlip();
}

function syncActionButtons() {
  elements.drawButton.disabled = state.hasActiveDraw && !state.isRevealed;
  elements.flipButton.disabled = !needsFlip();
  elements.revealButton.disabled = !canReveal();
}

function drawTiles() {
  const level = currentLevel();

  if (state.deckIndex >= state.deck.length) {
    elements.gameStatus.textContent = "All Mem-Links have been called. Start a new game to play again.";
    elements.drawButton.disabled = true;
    elements.revealButton.disabled = true;
    return;
  }

  const draw = state.deck[state.deckIndex];
  [state.blueTile, state.greenTile] = draw.pair;
  state.deckIndex += 1;
  state.hasActiveDraw = true;
  state.isRevealed = false;
  elements.resultPanel.hidden = true;
  updateTileImages();
  syncActionButtons();
  updateStatus();
}

function flipTiles() {
  if (!needsFlip()) {
    return;
  }

  const originalBlue = state.blueTile;
  state.blueTile = state.greenTile;
  state.greenTile = originalBlue;
  updateTileImages();
  syncActionButtons();
  updateStatus();
}

function revealMatch() {
  const level = currentLevel();

  if (!state.hasActiveDraw || state.isRevealed) {
    return;
  }

  if (needsFlip()) {
    updateStatus();
    syncActionButtons();
    return;
  }

  const product = state.blueTile * state.greenTile;
  const cousin = cousins[state.blueTile - 1] || {
    name: `Cousin ${state.blueTile}`,
    image: "",
  };
  const mnemonic = mnemonics[product] || {
    name: "Mem-Link coming soon",
    image: "",
  };

  elements.resultEquation.textContent = `${state.blueTile} x ${state.greenTile} = ${product}`;

  if (level.showCousin) {
    elements.cousinName.textContent = cousin.name;
    elements.cousinImage.src = cousin.image;
    elements.cousinImage.alt = cousin.image ? cousin.name : "";
  }

  elements.mnemonicName.textContent = mnemonic.name;
  elements.mnemonicImage.src = mnemonic.image;
  elements.mnemonicImage.alt = mnemonic.image ? mnemonic.name : "";
  elements.resultPanel.hidden = false;
  state.isRevealed = true;
  syncActionButtons();
  updateStatus();

  addHistory({
    blueTile: state.blueTile,
    greenTile: state.greenTile,
    product,
    mnemonicName: mnemonic.name,
  });
}

function addHistory(draw) {
  state.history.unshift(draw);
  state.history = state.history.slice(0, 12);
  renderHistory();
}

function renderHistory() {
  elements.historyList.innerHTML = "";

  state.history.forEach((draw) => {
    const item = document.createElement("li");
    item.textContent = `${draw.blueTile} x ${draw.greenTile} = ${draw.product}: ${draw.mnemonicName}`;
    elements.historyList.append(item);
  });

  const count = state.history.length;
  elements.historyCount.textContent = `${count} ${count === 1 ? "called" : "called"}`;
}

function resetGame() {
  const level = currentLevel();

  state.blueTile = 1;
  state.greenTile = 1;
  state.history = [];
  state.deck = [];
  state.deckIndex = 0;
  state.hasActiveDraw = false;
  state.isRevealed = false;

  buildDeck(level);

  elements.resultPanel.hidden = true;
  applyLevelContent();
  updateTileImages();
  syncActionButtons();
  renderHistory();
}

function updateStatus() {
  const remaining = Math.max(state.deck.length - state.deckIndex, 0);
  const total = state.deck.length;

  if (needsFlip()) {
    elements.gameStatus.textContent = "Flip-It first: the Mem-Link Tile is larger than the Cousin Tile.";
    return;
  }

  if (remaining === 0 && state.isRevealed) {
    elements.gameStatus.textContent = "All Mem-Links have been called. Start a new game to play again.";
    elements.drawButton.disabled = true;
    return;
  }

  elements.gameStatus.textContent = `${remaining} of ${total} Mem-Links left in this game.`;
}

elements.drawButton.addEventListener("click", drawTiles);
elements.flipButton.addEventListener("click", flipTiles);
elements.revealButton.addEventListener("click", revealMatch);
elements.resetButton.addEventListener("click", resetGame);

resetGame();
