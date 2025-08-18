// Pick random cards from allCards
function pickRandomCards(num) {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, num);
}

// Create pairs: one image card, one meaning card
function createMemoryPairs(cards) {
  let pairs = [];
  cards.forEach(card => {
    pairs.push({
      type: "image",
      pairId: card.id,
      content: card.img
    });
    pairs.push({
      type: "text",
      pairId: card.id,
      content: card.meaning
    });
  });
  return pairs;
}

// Shuffle any array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Render the game board with the shuffled cards
function renderGameBoard(cards) {
  const board = document.getElementById("game-board");
  board.innerHTML = ""; // clear old cards

  cards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.pairId = card.pairId;
    cardElement.dataset.type = card.type;

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="card-back.jpg" alt="Card back">
        </div>
        <div class="card-back">
          ${
            card.type === "image"
              ? `<img src="${card.content}" alt="${card.pairId}">`
              : `<p>${card.content}</p>`
          }
        </div>
      </div>
    `;

    board.appendChild(cardElement);
  });
}

// Game state variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Click handler using event delegation
document.getElementById("game-board").addEventListener("click", function (e) {
  const clicked = e.target.closest(".card");

  if (!clicked || lockBoard) return;
  if (clicked.classList.contains("flipped") || clicked.classList.contains("matched")) return;

  clicked.classList.add("flipped");

  if (!firstCard) {
    firstCard = clicked;
    return;
  }

  secondCard = clicked;
  checkForMatch();
});

// Match check
function checkForMatch() {
  const isMatch =
    firstCard.dataset.pairId === secondCard.dataset.pairId &&
    firstCard.dataset.type !== secondCard.dataset.type;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// Keep matched cards visible
function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  resetTurn();
}

// Flip back if no match
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 3000);
}

// Reset the selection
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Initial game setup
function startGame() {
  const randomCards = pickRandomCards(6);
  let gameCards = createMemoryPairs(randomCards);
  gameCards = shuffle(gameCards);
  renderGameBoard(gameCards);
}

// Play Again button
document.getElementById("play-again").addEventListener("click", startGame);

// Start the first game
startGame();
