const delayMap = {
  great: 7 * 24 * 60 * 60 * 1000,
  good: 3 * 24 * 60 * 60 * 1000,
  meh: 24 * 60 * 60 * 1000,
  bad: 30 * 60 * 1000
};

let mode = "explore"; // default
let currentCard = null;
let deck = [];

function setMode(newMode) {
  mode = newMode;
  document.querySelector(".card").classList.add("hidden");
  document.getElementById("done-screen").classList.add("hidden");
  document.getElementById("explore-container").classList.add("hidden");

  if (mode === "review") {
    loadDeck();
  } else if (mode === "explore") {
    showExploreCards();
  }
}

function loadDeck() {
  const saved = JSON.parse(localStorage.getItem("tarotDeck")) || {};
  const now = Date.now();

  // Only include cards that:
  // 1. Have a saved rating (meaning they've been reviewed before)
  // 2. Have a nextDue timestamp that is in the past or now
  deck = allCards.filter(card => {
    const stored = saved[card.id];
    if (!stored || !stored.nextDue) return false;
    return stored.nextDue <= now;
  });

  if (deck.length === 0) {
    document.querySelector(".card").classList.add("hidden");
    document.getElementById("done-screen").classList.remove("hidden");
  } else {
    document.querySelector(".card").classList.remove("hidden");
    showNextCard();
  }
}


function showNextCard() {
  if (!currentCard && deck.length === 0) return;

  currentCard = deck[Math.floor(Math.random() * deck.length)];
  document.querySelector(".card").classList.remove("hidden"); // ✅ ensure visible
  document.getElementById("card-name").textContent = currentCard.name;
  document.getElementById("card-meaning").textContent = currentCard.meaning;
  document.getElementById("card-meaning").classList.add("hidden");
  document.getElementById("rating-buttons").classList.add("hidden");

  updateCardColor(currentCard);
}




function showAnswer() {
  document.getElementById("card-meaning").classList.remove("hidden");
  document.getElementById("rating-buttons").classList.remove("hidden");
}

function rateCard(rating) {
  const saved = JSON.parse(localStorage.getItem("tarotDeck")) || {};
  saved[currentCard.id] = {
    nextDue: Date.now() + delayMap[rating],
    rating: rating
  };
  localStorage.setItem("tarotDeck", JSON.stringify(saved));
  deck = deck.filter(card => card.id !== currentCard.id);

  if (deck.length > 0) {
    showNextCard();
  } else {
    document.querySelector(".card").classList.add("hidden");
    document.getElementById("done-screen").classList.remove("hidden");
  }
}


let exploreDeck = [];
let exploreIndex = 0;

function showExploreCards() {
  const saved = JSON.parse(localStorage.getItem("tarotDeck")) || {};
  exploreDeck = shuffleArray([...allCards]).slice(0, 10); // Pick 10 at random
  exploreIndex = 0;

  document.querySelector(".card").classList.remove("hidden");
  document.getElementById("done-screen").classList.add("hidden");
  document.getElementById("explore-container").classList.add("hidden");
  document.getElementById("rating-buttons").classList.add("hidden");

  showNextExploreCard(saved);
}

function showNextExploreCard(saved) {
  const card = exploreDeck[exploreIndex];
  const isNew = !saved[card.id];
  currentCard = card;

  document.getElementById("card-name").textContent = card.name;
  document.getElementById("card-meaning").textContent = card.meaning;
  document.getElementById("card-meaning").classList.add("hidden");

  const ratingButtons = document.getElementById("rating-buttons");

  if (isNew) {
    ratingButtons.innerHTML = `
      <button class="blue" onclick="rateCardFromExplore('great')">🔵 Great</button>
      <button class="green" onclick="rateCardFromExplore('good')">🟢 Good</button>
      <button class="yellow" onclick="rateCardFromExplore('meh')">🟡 Meh</button>
      <button class="red" onclick="rateCardFromExplore('bad')">🔴 Bad</button>
    `;
  } else {
    ratingButtons.innerHTML = `<button onclick="nextExploreCard()">Next Card</button>`;
  }

  ratingButtons.classList.add("hidden");

  updateCardColor(currentCard); // ✅
}


function showAnswer() {
  document.getElementById("card-meaning").classList.remove("hidden");
  document.getElementById("rating-buttons").classList.remove("hidden");
}


function nextExploreCard() {
  exploreIndex++;
  if (exploreIndex >= exploreDeck.length) {
    document.querySelector(".card").classList.add("hidden");
    document.getElementById("done-screen").classList.remove("hidden");
  } else {
    const saved = JSON.parse(localStorage.getItem("tarotDeck")) || {};
    showNextExploreCard(saved);
  }
}

// Helper: Shuffle array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function rateCardFromExplore(rating) {
  const saved = JSON.parse(localStorage.getItem("tarotDeck")) || {};
  saved[currentCard.id] = {
    nextDue: Date.now() + delayMap[rating],
    rating: rating
  };
  localStorage.setItem("tarotDeck", JSON.stringify(saved));
  nextExploreCard();
}

function updateCardColor(card) {
  const saved = JSON.parse(localStorage.getItem("tarotDeck")) || {};
  const rating = saved[card.id]?.rating || "new";

  const cardDiv = document.querySelector(".card");
  cardDiv.classList.remove("great", "good", "meh", "bad", "new");
  cardDiv.classList.add(rating);
}


setMode("explore"); // default mode