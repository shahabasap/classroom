import { Teacher } from "../../domain/entities/teacher";
import { I_TeacherRepo } from "../../interface/teacher_interface/I_teacher.repo";
import { TeacherClassroomDocType, TeacherDocument, TeacherModel } from "../model/teacher.model";
import { VerificationModel } from "../model/verification.model";
import { I_VerificationDocument } from "../../interface/student_interface/I_student.verification";
import { SessionDocument, SessionModel } from "../model/session.model";


export class TeacherRepo implements I_TeacherRepo{
    
    async registerTeacher(data: Teacher): Promise<TeacherDocument> {
        try {
            const newTeacher = await new TeacherModel(data).save();
            return newTeacher
        } catch (error) {
            throw error
        }
    }

    async saveNewClassroomToTeaherDoc(classTeacherId:string,classroomDoc:TeacherClassroomDocType):Promise<void>{
        try {
            await TeacherModel.updateOne(
                { _id: classTeacherId },
                { $addToSet: { classrooms: classroomDoc } }
            )
            return
        } catch (error) {
            throw error;
        }
    }
    
    async findTeacher(email: string): Promise<TeacherDocument | null> {
        try {
            return await TeacherModel.findOne({email})
        } catch (error) {
            throw error
        }
    }

    async getVerificationDocument(userId: string): Promise<I_VerificationDocument | null> {
        try {
            return await VerificationModel.findOne({userId})
        } catch (error) {
            throw error
        }
    }

    async verifyTeacher(userId:string): Promise< TeacherDocument|null > {
        try {
            
            const verify = await TeacherModel.findByIdAndUpdate(
                userId,
                {verified:true}
            ).populate('classrooms');

            await VerificationModel.deleteOne({userId});

            return verify;
            
        } catch (error) {
            throw error
        }
    }

    async createSession(data: object): Promise<SessionDocument> {
        try {
            return await new SessionModel(data).save()
        } catch (error) {
            throw error
        }
    }

    async findSession(sessionId: string): Promise<SessionDocument | null> {
        try {
            return await SessionModel.findById(sessionId);
        } catch (error) {
            throw error
        }

    }

    async endSession(userId: string,endTime:Date): Promise<void> {
        try {
            await SessionModel.findOneAndUpdate(
                {userId},
                {$set:{active:false,endedAt:endTime}}
            )
        } catch (error) {
            throw error
        }
    }

    async createVerificationDocument(data: any): Promise<any> {
        try {
            await new VerificationModel(data).save();
        } catch (error) {
            throw error
        }
    }

    async saveProfileImage(userId: string, imageName: string): Promise<TeacherDocument | null> {
        try {
            return await TeacherModel.findByIdAndUpdate(
                userId,
                { profile_image: imageName },
                { new: true }
            ).select('-password');

        } catch (error) {
            throw error
        }
    }

    async findTeacherById(user_id:string):Promise<TeacherDocument|null>{
        try {
            return await TeacherModel.findById(user_id)
        } catch (error) {
            throw error
        }
    }
    
    async saveResetPasswordToken(teacherId:string,token:string,tokenExpires:Date):Promise<void>{
        try {
            await TeacherModel.findByIdAndUpdate(
                teacherId,
                {$set:{resetPasswordToken:token,resetPasswordTokenExpires:tokenExpires}}
            )
        } catch (error) {
            throw error
        }
    }

    async findTeacherByToken(token:string):Promise<TeacherDocument|null>{
        try {
            return await TeacherModel.findOne({
                resetPasswordToken:token,
                resetPasswordTokenExpires:{$gt:new Date()}
            })
        } catch (error) {
            throw error
        }
    }

    async updatePassword(newPassword:string,teacherId:string):Promise<void>{
        try {
            await TeacherModel.findByIdAndUpdate(
                teacherId,
                {$set:{password:newPassword}}
            )
        } catch (error) {
            throw error
        }
    }


}