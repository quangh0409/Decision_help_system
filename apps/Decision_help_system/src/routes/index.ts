import { Router } from "express";
import { configs } from "../configs";

import { router as teacherRouter } from "./external/teacher.router";
import { router as projectRouter } from "./external/project.router";
import { router as assignmentRouter } from "./external/assignment.router";

export const router: Router = Router();

router.use(`${configs.api.prefix}/teachers`, teacherRouter);
router.use(`${configs.api.prefix}/projects`, projectRouter);
router.use(`${configs.api.prefix}/assignments`, assignmentRouter);
