import cors from "cors";
import express from "express";
import indexRoutes from "./routes/indexRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { swaggerDocs } from "../swagger.js";

const app = express();

// Permite requisições de diferentes origens
app.use(cors());

// Middleware global para JSON
app.use(express.json());

// Rota raiz
app.get("/", (req, res) => res.status(200).send("Blog escolar"));

// Rotas principais
indexRoutes(app);

// Swagger
swaggerDocs(app);

// Middleware de rota não encontrada (404)
app.use(notFound);

// Middleware de erro (500)
app.use(errorHandler);


export default app;