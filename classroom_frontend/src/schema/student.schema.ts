

export interface StudentSchema{
    _id?: string;
    email: string,
    name: string,
    createdAt: string,
    updateAt: string,
    blocked:boolean,
    verified:boolean,
    classrooms:  Array<{
        _id:string,
        classroom_id:string,
        class_teacher_name: string,
        subject: string,
        classroom_name: string,
        joined_at: Date,
        blocked: boolean
    }>,
    profile_image: string
}


export type StudentClassroomDocType = StudentSchema["classrooms"][number];
