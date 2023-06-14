import { Router, Response, Request, NextFunction } from "express";
import { getArraySuitableClothes } from "../../controller/hanlde.controller";

export const router: Router = Router();

router.get(
    "/",
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getArraySuitableClothes();
        next(result);
    }
);
