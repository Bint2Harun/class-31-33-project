 Backend Assignment

Classes 31–33 — Theory Answers

⸻

CLASS 31: Node.js Runtime, Buffer, Streams & Bun

1. Predict — process.argv

Command:

node app.js --port 8080 --host localhost

The output will be similar to:

[
  '/path/to/node',
  '/path/to/app.js',
  '--port',
  '8080',
  '--host',
  'localhost'
]

The second line will be:

[ '--port', '8080', '--host', 'localhost' ]

The exact Node and script paths can differ depending on the computer.

process.argv[0] is the Node executable path, process.argv[1] is the script path, and the actual command-line arguments start from index 2.

⸻

2. Why use process.argv.slice(2)?

I use process.argv.slice(2) because I only want the arguments supplied by the user and not the Node executable and script paths.

The first two positions can change depending on how the program is executed. For example, running with Node, Bun, an absolute path, or a wrapper can change those values. The actual user arguments still start from index 2, so slicing makes the CLI code more reliable.

⸻

3. Buffer and characters

The outputs are:

10
5
5

Buffer.from("مرحبا").length is 10 because the Buffer length is measured in bytes. These Arabic characters use 2 bytes each in UTF-8, giving 10 bytes in total.

Buffer.from("hello").length is 5 because each English character uses one byte in UTF-8.

"مرحبا".length gives 5 because the JavaScript string length is counting the characters/code units, not the number of UTF-8 bytes used to store the text.

⸻

4. Processing a 5 GB file

With:

const data = readFileSync("huge.log", "utf8");

Node tries to load the whole 5 GB file into memory before the program can process it.

The file data is stored in the program’s memory as a large string. This means that a machine with only 8 GB of RAM has very little memory left for Node itself, the operating system, and other applications. Other operations such as splitting or copying the data can require even more memory.

This can eventually cause the process to run out of memory.

createReadStream() avoids this because it reads the file in smaller chunks. The application processes one chunk at a time instead of keeping the entire 5 GB file in memory.

Therefore, the amount of memory used stays relatively stable even when the file becomes much larger.

⸻

5. pipe() vs pipeline()

Both pipe() and pipeline() connect streams so that data can flow from one stream to another.

The main practical difference is error handling. pipe() does not automatically clean up all connected streams when an error occurs, while pipeline() handles errors and destroys the streams involved.

For example, imagine copying a very large file and the destination disk becomes unavailable halfway through the operation. With pipe(), the source stream could remain open and leave resources behind. With pipeline(), the error is propagated and the connected streams are properly cleaned up.

For important stream operations, I would normally prefer pipeline() because it provides safer error handling.

⸻

6. Buffer encoding

For:

const buf = Buffer.from("Node.js");
console.log(buf.toString("hex"));
console.log(buf.toString("base64"));

The outputs are:

4e6f64652e6a73
Tm9kZS5qcw==

The hexadecimal output represents the bytes using hexadecimal notation, while Base64 represents the same bytes using Base64 encoding.

⸻

7. What does “streams keep memory flat” mean?

“Flat” means that memory usage does not continuously increase as the input file becomes larger.

The bucket approach loads and stores more and more information as the file grows. Therefore, its memory usage grows approximately linearly with the amount of data being processed.

For example:

10,000 rows       → smaller memory usage
1,000,000 rows    → much larger memory usage
10,000,000 rows   → extremely large memory usage

With a stream, only a limited amount of data is being processed at a time. Once a chunk has been processed, it can be released.

Therefore:

* Bucket/whole-file approach → memory grows with file size.
* Stream/pipe approach → memory remains relatively flat.

⸻

8. Bun vs Node

Three things Bun provides as part of its runtime/tooling are:

1. TypeScript execution — Bun can run TypeScript files directly without needing the same separate TypeScript execution setup normally used with Node.
2. Built-in package management — Bun includes its own package manager and lockfile system.
3. Built-in test runner and bundling tools — Bun provides tools for testing and bundling as part of its ecosystem.

For a real team project, I would consider both. Node would still be a strong choice when compatibility, ecosystem maturity, existing company infrastructure, and the availability of packages and developers are important. Bun can be attractive when its integrated tooling and performance are useful for the project.

⸻

CLASS 32: Express & TypeScript

9. Express route order

The routes are:

app.get("/api/products/:id", ...);
app.get("/api/products/featured", ...);
app.use("/api/products", ...);

Request 1

GET /api/products/featured

Response:

{
  "hit": "by-id",
  "id": "featured"
}

This happens because /api/products/:id appears before /api/products/featured. Express matches featured as the value of the id parameter and stops there.

Request 2

GET /api/products/42

Response:

{
  "hit": "by-id",
  "id": "42"
}

The dynamic :id route matches 42.

Request 3

GET /api/products

The first route does not match because it requires an ID. The second route also does not match. Therefore, the mounted fallback:

app.use("/api/products", ...)

handles the request and responds:

{
  "hit": "fallback"
}

Express processes routes from top to bottom and uses the first matching handler that sends a response.

⸻

10. Type of req.params.id

req.params.id is a string.

To convert it to a number, I would use:

Number(req.params.id)

For example:

const id = Number(req.params.id);

Express does not automatically convert it because URL path parameters arrive as text. The application decides whether that text should be treated as a number, string, or something else.

⸻

11. Routes, controllers and services

* Routes define the URLs and connect them to controller functions.
* Controllers handle the HTTP request and response and communicate with the service layer.
* Services contain the application’s data access and business logic.

If the company changes from storing products in an array to loading them from a CSV file, I would edit:

src/services/product.service.ts

The reason is that data storage belongs to the service/data layer. The routes and controllers should not need to know whether the products came from an array, CSV file, database, or another source.

⸻

12. Why is req.body undefined?

The missing line is:

app.use(express.json());

It must be placed before the routes:

const app = express();
app.use(express.json());
app.use("/api/products", productRouter);

express.json() parses incoming JSON request bodies and places the parsed object in req.body.

If it is missing, Express has not been told to parse the JSON body, so req.body can be undefined.

⸻

13. Express router prefix

Given:

app.use("/api/products", productRouter);

and:

router.get("/", ...);
router.get("/:id", ...);
router.get("/top", ...);

The first route responds to:

GET /api/products

The second route responds to:

GET /api/products/:id

For example:

GET /api/products/42

The /top route responds to:

GET /api/products/top

The prefix /api/products is added to the paths defined inside the router.

⸻

14. HTTP status codes

(a) Successful POST creating a product

201 Created

The request successfully created a new resource.

(b) Product ID does not exist

404 Not Found

The requested product cannot be found.

(c) POST missing the required name

400 Bad Request

The client sent incomplete or invalid input.

(d) Unexpected crash inside a route handler

500 Internal Server Error

The server encountered an unexpected problem while processing the request.

(e) Successful GET returning a list

200 OK

The request succeeded and the server returned the requested data.

⸻

CLASS 33: Middleware & Error Handling

15. Middleware execution order

The exact console output is:

M1 in
M2 GET /
handler starts
handler ends
M1 out

M1 out runs after the handler because next() passes control to the next middleware and eventually to the route handler.

After the downstream middleware and handler finish, execution returns to the code after next() inside the first middleware. That is why M1 out appears last.

⸻

16. Middleware forgets next()

If middleware does not call:

next();

and also does not send a response such as:

res.send(...)

the request remains open.

The client will usually keep waiting or show a request that never finishes.

The terminal will only show whatever logs were executed before the middleware stopped.

Express cannot automatically assume that middleware is finished because middleware may intentionally stop a request. For example, authentication middleware may intentionally send a 401 response instead of continuing.

Therefore, middleware must either:

* call next(), or
* finish the response.

⸻

17. Why four parameters make an error handler

Normal middleware normally has three parameters:

(req, res, next)

An Express error-handling middleware has exactly four:

(err, req, res, next)

Express uses the function’s parameter count to identify error-handling middleware.

Therefore:

(err, req, res, next)

is recognized as an error handler.

If it is changed to:

(err, req, res)

it no longer has four parameters, so Express treats it as normal middleware instead of an error handler.

⸻

18. next() vs next(err)

next() means:

Continue normally to the next middleware.

For example:

logger → JSON parser → routes → error handler

If a route calls:

next();

the normal middleware chain continues.

next(err) means:

An error occurred; skip normal middleware and go to error-handling middleware.

For example:

logger → JSON parser → routes
                         ↓
                     next(err)
                         ↓
                  error handler

next(err) skips the remaining regular middleware and moves into the error-handling chain.

⸻

19. Why res.on("finish") logs later

The middleware first records the starting time:

const start = Date.now();

Then it registers a listener:

res.on("finish", () => {
  // logging
});

The finish event happens when the response has been sent and the response stream has finished.

The middleware then calls:

next();

which allows the request to continue to the route handler.

The route eventually executes:

res.send("...");

Once the response finishes, the finish event fires and the logger calculates the elapsed time.

This is useful because it measures the whole request from the middleware starting until the response is finished.

⸻

20. Express 4 vs Express 5 async errors

In Express 4, rejected promises from an async route are not automatically forwarded to the error handler.

For example:

app.get("/", async (req, res) => {
  const product = await findProduct(id);
});

If findProduct() rejects, Express 4 does not automatically handle that rejection.

Two common solutions are:

Method 1 — try/catch

app.get("/", async (req, res, next) => {
  try {
    const product = await findProduct(id);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

Method 2 — asyncHandler

Create or use a wrapper that catches rejected promises and passes the error to:

next(err)

Express 5 automatically forwards rejected promises from async route handlers to the error handler.

To check the installed version, I can run:

npm ls express

⸻

21. 404 vs 500

A 404 Not Found means that Express could not find a route that matches the request.

A 500 Internal Server Error means that something went wrong while the server was processing a request, such as an unexpected exception.

The normal order is:

Routes
   ↓
404 handler
   ↓
Error handler

The 404 handler should come before the error handler because an unmatched request is not necessarily an application error. It simply means that no route handled it.

The error handler is reserved for actual errors passed to it.

The standard pipeline is therefore:

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

This keeps “nothing matched” separate from “something crashed.”

⸻

Summary

The main concepts I learned from Classes 31–33 are:

* Node’s process.argv contains command-line arguments.
* Buffers deal with bytes, while JavaScript strings deal with characters/code units.
* Streams are useful for processing large files without loading everything into memory.
* pipeline() provides better stream error handling than a basic pipe().
* Express routes are matched from top to bottom.
* express.json() is required when an Express application needs to parse JSON request bodies.
* Routes, controllers, and services separate responsibilities in an API.
* Middleware must either call next() or finish the response.
* next(err) moves an error into the error-handling chain.
* Express error handlers must have four parameters.
* The 404 handler comes before the global error handler