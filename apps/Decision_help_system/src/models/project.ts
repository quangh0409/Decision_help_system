import mongoose from "mongoose";
import { IProject } from "../interfaces/models";

const projectSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            require: false,
        },
        name: {
            type: String,
            require: false,
        },
        teacher_name: {
            type: String,
            require: false,
        },
        teacher_email: {
            type: String,
            require: false,
        },
        specialize: [
            {
                type: String,
                require: false,
            },
        ],
    },
    { versionKey: false }
);

const Project = mongoose.model<IProject>("Project", projectSchema);
export default Project;
