import { Router } from "express";
import { configs } from "../configs";

import { router as teacherRouter } from "./external/teacher.router";

export const router: Router = Router();

router.use(`${configs.api.prefix}/teachers`, teacherRouter);
