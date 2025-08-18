let allCards = window.allCards || []; // from tarot-data.js
let deck = [];
let currentCard = null;
let nextNewIndex = 0; // tracks the next new card in order

// Load the deck with all cards
function loadDeck() {
  const storedProgress = JSON.parse(localStorage.getItem("tarotProgress") || "{}");

  deck = allCards.map((card, index) => {
    const progress = storedProgress[card.id] || {};
    return {
      ...card,
      seen: !!progress.rating,   // track if the card has been seen
      rating: progress.rating || null,
      nextDue: progress.nextDue || null,
      index
    };
  });

  // figure out where to resume new cards
  nextNewIndex = deck.findIndex(c => !c.seen);
  if (nextNewIndex === -1) nextNewIndex = deck.length; // all seen
}

// Show a card
function showNextCard() {
  if (deck.length === 0) {
    document.getElementById("card-box").classList.add("hidden");
    document.getElementById("done-screen").classList.remove("hidden");
    return;
  }

  let unseenRemaining = deck.slice(nextNewIndex).filter(c => !c.seen).length > 0;
  let seenCards = deck.filter(c => c.seen);

  // Decide: pull new or seen
  let pickNew;
  if (unseenRemaining && seenCards.length > 0) {
    pickNew = Math.random() < 0.5; // 50/50 between new or seen
  } else if (unseenRemaining) {
    pickNew = true; // only new left
  } else {
    pickNew = false; // only seen left
  }

  if (pickNew) {
    currentCard = deck[nextNewIndex]; // always the next unseen card in order
    nextNewIndex++;
  } else {
    currentCard = seenCards[Math.floor(Math.random() * seenCards.length)];
  }

  // update UI
  document.getElementById("card-name").textContent = currentCard.name;
  const cardImage = document.getElementById("card-image");
  cardImage.src = currentCard.img;
  cardImage.alt = currentCard.name;
  document.getElementById("card-meaning").textContent = currentCard.meaning;
  document.getElementById("card-meaning").classList.add("hidden");

  document.getElementById("rating-buttons").classList.add("hidden");
  document.getElementById("reveal-container").classList.remove("hidden");

  updateCardColor(currentCard);
}

// Reveal meaning
function showAnswer() {
  document.getElementById("card-meaning").classList.remove("hidden");
  document.getElementById("rating-buttons").classList.remove("hidden");
  document.getElementById("reveal-container").classList.add("hidden");
}

// Save rating and update localStorage
function rateCard(rating) {
  const now = Date.now();
  let nextInterval;

  switch (rating) {
    case "great": nextInterval = 3 * 24 * 60 * 60 * 1000; break;
    case "good": nextInterval = 1 * 24 * 60 * 60 * 1000; break;
    case "meh": nextInterval = 30 * 60 * 1000; break;
    case "bad": nextInterval = 1 * 60 * 1000; break;
  }

  const updatedProgress = JSON.parse(localStorage.getItem("tarotProgress") || "{}");
  updatedProgress[currentCard.id] = {
    rating,
    nextDue: now + nextInterval
  };
  localStorage.setItem("tarotProgress", JSON.stringify(updatedProgress));

  // mark as seen in deck
  deck = deck.map(c =>
    c.id === currentCard.id ? { ...c, seen: true, rating } : c
  );

  showNextCard();
}

// Apply border color based on rating
function updateCardColor(card) {
  const cardBox = document.getElementById("card-box");
  cardBox.classList.remove("great", "good", "meh", "bad", "new");

  switch (card.rating) {
    case "great": cardBox.classList.add("great"); break;
    case "good": cardBox.classList.add("good"); break;
    case "meh": cardBox.classList.add("meh"); break;
    case "bad": cardBox.classList.add("bad"); break;
    default: cardBox.classList.add("new");
  }
}

// On load
window.addEventListener("DOMContentLoaded", () => {
  loadDeck();
  showNextCard();
});
