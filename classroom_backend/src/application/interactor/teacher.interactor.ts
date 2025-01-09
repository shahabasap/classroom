import { Teacher } from "../../domain/entities/teacher";
import { I_Bcrypt } from "../../interface/service_interface/I_bcrypt";
import { I_Mailer } from "../../interface/service_interface/I_mailer";
import { VerificationCodeType } from "../../interface/student_interface/I_student.verification";
import { I_TeacherInteractor, VerifyOTPInput } from "../../interface/teacher_interface/I_teacher.interactor";
import { I_TeacherRepo } from "../../interface/teacher_interface/I_teacher.repo";
import { generateSecureOTP } from "../../utils/randomGenerator";
import { otpExpiration } from "../../utils/timers";
import { LoDashStatic } from "lodash";
import { OTPexpirationTime } from "../../infrastructure/constants/appConstants";
import { I_JWT, UserJwtPayload } from "../../interface/service_interface/I_jwt";
import { CostumeError } from "../../utils/costume.error";
import { GoogleLoginInputType } from "../../schema/google.login.schema";
import { I_API } from "../../interface/service_interface/I_API.requests";
import { JwtPayload } from "jsonwebtoken";
import { API_ORIGIN } from "../../infrastructure/constants/env";
import { I_Sharp } from "../../interface/service_interface/I_sharp";
import { TeacherDocument } from "../../infrastructure/model/teacher.model";
import { I_StudentRepo } from "../../interface/student_interface/I_student.repo";
import crypto from 'crypto'
import { CLIENT_BASE_URL } from "../../infrastructure/constants/env";
import { token } from "morgan";
import { I_CloudinaryService } from "../../interface/service_interface/I_Cloudinary";



export class TeacherInteractor implements I_TeacherInteractor {

    private repository: I_TeacherRepo;
    private studentRepo: I_StudentRepo
    private jwt: I_JWT;
    private bcrypt: I_Bcrypt;
    private nodemailer: I_Mailer;
    private lodash: LoDashStatic;
    private api: I_API
    private cloudinary: I_CloudinaryService
    private sharp: I_Sharp
    constructor(
        repository: I_TeacherRepo,
        studentRepo: I_StudentRepo,
        jwt: I_JWT,
        bcrypt: I_Bcrypt,
        nodemailer: I_Mailer,
        lodash: LoDashStatic,
        api: I_API,
        cloudinary: I_CloudinaryService,
        sharp: I_Sharp
    ) {
        this.repository = repository;
        this.studentRepo = studentRepo;
        this.jwt = jwt;
        this.bcrypt = bcrypt;
        this.nodemailer = nodemailer;
        this.lodash = lodash,
            this.api = api,
            this.cloudinary = cloudinary,
            this.sharp = sharp
    }

    resendOTP(data: { userId: string; userEmail: string; }): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async register(data: any): Promise<any> {
        try {

            const existingTeacher = await this.repository.findTeacher(data.email);
            const existingStudent = await this.studentRepo.findStudent(data.email)
            if (existingTeacher || existingStudent) {
                throw new CostumeError(409, "This user already exist")
            }

            const hashedPassword = await this.bcrypt.encryptPassword(data.password);

            const newTeacher = Teacher.newTeacher(data.name,
                data.email,
                hashedPassword,
                false,
                false,
                [],
                null);

            const registerTeacher = await this.repository.registerTeacher(newTeacher);

            const teacher = this.lodash.omit(registerTeacher.toObject(), ['password', 'classrooms']);


            const otp = generateSecureOTP();

            await this.repository.createVerificationDocument({
                userId: registerTeacher._id,
                role: "teacher",
                email: registerTeacher.email,
                name: registerTeacher.name,
                type: VerificationCodeType.EmailVerification,
                createdAt: new Date(),
                expiresAt: otpExpiration(),
                otp
            });

            await this.nodemailer.sendEmail(registerTeacher.email, 'otp', otp);

            return {
                registered: true,
                message: "Registration successfull",
                id: teacher._id,
                email: teacher.email,
                name: teacher.name
            }
        } catch (error) {
            throw error
        }
    }
    async verifyOTP(data: VerifyOTPInput): Promise<any | null> {
        try {

            const verificationDocument = await this.repository.getVerificationDocument(data.userId);

            if (!verificationDocument || verificationDocument.otp != data.otp ||
                ((Date.now() - verificationDocument.createdAt.getTime()) >= OTPexpirationTime)) {

                throw new CostumeError(401, "OTP expired or do not match")
            }

            const verify = await this.repository.verifyTeacher(data.userId)

            const session = await this.repository.createSession({
                userId: data.userId,
                role: "teacher",
                device: "laptop",
                active: true,
                createdAt: Date.now()
            })

            const accessToken = this.jwt.generateToken({
                sessionId: session._id,
                userId: data.userId,
                role: 'teacher'
            }, "1h");


            const refreshToken = this.jwt.generateToken({
                sessionId: session._id,
                userId: data.userId,
                role: 'teacher'
            }, "1d");

            return {

                accessToken,
                refreshToken,
                ...verify!.toObject()
            }

        } catch (error) {
            throw error
        }

    }
    async login(data: any): Promise<any> {
        try {

            const teacher = await this.repository.findTeacher(data.email)

            if (!teacher) throw new CostumeError(401, "User doesnot exist");

            if (teacher.blocked) throw new CostumeError(403, 'You have been blocked by the admin')

            if (teacher && await this.bcrypt.comparePassword(data.password, String(teacher.password))) {

                const session = await this.repository.createSession({
                    userId: teacher._id,
                    role: 'teacher',
                    device: 'laptop',
                    createdAt: Date.now(),
                    active: true
                })

                const accessToken = this.jwt.generateToken({
                    userId: teacher._id,
                    sessionId: session._id,
                    role: 'teacher'
                }, "2m");

                const refreshToken = this.jwt.generateToken({
                    userId: teacher._id,
                    sessionId: session._id,
                    role: 'teacher'
                }, "1d");
                teacher.password = ''
                return {

                    accessToken,
                    refreshToken,
                    ...teacher.toObject()
                }
            }
            throw new CostumeError(401, "Invalid credentials");
        } catch (error) {
            throw error
        }
    }



    async logout(data: any): Promise<void> {
        try {
            await this.repository.endSession(data.userId, new Date())
            return
        } catch (error) {
            throw error
        }
    }

    async googleLogin(data: GoogleLoginInputType): Promise<object> {
        try {

            const userProfile = await this.api.getUserProfileFromGoogle(data)

            let existingTeacher = await this.repository.findTeacher(userProfile.email);
            let existingStudent = await this.studentRepo.findStudent(userProfile.email);
            if (existingStudent) throw new CostumeError(403, "You donot have permission to access this account")
            if (existingTeacher && existingTeacher.blocked) throw new CostumeError(403, "You have been blocked from this website")
            if (!existingTeacher) {

                const newTeacher = Teacher.newTeacher(
                    userProfile.name,
                    userProfile.email,
                    null,
                    false,
                    true,
                    [],
                    userProfile.picture
                );

                existingTeacher = await this.repository.registerTeacher(newTeacher);
            }
            existingTeacher.password = ''
            const session = await this.repository.createSession({
                userId: existingTeacher?._id,
                role: "teacher",
                device: "laptop",
                active: true,
                createdAt: Date.now(),
            });

            const accessToken = this.jwt.generateToken({
                userId: existingTeacher?._id,
                sessionId: session._id,
                role: 'teacher'
            }, "30m");

            const refreshToken = this.jwt.generateToken({
                userId: existingTeacher?._id,
                sessionId: session._id,
                role: 'teacher'
            }, "1d");

            return {

                accessToken,
                refreshToken,
                ...existingTeacher.toObject()
            }
        } catch (error) {
            throw error
        }
    }

    async uploadProfileImage(user: JwtPayload | null, file: Express.Multer.File): Promise<TeacherDocument | null> {
        try {

            if (!file) throw new CostumeError(404, 'Profile image is missing');

            const imageUrl=await this.cloudinary.uploadProfileImage(file.path)


            const data = await this.repository.saveProfileImage(user!.userId, imageUrl);

            return data;
        } catch (error) {

            throw error
        }
    }

    async validateTeacher(user: UserJwtPayload): Promise<TeacherDocument | null> {
        try {
            const teacher = this.repository.findTeacherById(user.userId);
            if (!teacher) throw new CostumeError(404, "Can not find your account")
            return teacher
        } catch (error) {
            throw error
        }
    }

    async forgotPassword(data: { email: string }): Promise<void> {
        try {
            const email = data.email;
            if (!email) throw new CostumeError(400, "Email should be provided");

            const teacher = await this.repository.findTeacher(email);
            
            if (!teacher) throw new CostumeError(404, "You are not a registered user");

            const resetPasswordToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setTime(expiresAt.getTime() + 30 * 60 * 1000);
           
            await this.repository.saveResetPasswordToken(String(teacher._id), resetPasswordToken, expiresAt);

            const resetPasswordLink = `${API_ORIGIN}/teacher/resetPassword/${resetPasswordToken}`;
            this.nodemailer.sendResetPasswordMail(teacher.email, resetPasswordLink);

            return
        } catch (error) {
            throw error
        }
    }

    async resetPassword(data: { resetPasswordToken: string }, body: { newPassword: string }): Promise<void> {
        try {
            const { resetPasswordToken } = data;
            if (!resetPasswordToken) throw new CostumeError(401, "You are not a autherized user");

            const teacher = await this.repository.findTeacherByToken(resetPasswordToken);
            if (!teacher || teacher.resetPasswordToken != resetPasswordToken) throw new CostumeError(401, "Invalid reset token");

            const hashedPassword = await this.bcrypt.encryptPassword(body.newPassword);

            await this.repository.updatePassword(hashedPassword, String(teacher._id));

            return
        } catch (error) {
            throw error
        }
    }
}

