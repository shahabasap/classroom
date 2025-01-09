import { ObjectId } from "mongodb";
import { Teacher } from "../../domain/entities/teacher";
import { SessionDocument } from "../../infrastructure/model/session.model";
import { TeacherClassroomDocType, TeacherDocument } from "../../infrastructure/model/teacher.model";
import { I_VerificationDocument } from "../student_interface/I_student.verification";
import { AnnouncementsDocument } from "../../infrastructure/model/announcements.model";

export interface I_TeacherRepo{
    registerTeacher(data:Teacher):Promise<TeacherDocument>;

    findTeacher(email:string):Promise<TeacherDocument|null>;

    getVerificationDocument(userId:string):Promise<I_VerificationDocument|null>;

    verifyTeacher(userId:string):Promise< TeacherDocument|null >;

    createSession(data:object):Promise<SessionDocument>;

    findSession(data:string):Promise<any|null>;

    endSession(userId:string,endTime:Date):Promise<void>;

    createVerificationDocument(data:any):Promise<any>;

    saveProfileImage(userId:string,imageName:string):Promise<TeacherDocument|null>;

    findTeacherById(user_id:string|ObjectId):Promise<TeacherDocument|null>;

    saveNewClassroomToTeaherDoc(classTeacherId:string,classroomDoc:TeacherClassroomDocType):Promise<void>;

    saveResetPasswordToken(teacherId:string,token:string,tokenExpires:Date):Promise<void>;

    findTeacherByToken(token:string):Promise<TeacherDocument|null>;

    updatePassword(newPassword:string,teacherId:string):Promise<void>;

}