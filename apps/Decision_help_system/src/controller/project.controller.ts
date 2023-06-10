import { Result, success } from "app";
import Project from "../models/project";
import { v1 } from "uuid";

export async function createProject(params: {
    name: String;
    specialize: String;
}): Promise<Result> {
    const project = new Project({
        id: v1(),
        name: params.name,
        specialize: params.specialize,
    });

    await project.save();

    return success.created(project);
}

export async function getAllProject() {
    const projects = Project.find({}, { _id: 0 }).lean();

    success.ok(projects);
}
