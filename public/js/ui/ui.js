export function renderItems(items,tableBody) {
    tableBody.innerHTML = "";
    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td><img src="${item.image}" alt="${item.nombre}" width="50"></td>
            <td>${item.nombre}</td>
            <td>${item.categoria}</td>
            <td>${item.precio}</td>
            <td>${item.stock}</td>
            <td>
                <button class="btn-edit" data-id="${item.id}">Editar</button>
                <button class="btn-delete" data-id="${item.id}">Eliminar</button>
            </td>
        `;
        
    });
}
export function resetForm(form, submitBtn){
    form.reset();
    const hiddenId = form.querySelector("#itemId");
    if (hiddenId) hiddenId.value = "";
    if (submitBtn) submitBtn.textContent = "Agregar";
}

export function fillForm(form, item, submitBtn){

    const hiddenId = form.querySelector("#itemId");
    if (hiddenId) hiddenId.value = item.id;

    form.querySelector("#nombre").value = item.nombre;
    form.querySelector("#descripcion").value = item.descripcion;
    form.querySelector("#precio").value = item.precio;
    form.querySelector("#categoria").value = item.categoria;
    form.querySelector("#stock").value = item.stock;
    form.querySelector("#image").value = item.image;

    if (submitBtn) submitBtn.textContent = "Guardar Cambios";
}