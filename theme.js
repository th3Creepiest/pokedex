const THEME_KEY = "pokedex-theme"

let currentTheme = "dark"

/**
 * @param {HTMLElement} themeToggle
 * */
export function initTheme(themeToggle) {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme) currentTheme = savedTheme
  themeToggle.addEventListener("click", toggleTheme)
  applyTheme()
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark"
  localStorage.setItem(THEME_KEY, currentTheme)
  applyTheme()
}

function applyTheme() {
  if (currentTheme === "light") {
    document.body.classList.add("light-theme")
    document.querySelector("#theme-toggle .theme-icon").textContent = "🌙"
  } else {
    document.body.classList.remove("light-theme")
    document.querySelector("#theme-toggle .theme-icon").textContent = "☀️"
  }
}
