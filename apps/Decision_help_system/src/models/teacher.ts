import mongoose from "mongoose";
import { ITeacher } from "../interfaces/models";

const teacherSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            require: true,
        },
        name: {
            type: String,
            require: true,
        },
        phone: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
        },
        specialize: [
            {
                name: {
                    type: String,
                    require: true,
                },
                coincidence: {
                    type: Number,
                    require: true,
                },
            },
        ],
    },
    { versionKey: false }
);

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;
