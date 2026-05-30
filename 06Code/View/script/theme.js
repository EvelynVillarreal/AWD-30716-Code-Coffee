document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");

  if (!toggle) {
    return;
  }

  const icon = toggle.querySelector(".theme-icon");

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (icon) {
      icon.className = theme === "dark" ? "bi bi-sun-fill theme-icon" : "bi bi-moon-stars-fill theme-icon";
    }
  };

  const saved = localStorage.getItem("alc-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = saved || (prefersDark ? "dark" : "light");
  applyTheme(current);

  toggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("alc-theme", next);
  });
});
