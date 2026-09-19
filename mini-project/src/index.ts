import express from "express";

import productRouter from "./routes/product.routes.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(requestLogger);
app.use(express.json());

app.use("/api/products", productRouter);

app.get("/boom", (_req, _res) => {
  throw new Error("Kaboom!");
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});