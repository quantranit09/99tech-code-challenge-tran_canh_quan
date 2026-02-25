import Database from "better-sqlite3";
import path from "path";

function createDb(): Database.Database {
    const dbPath =
        process.env.TEST_DB === ":memory:"
            ? ":memory:"
            : path.resolve(__dirname, "..", "..", "db.sqlite");

    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    db.exec(`
        CREATE TABLE IF NOT EXISTS items (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            description TEXT    NOT NULL DEFAULT '',
            price       REAL    NOT NULL DEFAULT 0,
            createdAt   TEXT    NOT NULL DEFAULT (datetime('now')),
            updatedAt   TEXT    NOT NULL DEFAULT (datetime('now'))
        )
    `);

    return db;
}

export const db = createDb();
