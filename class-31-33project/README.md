Assignment — Classes 31–33

Products Inventory CLI → API

This project is my backend assignment for IOTBTECH Classes 31–33.

The project combines three major backend concepts:

* Class 31: Node.js runtime, CLI arguments, Buffers, Streams and Bun
* Class 32: Express.js, TypeScript, REST API and three-layer architecture
* Class 33: Middleware, Winston logging, API-key authentication and error handling

The project starts by generating product inventory data as a CSV file, processes the data using Node.js streams, loads the products into an Express API, and finally adds middleware and error handling.

⸻

Project Structure

backend-assignment/
├── THEORY.md
├── README.md
└── mini-project/
    ├── package.json
    ├── tsconfig.json
    ├── .gitignore
    ├── scripts/
    │   ├── generate.ts
    │   └── aggregate.ts
    ├── data/
    │   └── products.csv
    └── src/
        ├── index.ts
        ├── middleware/
        │   ├── requestLogger.ts
        │   ├── requireApiKey.ts
        │   ├── notFoundHandler.ts
        │   └── errorHandler.ts
        ├── routes/
        │   └── product.routes.ts
        ├── controllers/
        │   └── product.controller.ts
        ├── services/
        │   └── product.service.ts
        └── utils/
            └── logger.ts

⸻

Technologies Used

* Node.js
* TypeScript
* Express.js
* Winston
* CSV
* Node.js Streams
* readline
* Bun (optional)
* REST API
* Git and GitHub

⸻

Phase A — Node.js CLI

Phase A generates and processes product inventory data.

The generate.ts script creates a CSV file containing:

id,name,category,price,stock

The default number of rows is 10,000.

To generate the products:

npx tsx scripts/generate.ts

To generate a larger file:

ROWS=1000000 npx tsx scripts/generate.ts

The aggregate.ts script reads the CSV using:

createReadStream

and:

readline

instead of loading the entire file into memory.

Run it with:

npx tsx scripts/aggregate.ts

It calculates:

* Total inventory value per category
* Grand total inventory value
* Number of rows processed
* Processing time

It also creates:

data/category-summary.csv

⸻

Phase B — Express API

Phase B converts the inventory data into an Express REST API.

The API uses three layers:

Routes

Routes define the API endpoints.

Controllers

Controllers receive HTTP requests, validate input and send HTTP responses.

Services

Services contain the product data and business logic.

This separation makes the application easier to understand and maintain.

⸻

API Endpoints

Get all products

GET /api/products

Filter by category

GET /api/products?category=electronics

Get one product

GET /api/products/:id

Example:

GET /api/products/42

Create a product

POST /api/products

Example JSON:

{
  "name": "Keyboard",
  "category": "electronics",
  "price": 59,
  "stock": 200
}

Update a product

PUT /api/products/:id

Delete a product

DELETE /api/products/:id

⸻

Phase C — Middleware and Error Handling

Phase C adds middleware around the API.

The middleware order is:

Request Logger
      ↓
express.json()
      ↓
Product Routes
      ↓
404 Handler
      ↓
Error Handler

The request logger records:

* HTTP method
* URL
* Status code
* Request duration

Winston writes logs to:

logs/app.log

and also displays them in the console.

⸻

API Key Protection

Write operations are protected with an API key.

The following routes require the x-api-key header:

POST /api/products
PUT /api/products/:id
DELETE /api/products/:id

Example:

curl -X POST http://localhost:3000/api/products \
  -H "x-api-key: secret" \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":59}'

A request without the API key receives:

{
  "error": "Missing API key"
}

⸻

Error Handling

The project includes:

404 Handler

Used when no route matches the request:

{
  "error": "Not Found"
}

Global Error Handler

Unexpected server errors return:

{
  "error": "Internal Server Error",
  "message": "..."
}

The error handler is registered last so that errors from earlier middleware and routes can reach it.

⸻

Installation

Navigate into the mini-project:

cd mini-project

Install the dependencies:

npm install

If dependencies have not been installed yet, the main packages include:

npm install express winston

Development dependencies:

npm install -D typescript tsx @types/express @types/node

⸻

Running the Project

1. Generate the CSV

npx tsx scripts/generate.ts

2. Aggregate the CSV

npx tsx scripts/aggregate.ts

3. Start the development server

npm run dev

The API runs on:

http://localhost:3000

⸻

Testing

Get all products:

curl http://localhost:3000/api/products

Get a single product:

curl http://localhost:3000/api/products/42

Filter products:

curl "http://localhost:3000/api/products?category=books"

Create a product:

curl -X POST http://localhost:3000/api/products \
  -H "x-api-key: secret" \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","category":"electronics","price":59,"stock":200}'

Test the API-key protection:

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":59}'

The request should return:

{
  "error": "Missing API key"
}

Test the 404 handler:

curl http://localhost:3000/nope

Test the error handler:

curl http://localhost:3000/boom

⸻

Class Takeaways

Class 31 — Node.js, Buffers and Streams

I learned how Node.js handles command-line arguments using process.argv, how Buffers represent binary data as bytes, and why strings and bytes are not always the same thing. I also learned why streams are important when processing large files because they avoid loading the entire file into memory.

Class 32 — Express and TypeScript

I learned how to build a REST API using Express and TypeScript. I also learned how routes, controllers and services can be separated into different layers so that each part of the application has a clear responsibility.

Class 33 — Middleware and Error Handling

I learned how Express middleware works and why the order of middleware matters. I also learned how to create request logging, API-key protection, 404 handling and a global error handler. Winston was used for application logging.

⸻

Key Lessons

The main lessons from this assignment are:

1. Large files should be processed with streams instead of loading everything into memory.
2. process.argv.slice(2) gives a CLI application its actual user arguments.
3. Express route order matters because Express processes matching routes from top to bottom.
4. express.json() must be registered before routes that need JSON request bodies.
5. Controllers should handle HTTP concerns while services handle application/data logic.
6. Middleware must either call next() or finish the response.
7. next(err) sends an error into the error-handling pipeline.
8. Error-handling middleware must have four parameters.
9. The 404 handler should come before the global error handler.
10. Logging helps monitor and troubleshoot API requests.

⸻

Author

Abubakar Rashida Haruna

IOTBTECH 2026 Backend Assignment

Classes 31–33