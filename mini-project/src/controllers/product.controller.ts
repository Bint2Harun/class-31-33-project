import type { Request, Response } from "express";

import {
  createProduct as addProduct,
  deleteProduct as removeProduct,
  findAllProducts,
  findProductById,
  updateProduct as editProduct
} from "../services/product.service.js";

export function getAllProducts(
  req: Request,
  res: Response
) {
  const category = req.query.category;

  let products = findAllProducts();

  if (typeof category === "string") {
    products = products.filter(
      (product) => product.category === category
    );
  }

  res.json(products);
}

export function getProductById(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);
  const product = findProductById(id);

  if (!product) {
    return res
      .status(404)
      .json({ error: "Product not found" });
  }

  res.json(product);
}

export function createProduct(
  req: Request,
  res: Response
) {
  const { name, category, price, stock } = req.body;

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof price !== "number"
  ) {
    return res
      .status(400)
      .json({ error: "name and price are required" });
  }

  const product = addProduct({
    name,
    category: category ?? "other",
    price,
    stock: typeof stock === "number" ? stock : 0
  });

  res.status(201).json(product);
}

export function updateProduct(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  const product = editProduct(id, req.body);

  if (!product) {
    return res
      .status(404)
      .json({ error: "Product not found" });
  }

  res.json(product);
}

export function deleteProduct(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);
  const deleted = removeProduct(id);

  if (!deleted) {
    return res
      .status(404)
      .json({ error: "Product not found" });
  }

  res.json({ deleted: true, id });
}