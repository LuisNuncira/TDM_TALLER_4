const API_URL = "/api/items";

async function request(url, options = {}) {
    if (options.method && !navigator.onLine) {
        const error = new Error("No disponible sin conexión");
        error.code = "OFFLINE";
        throw error;
    }

    try {
        const response = await fetch(url, options);
        if (response.headers.get("X-Offline-Cache") === "true") {
            window.dispatchEvent(new CustomEvent("app:offline-data"));
        }
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.error || "La solicitud no pudo completarse.");
            error.details = data.errors;
            throw error;
        }
        return data;
    } catch (error) {
        if (!navigator.onLine && !options.method) {
            window.dispatchEvent(new CustomEvent("app:offline-data"));
        }
        throw error;
    }
}

export function getItems(filters = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value);
    }
    const query = params.toString();
    return request(query ? `${API_URL}?${query}` : API_URL);
}

export function getItem(id) {
    return request(`${API_URL}/${id}`);
}

export function createItem(data) {
    return request(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

export function updateItem(id, data) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

export function deleteItem(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" });
}
