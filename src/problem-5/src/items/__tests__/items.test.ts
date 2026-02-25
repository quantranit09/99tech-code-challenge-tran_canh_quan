/**
 * Integration tests for the Items CRUD API.
 *
 * Uses supertest to fire real HTTP requests against the Express app.
 * Uses an in-memory SQLite DB (TEST_DB=":memory:") so test data never
 * touches db.sqlite and each test run starts from a clean state.
 */

// Must be set BEFORE importing app/db so the db module picks it up
process.env.TEST_DB = ":memory:";

import request from "supertest";
import { createApp } from "../../app";

const app = createApp();

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function createTestItem(overrides: Record<string, unknown> = {}) {
    const res = await request(app)
        .post("/items")
        .send({ name: "Test Item", price: 9.99, description: "A test item", ...overrides });
    return res.body;
}

// ─── Health ───────────────────────────────────────────────────────────────────

describe("GET /health", () => {
    test("returns 200 with status ok", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });
});

// ─── Create ───────────────────────────────────────────────────────────────────

describe("POST /items", () => {
    test("creates an item with full fields", async () => {
        const res = await request(app)
            .post("/items")
            .send({ name: "Widget", description: "A small widget", price: 4.99 });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            name: "Widget",
            description: "A small widget",
            price: 4.99,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    test("creates an item with only name (defaults applied)", async () => {
        const res = await request(app).post("/items").send({ name: "Minimal Item" });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Minimal Item");
        expect(res.body.price).toBe(0);
        expect(res.body.description).toBe("");
    });

    test("returns 400 when name is missing", async () => {
        const res = await request(app).post("/items").send({ price: 5 });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/name/i);
    });

    test("returns 400 when name is empty string", async () => {
        const res = await request(app).post("/items").send({ name: "   " });
        expect(res.status).toBe(400);
    });

    test("returns 400 when price is not a number", async () => {
        const res = await request(app).post("/items").send({ name: "Bad", price: "free" });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/price/i);
    });
});

// ─── List ─────────────────────────────────────────────────────────────────────

describe("GET /items", () => {
    test("returns all items", async () => {
        const res = await request(app).get("/items");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("filters by name (partial match)", async () => {
        await createTestItem({ name: "Apple" });
        await createTestItem({ name: "Pineapple" });
        await createTestItem({ name: "Banana" });

        const res = await request(app).get("/items?name=apple");
        expect(res.status).toBe(200);
        const names: string[] = res.body.map((i: { name: string }) => i.name);
        expect(names).toContain("Apple");
        expect(names).toContain("Pineapple");
        expect(names).not.toContain("Banana");
    });

    test("filters by minPrice", async () => {
        await createTestItem({ name: "Cheap", price: 1 });
        await createTestItem({ name: "Expensive", price: 100 });

        const res = await request(app).get("/items?minPrice=50");
        expect(res.status).toBe(200);
        res.body.forEach((item: { price: number }) => {
            expect(item.price).toBeGreaterThanOrEqual(50);
        });
    });

    test("filters by maxPrice", async () => {
        const res = await request(app).get("/items?maxPrice=10");
        expect(res.status).toBe(200);
        res.body.forEach((item: { price: number }) => {
            expect(item.price).toBeLessThanOrEqual(10);
        });
    });

    test("filters by name + minPrice combined", async () => {
        await createTestItem({ name: "Combo A", price: 20 });
        await createTestItem({ name: "Combo B", price: 5 });

        const res = await request(app).get("/items?name=Combo&minPrice=15");
        expect(res.status).toBe(200);
        const names: string[] = res.body.map((i: { name: string }) => i.name);
        expect(names).toContain("Combo A");
        expect(names).not.toContain("Combo B");
    });

    test("returns 400 for invalid minPrice", async () => {
        const res = await request(app).get("/items?minPrice=abc");
        expect(res.status).toBe(400);
    });
});

// ─── Get by ID ────────────────────────────────────────────────────────────────

describe("GET /items/:id", () => {
    test("returns the correct item", async () => {
        const created = await createTestItem({ name: "Specific" });

        const res = await request(app).get(`/items/${created.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(created.id);
        expect(res.body.name).toBe("Specific");
    });

    test("returns 404 for non-existent id", async () => {
        const res = await request(app).get("/items/999999");
        expect(res.status).toBe(404);
    });

    test("returns 400 for non-numeric id", async () => {
        const res = await request(app).get("/items/abc");
        expect(res.status).toBe(400);
    });
});

// ─── Update ───────────────────────────────────────────────────────────────────

describe("PUT /items/:id", () => {
    test("updates name only (partial update)", async () => {
        const created = await createTestItem({ name: "Old Name", price: 5 });

        const res = await request(app)
            .put(`/items/${created.id}`)
            .send({ name: "New Name" });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("New Name");
        expect(res.body.price).toBe(5); // unchanged
    });

    test("updates price only", async () => {
        const created = await createTestItem({ name: "Price Test", price: 1 });

        const res = await request(app)
            .put(`/items/${created.id}`)
            .send({ price: 99.99 });

        expect(res.status).toBe(200);
        expect(res.body.price).toBe(99.99);
        expect(res.body.name).toBe("Price Test"); // unchanged
    });

    test("updates all fields at once", async () => {
        const created = await createTestItem();

        const res = await request(app)
            .put(`/items/${created.id}`)
            .send({ name: "Full Update", description: "New desc", price: 42 });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ name: "Full Update", description: "New desc", price: 42 });
    });

    test("returns 404 for non-existent id", async () => {
        const res = await request(app).put("/items/999999").send({ name: "Ghost" });
        expect(res.status).toBe(404);
    });

    test("returns 400 when price is not a number", async () => {
        const created = await createTestItem();
        const res = await request(app)
            .put(`/items/${created.id}`)
            .send({ price: "not-a-number" });
        expect(res.status).toBe(400);
    });

    test("returns 400 when name is empty string", async () => {
        const created = await createTestItem();
        const res = await request(app)
            .put(`/items/${created.id}`)
            .send({ name: "   " });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/name/i);
    });
});

// ─── Delete ───────────────────────────────────────────────────────────────────

describe("DELETE /items/:id", () => {
    test("deletes an existing item and returns 204", async () => {
        const created = await createTestItem();

        const del = await request(app).delete(`/items/${created.id}`);
        expect(del.status).toBe(204);

        // Confirm it's gone
        const get = await request(app).get(`/items/${created.id}`);
        expect(get.status).toBe(404);
    });

    test("returns 404 for already-deleted or non-existent item", async () => {
        const res = await request(app).delete("/items/999999");
        expect(res.status).toBe(404);
    });

    test("returns 400 for non-numeric id", async () => {
        const res = await request(app).delete("/items/abc");
        expect(res.status).toBe(400);
    });
});
