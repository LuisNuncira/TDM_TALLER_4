import { createItem, deleteItem, getItem, getItems, updateItem } from "./services/api.js";
import { fillForm, renderItems, renderTableState, resetForm, setStatus } from "./ui/ui.js";

const form = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTableBody");
const submitButton = document.getElementById("submitBtn");
const cancelButton = document.getElementById("cancelButton");
const formTitle = document.getElementById("formTitle");
const formStatus = document.getElementById("formStatus");
const listStatus = document.getElementById("listStatus");
let editingId = null;

function showError(error, target) {
    if (error.code === "OFFLINE") {
        setStatus(target, "No disponible sin conexión.", "error");
        return;
    }
    const details = error.details ? Object.values(error.details).join(" ") : error.message;
    setStatus(target, details || "No se pudo completar la operación.", "error");
}

async function loadItems() {
    setStatus(listStatus, "Cargando inventario...");
    renderTableState(tableBody, "loading", "Cargando productos...");
    try {
        const items = await getItems();
        if (items.length === 0) {
            renderTableState(tableBody, "empty", "No hay items en el inventario.");
            setStatus(listStatus, "Inventario vacío.");
            return;
        }
        renderItems(items, tableBody);
        setStatus(listStatus, `${items.length} productos disponibles.`, "success");
    } catch (error) {
        renderTableState(tableBody, "error", "No se pudo cargar el inventario.");
        showError(error, listStatus);
    }
}

tableBody.addEventListener("click", async event => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    const id = Number(button.dataset.id);

    if (button.classList.contains("btn-delete")) {
        try {
            await deleteItem(id);
            if (editingId === id) resetForm(form, submitButton, cancelButton, formTitle);
            editingId = null;
            setStatus(formStatus, "Producto eliminado.", "success");
            await loadItems();
        } catch (error) {
            showError(error, formStatus);
        }
        return;
    }

    try {
        const item = await getItem(id);
        fillForm(form, item, submitButton, cancelButton, formTitle);
        editingId = id;
        form.querySelector("#nombre").focus();
    } catch (error) {
        showError(error, formStatus);
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) {
        setStatus(formStatus, "Revisa los campos marcados.", "error");
        return;
    }

    const payload = {
        nombre: form.querySelector("#nombre").value.trim(),
        descripcion: form.querySelector("#descripcion").value.trim(),
        precio: Number(form.querySelector("#precio").value),
        categoria: form.querySelector("#categoria").value,
        stock: Number(form.querySelector("#stock").value),
        image: form.querySelector("#image").value.trim()
    };

    try {
        if (editingId) {
            await updateItem(editingId, payload);
            setStatus(formStatus, "Producto actualizado.", "success");
        } else {
            await createItem(payload);
            setStatus(formStatus, "Producto creado.", "success");
        }
        editingId = null;
        resetForm(form, submitButton, cancelButton, formTitle);
        await loadItems();
    } catch (error) {
        showError(error, formStatus);
    }
});

cancelButton.addEventListener("click", () => {
    editingId = null;
    resetForm(form, submitButton, cancelButton, formTitle);
    setStatus(formStatus, "Edición cancelada.");
});

loadItems();
