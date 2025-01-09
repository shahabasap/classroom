


export interface TeacherSchema{
    _id:string,
    email:string,
    name:string,
    blocked:boolean,
    verified:boolean,
    classrooms:Array<{
        _id?:string,
        classroom_id:string ,
        class_teacher_name: string,
        subject: string,
        classroom_name: string,
        joined_at: string,
        blocked: boolean
    }>,
    profile_image:string | null,
    createdAt:string
}

export type TeacherClassroomDocType = TeacherSchema["classrooms"][number];