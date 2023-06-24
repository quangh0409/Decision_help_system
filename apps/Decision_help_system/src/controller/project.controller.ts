import { Result, success } from "app";
import Project from "../models/project";
import { v1 } from "uuid";

export async function createProject(params: {
    name: string;
    teacher_name: string;
    teacher_email: string;
    specialize: string;
}): Promise<Result> {
    const project = new Project({
        id: v1(),
        name: params.name,
        teacher_name: params.teacher_name,
        teacher_email: params.teacher_email,
        specialize: params.specialize,
    });

    await project.save();

    return success.created(project);
}

export async function getAllProject(): Promise<Result> {
    const projects = await Project.find({}, { _id: 0 }).lean();
    return success.ok(projects);
}
