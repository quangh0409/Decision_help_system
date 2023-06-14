import { NextFunction, Request, Response, Router } from "express";
import { TeacherReqBody } from "../../interfaces/request";
import {
    createTeacher,
    getAllTeacher,
} from "../../controller/teacher.controller";

export const router: Router = Router();

router.post("/", async (req: Request, _: Response, next: NextFunction) => {
    const body = req.body as TeacherReqBody;
    const result = await createTeacher({ ...body });
    next(result);
});

router.get("/", async (req: Request, _: Response, next: NextFunction) => {
    const result = await getAllTeacher();
    next(result);
});
