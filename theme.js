import { saveTheme, loadTheme } from "./pokemon-storage.js"

let currentTheme = "dark"

export function initTheme() {
  const savedTheme = loadTheme()
  if (savedTheme) currentTheme = savedTheme
  const themeToggle = document.getElementById("theme-toggle")
  themeToggle.addEventListener("click", toggleTheme)
  applyTheme()
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark"
  saveTheme(currentTheme)
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
