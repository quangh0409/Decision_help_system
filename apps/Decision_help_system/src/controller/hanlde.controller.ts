import { Result, success } from "app";
import { IProject, ITeacher } from "../interfaces/models";
import Project from "../models/project";
import Teacher from "../models/teacher";
import { IAssignment } from "../interfaces/models/assignment";

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

        teachers.forEach((t, idx) => {
            if (sumColumn(idx, array) < 3) {
                teacherCheckSum.push(idx);
            }
        });

        teachers.forEach((t, index) => {
            let compatibility = 0;

            if (teacherCheckSum.includes(index)) {
                t.specialize.forEach((s) => {
                    if (s.name.toUpperCase() === specialize.toUpperCase()) {
                        compatibility = s.coincidence;
                    }
                });

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

export async function getArray(): Promise<Result> {
    const array: number[][] = [];
    const array2D: (number|string)[][] = [];
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

        teachers.forEach((t, idx) => {
            if (sumColumn(idx, array) < 3) {
                teacherCheckSum.push(idx);
            }
        });

        teachers.forEach((t, index) => {
            let compatibility = 0;

            if (teacherCheckSum.includes(index)) {
                t.specialize.forEach((s) => {
                    if (s.name.toUpperCase() === specialize.toUpperCase()) {
                        compatibility = s.coincidence;
                    }
                });

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