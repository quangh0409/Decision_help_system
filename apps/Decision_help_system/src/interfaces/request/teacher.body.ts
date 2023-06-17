export interface TeacherReqBody {
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
