import { NextFunction, Request, Response, Router } from "express";
import {
    createProject,
    getAllProject,
} from "../../controller/project.controller";
import { ProjectReqBody } from "../../interfaces/request/project.body";

export const router: Router = Router();

router.post("/", async (req: Request, _: Response, next: NextFunction) => {
    const body = req.body as ProjectReqBody;
    const result = await createProject({ ...body });
    next(result);
});

router.get("/", async (req: Request, _: Response, next: NextFunction) => {
    const result = await getAllProject();
    next(result);
});
