import { NextFunction, Request, Response, Router } from "express";
import { ValidationError } from "../common/errors/AppError";
import * as service from "./item.service";

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, price } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            throw new ValidationError("Field 'name' is required and must be a non-empty string");
        }
        if (price !== undefined && typeof price !== "number") {
            throw new ValidationError("Field 'price' must be a number");
        }

        const item = service.createItem({ name: name.trim(), description, price });
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, minPrice, maxPrice } = req.query;

        const parsedMin = minPrice !== undefined ? Number(minPrice) : undefined;
        const parsedMax = maxPrice !== undefined ? Number(maxPrice) : undefined;

        if (parsedMin !== undefined && isNaN(parsedMin)) {
            throw new ValidationError("Query param 'minPrice' must be a number");
        }
        if (parsedMax !== undefined && isNaN(parsedMax)) {
            throw new ValidationError("Query param 'maxPrice' must be a number");
        }

        const items = service.listItems({
            name: typeof name === "string" ? name : undefined,
            minPrice: parsedMin,
            maxPrice: parsedMax,
        });

        res.json(items);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new ValidationError("Invalid id");

        res.json(service.getItemById(id));
    } catch (err) {
        next(err);
    }
});

router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new ValidationError("Invalid id");

        if (req.body.name !== undefined && (typeof req.body.name !== "string" || req.body.name.trim() === "")) {
            throw new ValidationError("Field 'name' must be a non-empty string");
        }
        if (req.body.price !== undefined && typeof req.body.price !== "number") {
            throw new ValidationError("Field 'price' must be a number");
        }

        res.json(service.updateItem(id, {
            name: req.body.name?.trim(),
            description: req.body.description,
            price: req.body.price,
        }));
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new ValidationError("Invalid id");

        service.deleteItem(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

export default router;
