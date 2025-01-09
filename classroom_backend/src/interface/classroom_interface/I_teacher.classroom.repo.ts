import { AnnouncementsDocument } from "../../infrastructure/model/announcements.model";
import { ClassroomDocument, ClassroomMaterialType, ClassroomMessage } from "../../infrastructure/model/classroom.model";
import { ExamsDocument } from "../../infrastructure/model/exam.model";
import { LiveClassDocument } from "../../infrastructure/model/live.class.model";
import { PrivateChatDocument } from "../../infrastructure/model/private.chat.model";
import { StudentClassroomDocType, StudentDocument } from "../../infrastructure/model/student.model";
import { TeacherClassroomDocType } from "../../infrastructure/model/teacher.model";
import { WorksDocument } from "../../infrastructure/model/works.model";



export interface I_TeacherClassroomRepo{
    createClassroom(data:any,class_teacher_id:string):Promise<any>;

    getClassroomsforteacher(data:string):Promise<ClassroomDocument[]|[]>;

    getTeacherClassroomDetail(classroom_id:string,class_teacher_id:string):Promise<ClassroomDocument|null>;

    acceptRequest(classroom_id:string,teacher_id:string,student_id:string,data:any,studentClassroomData:StudentClassroomDocType):Promise<ClassroomDocument|null>;

    rejectRequest(classroom_id: string,teacher_id:string,student_id:string):Promise<ClassroomDocument|null>;

    fetchStudentProfile(data:any):Promise<StudentDocument|null>;

    deleteStudentFromClassroom(student_id:string,classroom_id:string):Promise<void>;

    toggleStudentAccess(student_id:string,classroom_id:string,teacher_id:string):Promise<void>;

    saveClassroomMessage(classroom_id:string,message:ClassroomMessage):Promise<ClassroomMessage>;

    fetchClassroomMessages(classroom_id:string):Promise<ClassroomDocument[]|null>;

    savePrivateMessage(data:PrivateChatDocument):Promise<PrivateChatDocument>;

    fetchPrivateMessages(senderId:string,receiverId:string,classroomId:string):Promise<PrivateChatDocument[]>;

    saveClassroomMaterial(clasroomId:string,data:ClassroomMaterialType):Promise<ClassroomMaterialType|null>;
    
    fetchClassroomMaterials(classroomId:string,classTeacherId:string,):Promise<ClassroomMaterialType[]|null>;

    deleteClassroomMaterial(classroomId:string,materialId:string):Promise<void>;

    saveNewWork(newWork:WorksDocument):Promise<WorksDocument>;

    fetchAllClassroomWorks(clasroomId:string):Promise<WorksDocument[]|null>;

    editWorkMark(workId:string,studentId:string,mark:number):Promise<WorksDocument|null>;

    saveNewExam(exam:ExamsDocument):Promise<ExamsDocument>;

    fetchAllExams(classroomId:string):Promise<ExamsDocument[]>;

    saveNewAnnouncement(data:AnnouncementsDocument):Promise<AnnouncementsDocument>;

    fetchAnnouncements(classroomId:string):Promise<AnnouncementsDocument[]|null>;

    updateExamResult(examId: string,studentId:string,totalMark:number,status:string): Promise<any>;
    
    saveNewLiveClass(data:LiveClassDocument): Promise<LiveClassDocument>;
}