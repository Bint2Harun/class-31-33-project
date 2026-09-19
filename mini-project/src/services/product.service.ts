import { readFileSync } from "node:fs";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const csvPath = "data/products.csv";

function loadProducts(): Product[] {
  const file = readFileSync(csvPath, "utf8");

  const lines = file
    .trim()
    .split("\n")
    .slice(1);

  return lines.map((line, index) => {
    const [csvId, name, category, price, stock] =
      line.split(",");

    return {
      id: index + 1,
      name,
      category,
      price: Number(price),
      stock: Number(stock)
    };
  });
}

let products = loadProducts();
let nextId = products.length + 1;

export function findAllProducts(): Product[] {
  return products;
}

export function findProductById(
  id: number
): Product | undefined {
  return products.find((product) => product.id === id);
}

export function createProduct(
  data: Omit<Product, "id">
): Product {
  const product: Product = {
    id: nextId,
    ...data
  };

  nextId++;
  products.push(product);

  return product;
}

export function updateProduct(
  id: number,
  data: Partial<Omit<Product, "id">>
): Product | null {
  const product = findProductById(id);

  if (!product) {
    return null;
  }

  Object.assign(product, data);

  return product;
}

export function deleteProduct(id: number): boolean {
  const oldLength = products.length;

  products = products.filter((product) => product.id !== id);

  return products.length < oldLength;
}