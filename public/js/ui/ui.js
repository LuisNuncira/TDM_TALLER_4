const currency = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function stateMarkup(message) {
    return `<tr><td colspan="5"><div class="state-panel">${escapeHtml(message)}</div></td></tr>`;
}

export function renderTableState(tableBody, state, message) {
    tableBody.innerHTML = stateMarkup(message);
}

export function renderItems(items, tableBody) {
    tableBody.innerHTML = items.map(item => `
        <tr>
            <td>
                <div class="toolbar-actions">
                    <img class="table-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.nombre)}">
                    <strong>${escapeHtml(item.nombre)}</strong>
                </div>
            </td>
            <td><span class="badge">${escapeHtml(item.categoria)}</span></td>
            <td>${currency.format(item.precio)}</td>
            <td>${item.stock}</td>
            <td>
                <div class="toolbar-actions">
                    <button class="btn btn-ghost btn-edit" type="button" data-id="${item.id}">Editar</button>
                    <button class="btn btn-danger btn-delete" type="button" data-id="${item.id}">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join("");
}

export function renderCatalogState(container, message) {
    container.innerHTML = `<div class="state-panel">${escapeHtml(message)}</div>`;
}

export function renderCatalog(items, container) {
    container.innerHTML = items.map(item => `
        <article class="product-card">
            <img class="product-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.nombre)}" loading="lazy">
            <div><span class="badge">${escapeHtml(item.categoria)}</span></div>
            <h2>${escapeHtml(item.nombre)}</h2>
            <p class="description">${escapeHtml(item.descripcion)}</p>
            <div class="product-meta">
                <span class="price">${currency.format(item.precio)}</span>
                <span>${item.stock} disponibles</span>
            </div>
            <button class="btn btn-secondary btn-detail" type="button" data-id="${item.id}">Ver detalle</button>
        </article>
    `).join("");
}

export function renderDetail(item, modalBody) {
    modalBody.innerHTML = `
        <img class="product-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.nombre)}">
        <span class="badge">${escapeHtml(item.categoria)}</span>
        <h2 id="modalTitle">${escapeHtml(item.nombre)}</h2>
        <p class="description">${escapeHtml(item.descripcion)}</p>
        <p class="price">${currency.format(item.precio)}</p>
        <p>${item.stock} unidades disponibles</p>
    `;
}

export function resetForm(form, submitButton, cancelButton, title) {
    form.reset();
    form.querySelector("#itemId").value = "";
    submitButton.textContent = "Guardar producto";
    cancelButton.hidden = true;
    title.textContent = "Añadir producto";
}

export function fillForm(form, item, submitButton, cancelButton, title) {
    form.querySelector("#itemId").value = item.id;
    form.querySelector("#nombre").value = item.nombre;
    form.querySelector("#descripcion").value = item.descripcion;
    form.querySelector("#precio").value = item.precio;
    form.querySelector("#categoria").value = item.categoria;
    form.querySelector("#stock").value = item.stock;
    form.querySelector("#image").value = item.image;
    submitButton.textContent = "Actualizar producto";
    cancelButton.hidden = false;
    title.textContent = "Editar producto";
}

export function setStatus(element, message, state = "normal") {
    element.textContent = message;
    element.dataset.state = state;
}
