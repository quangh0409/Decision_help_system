import { Result, success } from "app";
import Teacher from "../models/teacher";
import { v1 } from "uuid";

export async function createTeacher(params: {
    name: string;
    phone: string;
    email: string;
    specialize: [
        {
            name: string;
            coincidence: number;
        }
    ];
}): Promise<Result> {
    console.log(params);
    const teacher = new Teacher({
        id: v1(),
        name: params.name,
        phone: params.phone,
        email: params.email,
        specialize: params.specialize,
    });

    await teacher.save();

    return success.ok(teacher);
}

export async function getAllTeacher(): Promise<Result> {
    const teachers = await Teacher.find({}, { _id: 0 }).lean();
    return success.ok(teachers);
}
