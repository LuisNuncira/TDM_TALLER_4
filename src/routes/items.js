const itemsData = require('../data/items');

function handleItemsRoutes(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;


    if (!pathname.startsWith('/api/items')) {
        return false; 
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return true;
    }
    const id = Number(pathname.split('/')[3]);

    if (method === 'GET' && !id) {
        res.writeHead(200);
        res.end(JSON.stringify(itemsData.getAll()));
        return true;
    }
    if (method === 'GET' && id) {
        const item = itemsData.getById(id);
        if (item) {
            res.writeHead(200);
            res.end(JSON.stringify(item));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Item no encontrado" }));
        }
        return true;
    }
    if (method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const newItem = itemsData.create(data);
                res.writeHead(201);
                res.end(JSON.stringify(newItem));
            } catch (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Datos inválidos" }));
            }
        });
        return true;
    }
    if (method === 'PUT' && id) {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const updatedItem = itemsData.update(id, data);
                if (updatedItem) {
                    res.writeHead(200);
                    res.end(JSON.stringify(updatedItem));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: "Item no encontrado" }));
                }
            } catch (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Datos inválidos" }));
            }
        });
        return true;
    }
    if (method === 'DELETE' && id) {
        const success = itemsData.deleteItem(id);
        if (success) {
            res.writeHead(200);
            res.end(JSON.stringify({ message: "Eliminado con éxito" }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Item no encontrado" }));
        }
        return true;
    }
    return false;
}
module.exports = handleItemsRoutes;