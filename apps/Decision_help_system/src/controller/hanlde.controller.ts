import { ResultSuccess, success } from "app";
import Project from "../models/project";
import Teacher from "../models/teacher";
import { IAssignment } from "../interfaces/models/assignment";
import { SPECIALIZE } from "../enum/specialize";
import { IArray_Assignment } from "../interfaces/response/assignment.body";

export async function getArraySuitableClothes(): Promise<ResultSuccess> {
    const array: number[][] = [];

    const teachers = await Teacher.find({}, { _id: 0 }).lean();
    const projects = await Project.find({}, { _id: 0 }).lean();
    const assignments: IAssignment[] = [];
    const arrayT_P: number[][] = (await getArrayTeacherProject()).data;

    // tính tổng cột check số lượng đồ án mà giáo viên đã đk phân công
    function sumColumn(idx: number, a: number[][]): number {
        let sum = 0;
        a.forEach((r) => {
            if (Number.isInteger(r[idx])) {
                sum = sum + r[idx];
            }
        });
        return sum;
    }
    // đánh đấu giáo viện đk phân công đồ án
    function createRow(idx: number, size: number): number[] {
        const rowProject: number[] = [];
        for (let i = 0; i < size; i++) {
            rowProject.push(0);
        }
        rowProject[idx] = 1;
        return rowProject;
    }

    // kiểm tra giáo viên đã đk phân công đồ án nào chưa
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
        email: string,
        specialize: string,
        size: number
    ): number[] {
        let maxCompatibility = 0;
        let temp = 0;

        // lay ra cac giao vien co so do an < 3
        const teacherCheckSum: number[] = [];
        teachers.forEach((t, idx) => {
            if (sumColumn(idx, array) < 5 && t.email !== email) {
                teacherCheckSum.push(idx);
            }
        });

        // phan cong giao vien
        arrayT_P[project].forEach((a, idx) => {
            let compatibility = 0;
            if (teacherCheckSum.includes(idx)) {
                compatibility = a;
                if (compatibility >= maxCompatibility) {
                    maxCompatibility = compatibility;
                    temp = idx;
                }
                return success.ok(array);
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
                        teacher_email: projects[project].teacher_email,
                        teacher_name: projects[project].teacher_name,
                        specialize: specialize,
                        coincidence: maxCompatibility,
                    },
                ],
            };
            assignments.push(assignment);
        } else {
            decision.project.push({
                name: projects[project].name,
                teacher_email: projects[project].teacher_email,
                teacher_name: projects[project].teacher_name,
                specialize: specialize,
                coincidence: maxCompatibility,
            });
        }

        return createRow(temp, size);
    }

    projects.forEach((p, idx) => {
        const temp = assignTheProjectToTheTeacher(
            idx,
            p.teacher_email,
            p.specialize[0],
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

    const result: IArray_Assignment = {
        array: array,
        assignment: assignments,
    };
    return success.ok(result);
}

// thiết lập array project - specialize
export async function getArraySpecializeProject(): Promise<ResultSuccess> {
    const array: number[][] = [];
    const projects = await Project.find({}, { _id: 0 }).lean();
    projects.map((p) => {
        const row: number[] = [];

        SPECIALIZE.map((s) => {
            if (p.specialize.find((ps) => ps === s)) {
                row.push(1);
            } else {
                row.push(0);
            }
        });
        array.push(row);
    });

    return success.ok(array);
}

// thiết lập array teacher - specialize
export async function getArraySpecializeTeacher(): Promise<ResultSuccess> {
    const array: number[][] = [];
    const teachers = await Teacher.find({}, { _id: 0 }).lean();
    teachers.map((t) => {
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
export async function getArrayTeacherProject(): Promise<ResultSuccess> {
    const projects: number[][] = (await getArraySpecializeProject()).data;
    const teachers: number[][] = (await getArraySpecializeTeacher()).data;

    function sum(p: number[], t: number[]): number {
        let total = 0;

        p.forEach((_p, idx) => {
            total += _p * t[idx];
        });

        return total;
    }

    const array: number[][] = [];

    for (const p of projects) {
        const element: number[] = [];
        for (const t of teachers) {
            element.push(sum(p, t));
        }
        array.push(element);
    }

    return success.ok(array);
}
