let allCards = window.allCards || []; // from tarot-data.js
let deck = [];
let currentCard = null;

// Load the deck with all cards
function loadDeck() {
  const storedProgress = JSON.parse(localStorage.getItem("tarotProgress") || "{}");

  deck = allCards.map(card => {
    const progress = storedProgress[card.id] || {};
    return {
      ...card,
      rating: progress.rating || null,
      nextDue: progress.nextDue || null
    };
  });
}

// Show a random card
function showNextCard() {
  if (deck.length === 0) {
    document.getElementById("card-box").classList.add("hidden");
    document.getElementById("done-screen").classList.remove("hidden");
    return;
  }

  currentCard = deck[Math.floor(Math.random() * deck.length)];

  document.getElementById("card-name").textContent = currentCard.name;
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
    case "great": nextInterval = 7 * 24 * 60 * 60 * 1000; break;
    case "good": nextInterval = 3 * 24 * 60 * 60 * 1000; break;
    case "meh": nextInterval = 1 * 24 * 60 * 60 * 1000; break;
    case "bad": nextInterval = 30 * 60 * 1000; break;
  }

  const updatedProgress = JSON.parse(localStorage.getItem("tarotProgress") || "{}");
  updatedProgress[currentCard.id] = {
    rating,
    nextDue: now + nextInterval
  };
  localStorage.setItem("tarotProgress", JSON.stringify(updatedProgress));

  // Remove card from deck and show next
  deck = deck.filter(c => c.id !== currentCard.id);
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
