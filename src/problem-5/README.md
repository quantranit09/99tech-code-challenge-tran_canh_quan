# Problem 5 – A Crude Server

A CRUD REST API built with **ExpressJS**, **TypeScript**, and **SQLite** (via `better-sqlite3`).

---

## Tech Stack

| Layer     | Technology                 |
| --------- | -------------------------- |
| Language  | TypeScript                 |
| Framework | Express.js                 |
| Database  | SQLite (`better-sqlite3`)  |
| Testing   | Jest + ts-jest + supertest |

---

## Project Structure

```
src/
├── server.ts          # Entrypoint – starts the HTTP server
├── app.ts             # Express app factory (used by both server and tests)
├── db.ts              # SQLite connection + schema initialisation
├── types.ts           # Shared TypeScript interfaces
├── itemRepository.ts  # Data-access layer (all SQL lives here)
├── itemRouter.ts      # Express router for /items
└── __tests__/
    └── items.test.ts  # Integration tests
```

---

## Configuration

No `.env` file is required. The following environment variables are supported:

| Variable  | Default   | Description                              |
| --------- | --------- | ---------------------------------------- |
| `PORT`    | `3000`    | Port the server listens on               |
| `TEST_DB` | _(unset)_ | Set to `:memory:` to use an in-memory DB |

The SQLite database file (`db.sqlite`) is created automatically in the project root on first run.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development mode

```bash
npm run dev
```

Server starts at `http://localhost:3000`.

### 3. Run tests

```bash
npm test
```

Tests use an isolated **in-memory** SQLite database — they do not touch `db.sqlite`.

### 4. Build for production

```bash
npm run build   # compiles TypeScript → dist/
npm start       # runs the compiled output
```

---

## API Reference

### Resource: `Item`

```json
{
  "id": 1,
  "name": "Widget",
  "description": "A small widget",
  "price": 4.99,
  "createdAt": "2026-02-25 11:00:00",
  "updatedAt": "2026-02-25 11:00:00"
}
```

---

### Endpoints

#### `POST /items` — Create a resource

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Widget", "description": "A small widget", "price": 4.99}'
```

| Field         | Type   | Required | Default |
| ------------- | ------ | -------- | ------- |
| `name`        | string | ✅ Yes   | —       |
| `description` | string | No       | `""`    |
| `price`       | number | No       | `0`     |

Response: `201 Created` with the created item.

---

#### `GET /items` — List resources with filters

```bash
curl "http://localhost:3000/items?name=widget&minPrice=1&maxPrice=100"
```

| Query param | Type   | Description                      |
| ----------- | ------ | -------------------------------- |
| `name`      | string | Partial match (case-insensitive) |
| `minPrice`  | number | Minimum price (inclusive)        |
| `maxPrice`  | number | Maximum price (inclusive)        |

Response: `200 OK` with an array of items.

---

#### `GET /items/:id` — Get a resource by ID

```bash
curl http://localhost:3000/items/1
```

Response: `200 OK` with the item, or `404` if not found.

---

#### `PUT /items/:id` — Update a resource (partial update)

```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 9.99}'
```

Only provided fields are updated. Omitted fields remain unchanged.

Response: `200 OK` with the updated item, or `404` if not found.

---

#### `DELETE /items/:id` — Delete a resource

```bash
curl -X DELETE http://localhost:3000/items/1
```

Response: `204 No Content` on success, or `404` if not found.

---

#### `GET /health` — Health check

```bash
curl http://localhost:3000/health
# { "status": "ok" }
```
