import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createItem, deleteItem, getAll, getById, updateItem } from "./data/items.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { validateItem } from "./middlewares/validate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "..", "public");

function normalizeText(value) {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.static(publicPath));

app.get("/api/items", (req, res) => {
    const { q, categoria, sort } = req.query;
    let items = getAll();

    if (q) {
        const query = normalizeText(String(q).trim());
        items = items.filter(item =>
            normalizeText(`${item.nombre} ${item.descripcion}`).includes(query)
        );
    }

    if (categoria) {
        items = items.filter(item => item.categoria === String(categoria));
    }

    if (sort === "precio") {
        items.sort((first, second) => first.precio - second.precio);
    }

    return res.json(items);
});

app.get("/api/items/:id", (req, res) => {
    const item = getById(Number(req.params.id));
    if (!item) {
        return res.status(404).json({ error: "Item no encontrado" });
    }
    return res.json(item);
});

app.post("/api/items", validateItem, (req, res) => {
    return res.status(201).json(createItem(req.body));
});

app.put("/api/items/:id", validateItem, (req, res) => {
    const item = updateItem(Number(req.params.id), req.body);
    if (!item) {
        return res.status(404).json({ error: "Item no encontrado" });
    }
    return res.json(item);
});

app.delete("/api/items/:id", (req, res) => {
    if (!deleteItem(Number(req.params.id))) {
        return res.status(404).json({ error: "Item no encontrado" });
    }
    return res.json({ message: "Eliminado con éxito" });
});

app.use("/api", notFound);

app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

export default app;