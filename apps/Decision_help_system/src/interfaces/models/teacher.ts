export interface ITeacher {
    id: string;
    name: string;
    phone: string;
    email: string;
    specialize: [
        {
            name: string;
            coincidence: number;
        }
    ];
}
