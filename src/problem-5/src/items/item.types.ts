/**
 * TypeScript types for the Items domain.
 */

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateItemDto {
    name: string;
    description?: string;
    price?: number;
}

export interface UpdateItemDto {
    name?: string;
    description?: string;
    price?: number;
}

export interface ListItemsFilter {
    name?: string;      // partial match (LIKE)
    minPrice?: number;
    maxPrice?: number;
}
