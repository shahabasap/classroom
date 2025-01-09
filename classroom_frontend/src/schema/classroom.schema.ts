import { StudentSchema } from "./student.schema"

export interface ClassroomSchema{
    _id:string,
    name:string,
    subject:string,
    class_teacher_name:string,
    class_teacher_id:string,
    students: Array<{
        student_id:string,
        email:string,
        name:string,
        blocked:boolean,
    }>,
    classroom_messages:Array<{
        _id:string,
        sender_id:string,
        sender_name:string,
        message:string,
        send_at:string
    }>,
    materials:Array<{
        _id:string,
        title:string,
        description:string,
        type:string,
        url:string,
        created_at:string,
    }>,
    strength:number,
    joining_requests:StudentSchema[],
    banned:boolean,
    classroom_id:string,
    createdAt:string,
}


export type ClassroomMessage = ClassroomSchema["classroom_messages"][number];
export type ClassroomMaterialType = ClassroomSchema['materials'][number]