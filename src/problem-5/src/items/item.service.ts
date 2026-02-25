import { NotFoundError } from "../common/errors/AppError";
import * as repo from "./item.repository";
import { CreateItemDto, Item, ListItemsFilter, UpdateItemDto } from "./item.types";

export function createItem(dto: CreateItemDto): Item {
    return repo.createItem(dto);
}

export function listItems(filter: ListItemsFilter = {}): Item[] {
    return repo.listItems(filter);
}

export function getItemById(id: number): Item {
    const item = repo.getItemById(id);
    if (!item) throw new NotFoundError(`Item with id ${id} not found`);
    return item;
}

export function updateItem(id: number, dto: UpdateItemDto): Item {
    const item = repo.updateItem(id, dto);
    if (!item) throw new NotFoundError(`Item with id ${id} not found`);
    return item;
}

export function deleteItem(id: number): void {
    const deleted = repo.deleteItem(id);
    if (!deleted) throw new NotFoundError(`Item with id ${id} not found`);
}
