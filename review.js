console.log("review.js loaded");
let allCards = window.allCards || [];
let reviewDeck = [];
let currentCard = null;

// Delay map (spaced repetition logic)
const delayMap = {
  great: 3 * 24 * 60 * 60 * 1000,  // 3 days
  good: 1 * 24 * 60 * 60 * 1000,   // 1 day
  meh: 30 * 60 * 1000,    // 30 day
  bad: 1 * 60 * 1000              // 1 minute
};

// Load review deck: only cards that are due for review
function loadReviewDeck() {
  const saved = JSON.parse(localStorage.getItem("tarotProgress") || "{}");
  const now = Date.now();

  reviewDeck = allCards.filter(card => {
    const progress = saved[card.id];
    return progress && progress.nextDue && progress.nextDue <= now;
  }).map(card => {
    const savedData = saved[card.id];
    return {
      ...card,
      rating: savedData.rating || "new",
      nextDue: savedData.nextDue
    };
  });
}

// Show the next card
function showNextCard() {
  if (reviewDeck.length === 0) {
    document.getElementById("card-box").classList.add("hidden");
    document.getElementById("done-screen").classList.remove("hidden");
    return;
  }

  currentCard = reviewDeck[Math.floor(Math.random() * reviewDeck.length)];

  document.getElementById("card-name").textContent = currentCard.name;

  const cardImage = document.getElementById("card-image");
  cardImage.src = currentCard.img;  // make sure tarot-data.js has correct path
  cardImage.alt = currentCard.name;

  document.getElementById("card-meaning").textContent = currentCard.meaning;
  document.getElementById("card-meaning").classList.add("hidden");

  document.getElementById("rating-buttons").classList.add("hidden");
  document.getElementById("reveal-container").classList.remove("hidden");

  updateCardColor(currentCard);
}

// Show the meaning
function showAnswer() {
  document.getElementById("card-meaning").classList.remove("hidden");
  document.getElementById("rating-buttons").classList.remove("hidden");
  document.getElementById("reveal-container").classList.add("hidden");
}

// Handle rating
function rateCard(rating) {
  const saved = JSON.parse(localStorage.getItem("tarotProgress") || "{}");

  saved[currentCard.id] = {
    rating,
    nextDue: Date.now() + delayMap[rating]
  };

  localStorage.setItem("tarotProgress", JSON.stringify(saved));

  // Remove the card from the review deck
  reviewDeck = reviewDeck.filter(card => card.id !== currentCard.id);

  showNextCard();
}

// Apply color border based on current rating
function updateCardColor(card) {
  const cardBox = document.getElementById("card-box");
  cardBox.classList.remove("great", "good", "meh", "bad", "new");

  const rating = card.rating || "new";
  cardBox.classList.add(rating);
}

// Init on load
window.addEventListener("DOMContentLoaded", () => {
  loadReviewDeck();
  showNextCard();
});

document.getElementById('explore-button').addEventListener('click', () => {
  window.location.href = 'explore.html';
});

console.log(new Date(1754762278776));