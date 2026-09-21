import { CATEGORIES } from "../data/items.js";

export function validateItem(req, res, next) {
    const { nombre, descripcion, precio, categoria, stock, image } = req.body ?? {};
    const errors = {};

    if (!String(nombre ?? "").trim()) errors.nombre = "El nombre es obligatorio.";
    if (!String(descripcion ?? "").trim()) errors.descripcion = "La descripción es obligatoria.";
    if (typeof precio !== "number" || !Number.isFinite(precio) || precio < 0) {
        errors.precio = "El precio debe ser un número mayor o igual a 0.";
    }
    if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
        errors.stock = "El stock debe ser un entero mayor o igual a 0.";
    }
    if (!CATEGORIES.includes(categoria)) {
        errors.categoria = `La categoría debe ser una de: ${CATEGORIES.join(", ")}.`;
    }
    if (!String(image ?? "").trim()) errors.image = "La imagen es obligatoria.";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: "Datos inválidos", errors });
    }

    return next();
}