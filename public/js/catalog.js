import { getItems, getItem } from "./services/api.js";

const catalogContainer = document.getElementById("catalogContainer");
const modal = document.getElementById("itemModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

async function loadCatalog() {
    try {
        const items = await getItems();
        catalogContainer.innerHTML = "";
        items.forEach(item => renderItem(item));
    } catch (err) {
        console.error("Error cargando catálogo:", err);
        catalogContainer.innerHTML = "<p>No se pudieron cargar los productos.</p>";
    }
}

function renderItem(item) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img src="${item.image}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
        <p class="card-category">${item.categoria}</p>
        <p class="card-price">$${item.precio}</p>
        <button class="btn-detail" data-id="${item.id}">Ver detalle</button>
    `;
    catalogContainer.appendChild(card);
}

catalogContainer.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-detail");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    try {
        const item = await getItem(id);
        showModal(item);
    } catch (err) {
        console.error("Error cargando el detalle:", err);
        alert("No se pudo cargar el detalle del producto.");
    }
});

function showModal(item) {
    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.nombre}">
        <h2>${item.nombre}</h2>
        <p class="card-category">${item.categoria}</p>
        <p>${item.descripcion}</p>
        <p><strong>Precio:</strong> $${item.precio}</p>
        <p><strong>Stock disponible:</strong> ${item.stock}</p>
    `;
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

loadCatalog();
