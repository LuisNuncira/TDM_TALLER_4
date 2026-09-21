import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "items.json");

export const CATEGORIES = ["Teclados", "Ratones", "Audífonos", "Micrófonos", "Accesorios"];
let items = JSON.parse(fs.readFileSync(dataPath, "utf8"));

function saveItems() {
    fs.writeFileSync(dataPath, `${JSON.stringify(items, null, 2)}\n`);
}

export function getAll() {
    return items.map(item => ({ ...item }));
}

export function getById(id) {
    return items.find(item => item.id === id);
}

export function createItem(data) {
    const id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    const item = { id, ...data };
    items.push(item);
    saveItems();
    return item;
}

export function updateItem(id, data) {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, id };
    saveItems();
    return items[index];
}

export function deleteItem(id) {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    saveItems();
    return true;
}
