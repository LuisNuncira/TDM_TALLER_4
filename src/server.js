import "dotenv/config";
import morgan from "morgan";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3001;

app.use(morgan("tiny"));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});