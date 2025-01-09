import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import { StudentClassroomDocType, StudentSchema } from "../../schema/student.schema";

export interface AuthState {
    user: StudentSchema | null,

}

const initialState: AuthState = {
    user: {
        _id: '',
        email: '',
        name: '',
        blocked: false,
        verified: true,
        classrooms: [],
        profile_image: '',
        createdAt: '',
        updateAt: ''
    }
}

export const studentAuthSlice = createSlice({
    name: "studentAuth",
    initialState,
    reducers: {
        addStudent: (state, action: PayloadAction<StudentSchema | null>) => {
            state.user = action.payload
        },
        removeStudent: (state) => {
            state.user = null;
        },
        addStudentClassrooms: (state, action: PayloadAction<StudentClassroomDocType[]>) => {
            console.log('from slice: ', action.payload)
            if (state.user) state.user.classrooms = action.payload;
        },
        updateProfileImage: (state, action: PayloadAction<{ profile_image: string }>) => {
            if (state.user) state.user.profile_image = action.payload.profile_image
        }
    }
});

export const { addStudent, removeStudent, addStudentClassrooms, updateProfileImage } = studentAuthSlice.actions;

export default studentAuthSlice.reducer