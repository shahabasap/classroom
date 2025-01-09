import { AxiosResponse } from "axios";
import axiosreq from "../axios.config";
import { studentClassroonEndpoints } from "../endpoints";
import { PrivateChatSchema } from "../../schema/private.chats.schema";
import { ClassroomMaterialType } from "../../schema/classroom.schema";
import { WorksSchema, WorkSubmissionType } from "../../schema/works.schema";
import { ExamsSchema } from "../../schema/exams.schema";

export const getStudentClassrooms = async () => {
    const response = await axiosreq.get(studentClassroonEndpoints.allClassrooms);
    return response.data;
}


export const searchClassroomForStudent = async (classroom_id: string) => {
    const response = await axiosreq.get(studentClassroonEndpoints.classroomDetails(classroom_id));
    return response.data;
}

export const findClassroomForStudent = async (classroom_id: string): Promise<unknown> => {
    const response = await axiosreq.get(studentClassroonEndpoints.searchClassroom(classroom_id));
    return response.data
}

export const studentRequestToJoinClassroom = async (classroom_id: string): Promise<AxiosResponse> => {
    const response = await axiosreq.post(studentClassroonEndpoints.requestToJoinClassroom(classroom_id));
    return response
}


export const fetchClassroomDetailsForStudent = async (classroom_id: string) => {
    const response = await axiosreq.get(studentClassroonEndpoints.classroomDetails(classroom_id));
    return response.data;
}



export const getMessagesForStudent = async () => {
    const response = await axiosreq.get(studentClassroonEndpoints.chatEndpoint);
    return response.data
}


export const sendMessagesForStudent = async (data: { message: string }) => {
    await axiosreq.post(studentClassroonEndpoints.chatEndpoint, data)
}

type SendPrivateMessageBodyType = {
    message: string,
    receiverName: string
}

export const sendPrivateMessageForStudent = async (receiverId: string, body: SendPrivateMessageBodyType) => {
    await axiosreq.post(studentClassroonEndpoints.privateChat(receiverId), body)
}

export const getPrivateMessagesForStudent = async (receiverId: string): Promise<PrivateChatSchema[]> => {
    const response = await axiosreq.get(studentClassroonEndpoints.privateChat(receiverId));
    return response.data;
}

export const getMaterialsForStudent = async (): Promise<ClassroomMaterialType[]> => {
    const response = await axiosreq.get(studentClassroonEndpoints.materials);
    return response.data;
}

export const getAllWorksForStudent = async (): Promise<WorksSchema[]> => {
    const response = await axiosreq.get(studentClassroonEndpoints.works);
    return response.data;
}

export const submitWork = async (workId: string, data: FormData): Promise<WorkSubmissionType[]> => {
    const response = await axiosreq.post(studentClassroonEndpoints.work(workId), data);
    return response.data;
}

export const getAllExamsForStudent = async (): Promise<ExamsSchema[]> => {
    const response = await axiosreq.get(studentClassroonEndpoints.exams);
    return response.data;
}


export const getJoinLiveClassToken = async (): Promise<unknown> => {
    const response = await axiosreq.get(studentClassroonEndpoints.liveClass);
    return response.data;
}