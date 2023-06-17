import { Router, Response, Request, NextFunction } from "express";
import {
    getArraySpecializeProject,
    getArraySpecializeTeacher,
    getArraySuitableClothes,
    getArrayTeacherProject,
} from "../../controller/hanlde.controller";

export const router: Router = Router();

router.get("/", async (req: Request, _: Response, next: NextFunction) => {
    const result = await getArraySuitableClothes();
    next(result);
});

router.get(
    "/array-p-s",
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getArraySpecializeProject();
        next(result);
    }
);

router.get(
    "/array-t-s",
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getArraySpecializeTeacher();
        next(result);
    }
);

router.get(
    "/array-t-p",
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getArrayTeacherProject();
        next(result);
    }
);
