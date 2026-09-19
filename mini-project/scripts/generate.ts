import { mkdirSync, writeFileSync } from "node:fs";

const rows = Number(process.env.ROWS ?? "10000");

const categories = [
  "electronics",
  "clothing",
  "books",
  "home",
  "toys",
  "food"
];

mkdirSync("data", { recursive: true });

const lines = ["id,name,category,price,stock"];

for (let i = 1; i <= rows; i++) {
  const category = categories[(i - 1) % categories.length];
  const name = `${category}-${i}`;
  const price = (((i * 137) % 10000) / 100).toFixed(2);
  const stock = (i * 7) % 501;

  lines.push(`${i},${name},${category},${price},${stock}`);
}

writeFileSync("data/products.csv", lines.join("\n"));

console.log(`Generated ${rows} rows -> data/products.csv`);