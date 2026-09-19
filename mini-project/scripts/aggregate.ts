import {
  createReadStream,
  createWriteStream
} from "node:fs";

import { createInterface } from "node:readline";

const start = performance.now();

const totalsByCategory = new Map<string, number>();
let rowCount = 0;
let grandTotal = 0;
let firstLine = true;

const input = createReadStream("data/products.csv", {
  encoding: "utf8"
});

const reader = createInterface({
  input,
  crlfDelay: Infinity
});

for await (const line of reader) {
  if (firstLine) {
    firstLine = false;
    continue;
  }

  const columns = line.split(",");

  const category = columns[2];
  const price = Number(columns[3]);
  const stock = Number(columns[4]);

  const total = price * stock;

  totalsByCategory.set(
    category,
    (totalsByCategory.get(category) ?? 0) + total
  );

  grandTotal += total;
  rowCount++;
}

const outputPath =
  process.env.OUT_FILE ?? "data/category-summary.csv";

const output = createWriteStream(outputPath);

output.write("category,total\n");

for (const [category, total] of totalsByCategory) {
  console.log(`${category} → $${total.toFixed(2)}`);
  output.write(`${category},${total.toFixed(2)}\n`);
}

output.end();

const elapsed = performance.now() - start;

console.log(`Rows: ${rowCount}`);
console.log(`Grand total: $${grandTotal.toFixed(2)}`);
console.log(`Runtime: ${elapsed.toFixed(1)} ms`);