import { getItems, getItem, createItem, updateItem, deleteItem } from './services/api.js';
import { renderItems, resetForm, fillForm } from './ui/ui.js';

const form = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTableBody");
const submitBtn = document.getElementById("submitBtn");
let editingId = null;

tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.dataset.id);

    if (btn.classList.contains("btn-delete")) {
        try {
            await deleteItem(id);
            if (editingId === id) {
                resetForm(form, submitBtn);
                editingId = null;
            }
            await loadItems();
        } catch (err) {
            console.error("Error al eliminar el item:", err);
            alert("No se pudo eliminar el item.");
        }
    } else if (btn.classList.contains("btn-edit")) {
        try {
            if (editingId === id) {
                resetForm(form, submitBtn);
                editingId = null;
                return;
            }
            const item = await getItem(id);
            fillForm(form, item, submitBtn);
            editingId = id;
        } catch (err) {
            console.error("Error al cargar el item:", err);
            alert("No se pudo cargar el item para editarlo.");
        }
    }
});
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = form.querySelector("#nombre").value.trim();
    const descripcion = form.querySelector("#descripcion").value.trim();
    const precio = Number(form.querySelector("#precio").value);
    const categoria = form.querySelector("#categoria").value;
    const stock = Number(form.querySelector("#stock").value);
    const image = form.querySelector("#image").value.trim();

    if (!nombre) {
        alert("El campo nombre es obligatorio.");
        return;
    }
    const payload = { nombre, descripcion, precio, categoria, stock, image };
    try {
        if (editingId) {
            await updateItem(editingId, payload);
            editingId = null;
        } else {
            await createItem(payload);
        }
        resetForm(form, submitBtn);
        await loadItems();
    } catch (err) {
        console.error("Error al guardar el item:", err);
        alert("No se pudo guardar el item.");
    }
});
async function loadItems() {
    try {
        const items = await getItems();
        renderItems(items, tableBody);
    } catch (err) {
        console.error("Error al cargar la lista:", err);
        alert("No se pudieron cargar los items.");
    }
}
loadItems();