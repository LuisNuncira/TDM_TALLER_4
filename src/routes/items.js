const fs= require("fs");
const path = require("path");


const DATA_PATH = path.join(__dirname, "..", "data", "items.json");




function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8") );
}




function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}


function handleItems(req, res) {
    if (!req.url.startsWith("/api/items")) return false;

    res.setHeader("Content-Type", "application/json");




    if(req.method === "GET" && req.url === "/api/items") {
        res.end(JSON.stringify(readData()));
        return true;
    }

    const urlParts = req.url.split("/");
    const idParam = urlParts[urlParts.length - 1].split("?")[0];
    const id = parseInt(idParam, 10);





    if (req.method === "GET" && !isNaN(id)) {
               
            const items = readData().find(i=> i.id === id);
            res.end(JSON.stringify(items || { error: "Item no encontrado"}));
            return true;
        
    }




    if (req.method === "POST" && req.url === "/api/items") {
        let body = "";;
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const items = readData();
            const nuevo = JSON.parse(body);
            nuevo.id = items.length > 0 ? items[items.length - 1].id + 1 : 1;
            items.push(nuevo);
            writeData(items);
            res.end(JSON.stringify(nuevo));
        });
        return true;
    }
        
    if (req.method === "PUT" && !isNaN(id)) {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            let items = readData();
            const idx = items.findIndex(i => i.id === id);

            if(idx >= 0) {
                const actualizado = {...items[idx], ...JSON.parse(body), id};
                items[idx] = actualizado;
                writeData(items);
                res.end(JSON.stringify(actualizado));
            } else {
                res.end(JSON.stringify({ error: "Item no encontrado" }));
            }
        });
        return true;
    }

    if (req.method === "DELETE" && !isNaN(id)) {
        let items = readData();
        const newItems = items.filter(i => i.id !== id);

        if(newItems.length !== items.length) {
            writeData(newItems);
            res.end(JSON.stringify({ message: "Item eliminado" }));
        } else {
            res.end(JSON.stringify({ error: "Item no encontrado" }));
        }
        return true;
    }
    return false;
}

module.exports = handleItemsRoutes;