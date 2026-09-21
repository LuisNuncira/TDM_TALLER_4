import { getItem, getItems } from "./services/api.js";
import { renderCatalog, renderCatalogState, renderDetail, setStatus } from "./ui/ui.js";

const catalogContainer = document.getElementById("catalogContainer");
const catalogStatus = document.getElementById("catalogStatus");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const modal = document.getElementById("itemModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
let searchTimer;

function currentFilters() {
    return {
        q: searchInput.value.trim(),
        categoria: categoryFilter.value,
        sort: sortFilter.value
    };
}

async function loadCatalog() {
    const filters = currentFilters();
    const hasFilters = Object.values(filters).some(Boolean);
    setStatus(catalogStatus, "Cargando catálogo...");
    renderCatalogState(catalogContainer, "Cargando productos...");

    try {
        const items = await getItems(filters);
        if (items.length === 0) {
            renderCatalogState(catalogContainer, hasFilters ? "No hay resultados para tu búsqueda." : "No hay items disponibles.");
            setStatus(catalogStatus, "0 resultados.");
            return;
        }
        renderCatalog(items, catalogContainer);
        setStatus(catalogStatus, `${items.length} resultados.`, "success");
    } catch (error) {
        renderCatalogState(catalogContainer, "No se pudo cargar el catálogo.");
        setStatus(catalogStatus, error.code === "OFFLINE" ? "No disponible sin conexión." : error.message, "error");
    }
}

function scheduleLoad() {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(loadCatalog, 250);
}

searchInput.addEventListener("input", scheduleLoad);
categoryFilter.addEventListener("change", loadCatalog);
sortFilter.addEventListener("change", loadCatalog);

catalogContainer.addEventListener("click", async event => {
    const button = event.target.closest(".btn-detail");
    if (!button) return;
    try {
        const item = await getItem(Number(button.dataset.id));
        renderDetail(item, modalBody);
        modal.hidden = false;
        modal.classList.add("active");
        modalClose.focus();
    } catch (error) {
        setStatus(catalogStatus, error.message, "error");
    }
});

function closeModal() {
    modal.classList.remove("active");
    modal.hidden = true;
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});
window.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
});

loadCatalog();
