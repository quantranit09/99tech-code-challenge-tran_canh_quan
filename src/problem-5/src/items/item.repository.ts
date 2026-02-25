import { db } from "../config/db";
import { CreateItemDto, Item, ListItemsFilter, UpdateItemDto } from "./item.types";

export function createItem(dto: CreateItemDto): Item {
    const result = db.prepare(`
        INSERT INTO items (name, description, price)
        VALUES (@name, @description, @price)
    `).run({
        name: dto.name,
        description: dto.description ?? "",
        price: dto.price ?? 0,
    });

    return getItemById(result.lastInsertRowid as number)!;
}

export function listItems(filter: ListItemsFilter = {}): Item[] {
    const conditions: string[] = [];
    const params: Record<string, unknown> = {};

    if (filter.name !== undefined) {
        conditions.push("name LIKE @name");
        params.name = `%${filter.name}%`;
    }
    if (filter.minPrice !== undefined) {
        conditions.push("price >= @minPrice");
        params.minPrice = filter.minPrice;
    }
    if (filter.maxPrice !== undefined) {
        conditions.push("price <= @maxPrice");
        params.maxPrice = filter.maxPrice;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return db.prepare(`SELECT * FROM items ${where} ORDER BY id ASC`).all(params) as Item[];
}

export function getItemById(id: number): Item | undefined {
    return db.prepare("SELECT * FROM items WHERE id = ?").get(id) as Item | undefined;
}

export function updateItem(id: number, dto: UpdateItemDto): Item | undefined {
    const existing = getItemById(id);
    if (!existing) return undefined;

    const merged = {
        name: dto.name ?? existing.name,
        description: dto.description ?? existing.description,
        price: dto.price ?? existing.price,
    };

    db.prepare(`
        UPDATE items
        SET name = @name, description = @description, price = @price, updatedAt = datetime('now')
        WHERE id = @id
    `).run({ ...merged, id });

    return getItemById(id);
}

export function deleteItem(id: number): boolean {
    return db.prepare("DELETE FROM items WHERE id = ?").run(id).changes > 0;
}
