import axiosreq from "../axios.config";
import { adminEndpoints } from "../endpoints";

const admin = {

    login: async (body: { email: string, password: string }):Promise<void> => {
        await axiosreq.post(adminEndpoints.login, body)
    },
    logout: async () => {
        await axiosreq.post(adminEndpoints.logout)

    },
    classrooms: async (rows: number, page: number) => {
        const response = await axiosreq.get(adminEndpoints.classrooms(rows, page));
        return response.data;
    },
    teachers: async (rows: number, page: number) => {
        const response = await axiosreq.get(adminEndpoints.teachers(rows, page));
        return response.data;
    },
    students: async (rows: number, page: number) => {
        const response = await axiosreq.get(adminEndpoints.students(rows, page));
        return response.data;
    },
    fetchTeacherInfo: async (teacherId: string) => {
        const response = await axiosreq.get(adminEndpoints.teacher(teacherId));
        return response.data;
    },
    blockTeacher: async (teacherId: string,body:{reason:string}) => {
        const response = await axiosreq.patch(adminEndpoints.teacher(teacherId),body);
        return response.data;
    },
    fetchStudentInfo: async (studentId: string) => {
        const response = await axiosreq.get(adminEndpoints.student(studentId));
        return response.data;
    },
    fetchClassroomInfo: async (classroomId: string) => {
        const response = await axiosreq.get(adminEndpoints.classroom(classroomId));
        return response.data;
    },
    banOrUnbanClassroom: async (classroomId: string,body:{reason:string}) => {
        const response = await axiosreq.patch(adminEndpoints.classroom(classroomId),body);
        return response.data;
    },
    blockStudent: async (studentId: string,body:{reason:string}) => {
        const response = await axiosreq.patch(adminEndpoints.student(studentId),body);
        return response.data;
    }
}

export default admin;