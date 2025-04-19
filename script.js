const body = document.body;
const themeToggleBtn = document.querySelector('.switch input[type="checkbox"]');
const currentTheme = localStorage.getItem("theme");

const applyTheme = (theme) => {
  if (theme === "dark") {
    body.classList.add("dark-mode");
    themeToggleBtn.checked = true;
  } else {
    body.classList.remove("dark-mode");
    themeToggleBtn.checked = false;
  }
};

if (currentTheme) {
  applyTheme(currentTheme);
} else {
  applyTheme("light"); // Default to light theme if no preference is set
}

themeToggleBtn.addEventListener("change", () => {
  const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});
