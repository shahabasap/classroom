/* eslint-disable no-useless-catch */
import axiosreq from "../axios.config";
import { teacherClassroomEndpoints, teacherEndpoints } from "../endpoints";
import { TokenResponse } from "@react-oauth/google";

import { 
    RegisterUserInput,
    VerificationInput,
    LoginInput, 
    LogoutInput,
    ResendOTPType } from "./student.service";


export const registerTeacher = async (user:RegisterUserInput)=>{
    try {
        const response = await axiosreq.post(teacherEndpoints.register,user);
        return response.data
    } catch (error) {
        throw error
    }
}

export const verifyTeacher = async(data:VerificationInput)=>{
    try {
        const response = await axiosreq.post(teacherEndpoints.verify,data)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const loginTeacher = async(data:LoginInput)=>{
    try {
        const response = await axiosreq.post(teacherEndpoints.login,data);
        console.log('login',response)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const loginTeacherWithGoogle = async(data:TokenResponse) =>{
    try {
        const response = await axiosreq.post(teacherEndpoints.googleLogin,data);
        return response.data;
    } catch (error) {
        throw error
    }
} 

export const logoutTeacher = async(data:LogoutInput)=>{
    try {
        const response = await axiosreq.post(teacherEndpoints.logout,data);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const teacherResendOTP = async (data:ResendOTPType)=>{
    try {
        const response = await axiosreq.patch(teacherEndpoints.resendOTP,data);
        return response.data
    } catch (error) {
        throw error
    }
   
}

export const updateProfileImageOfTeacher = async(data:FormData)=>{
    try {
        const response = await axiosreq.post(teacherEndpoints.updateProfileImage,data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const forgotPasswordTeacher = async(data:{email:string})=>{
    try {
        const response = await axiosreq.post(teacherEndpoints.forgotPassword,data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPasswordResetTeacher = async(token:string,body:{newPassword:string})=>{
    try {
        const response = await axiosreq.post(teacherEndpoints.resetPassword(token),body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchAnnouncementsForTeacher = async()=>{
    try {
        const response = await axiosreq.get(teacherClassroomEndpoints.announcements);
        return response.data;
    } catch (error) {
        throw error;
    }
}