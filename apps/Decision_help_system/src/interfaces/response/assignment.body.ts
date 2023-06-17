export interface IAssignment {
    teacher_name: string;
    teacher_phone: string;
    teacher_email: string;
    project: IProjectAss[];
}

export interface IArray_Assignment {
    array: number[][];
    assignment: IAssignment[];
}

export interface IProjectAss {
    name: string;
    specialize: string;
    coincidence: number;
}
