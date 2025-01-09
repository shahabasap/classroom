/* eslint-disable no-useless-catch */

import axiosreq from "../axios.config";
import { studentClassroonEndpoints, studentEndpoints } from "../endpoints";
import { TokenResponse } from "@react-oauth/google";

export interface VerificationInput{
    otp: string | number;
    userId: string | null;
}

export type LoginInput={
    email: string,
    password: string
}

export type LogoutInput = {
    userId:string
}

export type RegisterUserInput = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type ResendOTPType ={
    userId: string,
    userEmail: string
}

export const registerStudent = async (user:RegisterUserInput)=>{
    try {
        const response = await axiosreq.post(studentEndpoints.register,user);
        console.log('from service',response)
        return response.data
        
    } catch (error) {
        throw error
    }
}

export const loginStudentWithGoogle = async(data:TokenResponse) =>{
    try {
        const response = await axiosreq.post(studentEndpoints.googleLogin,data);
        return response.data;
    } catch (error) {
        throw error;
    }
} 

export const verifyStudent = async(data:VerificationInput)=>{
    try {
        const response = await axiosreq.post(studentEndpoints.verify,data)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const loginStudent = async(data:LoginInput)=>{
    try {
        const response = await axiosreq.post(studentEndpoints.login,data);
        console.log('login',response)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const logoutStudent = async(data:LogoutInput)=>{
    try {
        const response = await axiosreq.post(studentEndpoints.logout,data);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const resendOTP = async (data:ResendOTPType)=>{
    try {
        const response = await axiosreq.patch(studentEndpoints.resendOTP,data);
        return response.data
    } catch (error) {
        throw error
    }
   
}

export const updateProfileImageOfStudent = async(data:FormData)=>{
    try {
        const response = await axiosreq.post(studentEndpoints.updateProfileImage,data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPasswordStudent = async(data:{email:string})=>{
    try {
        const response = await axiosreq.post(studentEndpoints.forgotPassword,data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPasswordResetStudent = async(token:string,body:{newPassword:string})=>{
    try {
        const response = await axiosreq.post(studentEndpoints.resetPassword(token),body);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const fetchAnnouncementsForStudent = async()=>{
    try {
        const response = await axiosreq.get(studentClassroonEndpoints.announcements);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const startExam = async(examId:string)=>{
    const response = await axiosreq.patch(studentClassroonEndpoints.exam(examId));
    return response.data;
}

export const submitExam = async(examId:string,data:unknown)=>{
    const response = await axiosreq.post(studentClassroonEndpoints.exam(examId),data);
    return response.data;
}