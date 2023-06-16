import { Result, ResultSuccess, success } from "app";
import { IProject, ITeacher } from "../interfaces/models";
import Project from "../models/project";
import Teacher from "../models/teacher";
import { IAssignment } from "../interfaces/models/assignment";
import { SPECIALIZE } from "../enum/specialize";
import { isNumberObject } from "util/types";

export async function getArraySuitableClothes(): Promise<Result> {
    const array: number[][] = [];

    const teachers = await Teacher.find({}, { _id: 0 }).lean();
    const projects = await Project.find({}, { _id: 0 }).lean();
    const assignments: IAssignment[] = [];
    function sumColumn(idx: number, a: number[][]): number {
        let sum = 0;
        a.forEach((r) => {
            if (Number.isInteger(r[idx])) {
                sum = sum + r[idx];
            }
        });
        return sum;
    }

    function createRow(idx: number, size: number): number[] {
        const rowProject: number[] = [];
        for (let i = 0; i < size; i++) {
            rowProject.push(0);
        }
        rowProject[idx] = 1;
        return rowProject;
    }

    function checkAssignment(
        ass: IAssignment[],
        email: string
    ): IAssignment | undefined {
        let result: IAssignment | undefined = undefined;
        ass.forEach((a) => {
            if (a.teacher_email === email) {
                result = a;
            }
        });
        return result;
    }

    function assignTheProjectToTheTeacher(
        project: number,
        specialize: string,
        size: number
    ): number[] {
        let maxCompatibility: number = 0;
        let temp: number = 0;

        const teacherCheckSum: number[] = [];

        // lay ra cac giao vien co so do an < 3
        teachers.forEach((t, idx) => {
            if (sumColumn(idx, array) < 3) {
                teacherCheckSum.push(idx);
            }
        });

        // phan cong giao vien
        teachers.forEach((t, index) => {
            let compatibility = 0;

            if (teacherCheckSum.includes(index)) {
                t.specialize.forEach((s) => {
                    if (s.name.toUpperCase() === specialize.toUpperCase()) {
                        compatibility = s.coincidence;
                    }
                });
                // chon do phu hop cao nhat
                if (compatibility >= maxCompatibility) {
                    maxCompatibility = compatibility;
                    temp = index;
                }
            }
        });

        const decision = checkAssignment(assignments, teachers[temp].email);

        if (decision === undefined) {
            const assignment: IAssignment = {
                teacher_name: teachers[temp].name,
                teacher_phone: teachers[temp].phone,
                teacher_email: teachers[temp].email,
                project: [
                    {
                        name: projects[project].name,
                        specialize: specialize,
                        coincidence: maxCompatibility,
                    },
                ],
            };
            assignments.push(assignment);
        } else {
            decision.project.push({
                name: projects[project].name,
                specialize: specialize,
                coincidence: maxCompatibility,
            });
        }

        return createRow(temp, size);
    }

    projects.forEach((p, idx) => {
        const temp = assignTheProjectToTheTeacher(
            idx,
            p.specialize,
            teachers.length
        );
        array.push(temp);
    });

    const sum: number[] = [];
    teachers.forEach((p, idx) => {
        const a = sumColumn(idx, array);
        sum.push(a);
    });

    array.push(sum);

    return success.ok(assignments);
}

// thiết lập array project - specialize
export async function getArraySpecializeProject(): Promise<ResultSuccess> {
    const array: number[][] = [];
    const projects = await Project.find({}, { _id: 0 }).lean();

    // const column: (number | string)[] = ["null"];
    // SPECIALIZE.forEach((s) => {
    //     column.push(s);
    // });
    // array.push(column);
    projects.map((p) => {
        const row: number[] = [];

        SPECIALIZE.map((s) => {
            if (p.specialize === s) {
                row.push(1);
            } else {
                row.push(0);
            }
        });
        array.push(row);
    });

    return success.ok({ array: array });
}

// thiết lập array teacher - specialize
export async function getArraySpecializeTeacher(): Promise<ResultSuccess> {
    const array: number[][] = [];
    const teachers = await Teacher.find({}, { _id: 0 }).lean();

    // const column: (number | string)[] = ["null"];

    // SPECIALIZE.forEach((s) => {
    //     column.push(s);
    // });
    // array.push(column);
    teachers.map((t) => {
        // const row: (number | string)[] = [`${t.name}`];
        const row: number[] = [];

        SPECIALIZE.map((s) => {
            const temp = t.specialize.find((ts) => ts.name === s);
            if (temp) {
                row.push(temp.coincidence);
            } else {
                row.push(0);
            }
        });
        array.push(row);
    });

    return success.ok(array);
}

// thiet lap array teacher - project
export async function getArrayTeacherProject() {
    const projects: number[][] = (await getArraySpecializeProject()).data;
    const teachers: number[][] = (await getArraySpecializeTeacher()).data;

    function sum(p: number[], t: number[]): number {
        let total: number = 0;

        p.forEach((_p, idx) => {
            total += _p + t[idx];
        });

        return total;
    }

    const array: number[][] = [];

    for (const p of projects) {
        let element: number[] = [];
        for (const t of teachers) {
            element.push(sum(p, t));
        }
        array.push(element);
    }

    return array;
}
