export interface IAssignment {
    teacher_name: string;
    teacher_phone: string;
    teacher_email: string;
    project: [
        {
            name: string;
            teacher_name: string;
            teacher_email: string;
            specialize: string;
            coincidence: number;
        }
    ];
}
