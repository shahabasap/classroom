/* eslint-disable no-useless-catch */


import { ClassroomMaterialType, ClassroomMessage, ClassroomSchema } from "../../schema/classroom.schema";
import { PrivateChatSchema } from "../../schema/private.chats.schema";
import { StudentSchema } from "../../schema/student.schema";
import { TeacherClassroomDocType } from "../../schema/teacher.schema";
import axiosreq from "../axios.config";
import { teacherClassroomEndpoints } from "../endpoints";
import { WorksSchema } from "../../schema/works.schema";
import { ExamsSchema } from "../../schema/exams.schema";


type CreateClassroomInput ={
    name:string,
    subject:string,
    class_teacher_id:string|undefined,
    class_teacher_name:string|undefined,
    purpose:string
}

export const createClassroom = async(data:CreateClassroomInput):Promise<ClassroomSchema>=>{
    try {
        const response = await axiosreq.post(teacherClassroomEndpoints.create,data)
        return response.data;
    } catch (error) {
        throw error
    }

}

export const getTeacherClassrooms = async():Promise<TeacherClassroomDocType[]>=>{
    try {
        const response =  await axiosreq.get(teacherClassroomEndpoints.allClassrooms)
        return response.data;
    } catch (error) {
        throw error
    }
}


export const fetchClassroomDetailsForTeacher = async (classroom_id:string)=>{
    try {
        console.log('fetching data')
        const response = await axiosreq.get(teacherClassroomEndpoints.classroom(classroom_id));
        return  response.data;
    } catch (error) {
        throw error
    }
}

export const acceptJoiningRequest = async (data:object):Promise<ClassroomSchema>=>{
    try {
        const response = await axiosreq.patch(teacherClassroomEndpoints.acceptRequest,data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const rejectJoiningRequest = async (body:object)=>{
    try {
        const response = await axiosreq.patch(teacherClassroomEndpoints.rejectRequest,body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getStudentProfie = async (student_id:string):Promise<StudentSchema>=>{
    try {
        const response = await axiosreq.get(teacherClassroomEndpoints.studentProfile(student_id));
        return response.data;
    } catch (error) {
        throw error
    }
}

export const removeStudentFromClassroom = async (student_id:string):Promise<void>=>{
    try {
        await axiosreq.patch(teacherClassroomEndpoints.removeStudent(student_id))
    } catch (error) {
        throw error
    }
}

export const blockOrUnblockStudent = async(student_id:string)=>{
    try {
        await axiosreq.patch(teacherClassroomEndpoints.blockOrUnblockStudent(student_id))
    } catch (error) {
        throw error
    }
}

export const  getMessagesForTeacher = async ():Promise<ClassroomMessage[]>=>{
    try {
        const response = await axiosreq.get(teacherClassroomEndpoints.chatEndpoint);
        return response.data
    } catch (error) {
        throw error
    }
}


export const sendMessagesForTeacher = async(data:{message:string})=>{
    try {
        await axiosreq.post(teacherClassroomEndpoints.chatEndpoint,data)
    } catch (error) {
        throw error
    }
}

type SendPrivateMessageBodyType ={
    message:string,
    receiverName:string
}

export const sendPrivateMessageForTeacher = async(receiverId:string,body:SendPrivateMessageBodyType)=>{
    try {
        await axiosreq.post(teacherClassroomEndpoints.privateChat(receiverId),body)
    } catch (error) {
        throw error
    }
}

export const getPrivateMessagesForTeacher = async(receiverId:string):Promise<PrivateChatSchema[]>=>{
    try {
        const response = await axiosreq.get(teacherClassroomEndpoints.privateChat(receiverId));
        return response.data;
    } catch (error) {
        throw error
    }
}

export const uploadMaterial = async (data:FormData):Promise<ClassroomMaterialType>=>{
    try {
        const response = await axiosreq.post(teacherClassroomEndpoints.materials,data);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getMaterialsForTeacher = async ():Promise<ClassroomMaterialType[]>=>{
    try {
        const response = await axiosreq.get(teacherClassroomEndpoints.materials);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const deleteMaterial = async (materialId:string):Promise<void>=>{
    try {
        const response = await axiosreq.delete(teacherClassroomEndpoints.materials,{
            params:{materialId}
        });
        return response.data
    } catch (error) {
        throw error;
    }
}



export const publishNewWork = async (body:FormData):Promise<WorksSchema>=>{
    try {
        const response = await axiosreq.post(teacherClassroomEndpoints.works,body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllWorksForTeacher = async ():Promise<WorksSchema[]>=>{
    try {
        const response = await axiosreq.get(teacherClassroomEndpoints.works);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const updateWorkMark = async (workId:string,body:{mark:number,studentId:string}):Promise<unknown>=>{
    try {
        const response = await axiosreq.patch(teacherClassroomEndpoints.work(workId),body);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const createExam = async (body:unknown):Promise<unknown>=>{
    try {
        const response = await axiosreq.post(teacherClassroomEndpoints.exams,body);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getAllExamsForTeacher = async ():Promise<ExamsSchema[]>=>{
    try {
        const response = await axiosreq.get(teacherClassroomEndpoints.exams);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const publishExamResult = async (examId:string,body:unknown):Promise<unknown>=>{
    const response = await axiosreq.patch(teacherClassroomEndpoints.exam(examId),body);
    return response.data;
}


export const getLiveClassToken = async ():Promise<unknown>=>{
    const response = await axiosreq.get(teacherClassroomEndpoints.liveClass);
    return response.data;
}


export const startLiveClass = async (body:{title:string}):Promise<unknown>=>{
    const response = await axiosreq.post(teacherClassroomEndpoints.liveClass,body);
    return response.data;
}