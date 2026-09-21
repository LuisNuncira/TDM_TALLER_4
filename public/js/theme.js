const themeKey = "modo-nativo-theme";
const themeButtons = document.querySelectorAll("[data-theme-toggle]");
const offlineBanners = document.querySelectorAll("[data-offline-banner]");

function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    themeButtons.forEach(button => {
        button.textContent = theme === "dark" ? "Tema claro" : "Tema oscuro";
        button.setAttribute("aria-label", theme === "dark" ? "Activar tema claro" : "Activar tema oscuro");
    });
}

const initialTheme = localStorage.getItem(themeKey) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(initialTheme);

themeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        localStorage.setItem(themeKey, nextTheme);
        applyTheme(nextTheme);
    });
});

function showOfflineBanner() {
    offlineBanners.forEach(banner => banner.classList.add("is-visible"));
}

window.addEventListener("offline", showOfflineBanner);
window.addEventListener("app:offline-data", showOfflineBanner);
window.addEventListener("online", () => offlineBanners.forEach(banner => banner.classList.remove("is-visible")));
if (!navigator.onLine) showOfflineBanner();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(error => console.error("No se pudo registrar el service worker", error));
}
