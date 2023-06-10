import mongoose from "mongoose";
import { IProject } from "../interfaces/models";

const projectSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        specialize: String,
    },
    { versionKey: false }
);

const Project = mongoose.model<IProject>("Project", projectSchema);
export default Project;