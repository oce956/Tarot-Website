// Initialize XP + Level
if (!localStorage.getItem("xp")) localStorage.setItem("xp", 0);
if (!localStorage.getItem("level")) localStorage.setItem("level", 1);

// Add XP and handle level up
function addXP(amount) {
  let xp = parseInt(localStorage.getItem("xp"));
  let level = parseInt(localStorage.getItem("level"));

  xp += amount;

  // Level up every 100 XP
  while (xp >= 100) {
    xp -= 100;
    level++;
  }

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);

  updateXPDisplay();
}

// Update the XP UI and bar
function updateXPDisplay() {
  const xp = parseInt(localStorage.getItem("xp"));
  const level = parseInt(localStorage.getItem("level"));

  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = level;

  const xpPercent = Math.min((xp / 100) * 100, 100);
  const xpBar = document.getElementById("xp-bar");
  if (xpBar) xpBar.style.width = xpPercent + "%";
}

// Call this on page load
window.addEventListener("DOMContentLoaded", () => {
  updateXPDisplay();
});
