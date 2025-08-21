//unlock the games
window.addEventListener("DOMContentLoaded", () => {
  const level = parseInt(localStorage.getItem("level") || "1");

  document.querySelectorAll(".game-card.locked").forEach(card => {
    const required = parseInt(card.dataset.requiredLevel);

    if (level >= required) {
      // Unlock: make it a link
      card.classList.remove("locked");
      card.classList.add("unlocked");

      const link = document.createElement("a");
      link.href = "memory.html";
      link.appendChild(card.cloneNode(true));

      card.replaceWith(link);
    }
  });
});
