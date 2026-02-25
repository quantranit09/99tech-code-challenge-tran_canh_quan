import express from "express";
import { errorHandler } from "./common/middleware/errorHandler";
import itemRouter from "./items/item.router";

/**
 * Creates and returns the Express app (without starting the server).
 * Exported separately from server.ts so tests can import it without
 * binding to a real port.
 */
export function createApp() {
    const app = express();

    app.use(express.json());

    // Health check
    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    app.use("/items", itemRouter);

    // Global error handler — must be registered last
    app.use(errorHandler);

    return app;
}

