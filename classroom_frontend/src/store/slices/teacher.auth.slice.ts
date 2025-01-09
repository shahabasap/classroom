import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import { TeacherClassroomDocType, TeacherSchema } from "../../schema/teacher.schema";

export interface AuthState {
    user: TeacherSchema | null,

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
        createdAt:''
    }
}

export const teacherAuthSlice = createSlice({
    name: "teacherAuth",
    initialState,
    reducers: {

        addTeacher: (state, action: PayloadAction<TeacherSchema | null>) => {
            state.user = action.payload
        },
        removeTeacher: (state) => {
            state.user = null;
        },
        addTeacherClassrooms: (state, action: PayloadAction<TeacherClassroomDocType[]>) => {
            if (state.user) state.user.classrooms = action.payload;
        },
        newClassroom: (state, action: PayloadAction<TeacherClassroomDocType>) => {
            if (state.user) {
                state.user.classrooms = [...state.user.classrooms ?? [], action.payload]
            }
        },

    }
});

export const {
    addTeacher,
    removeTeacher,
    addTeacherClassrooms,
    newClassroom,
} = teacherAuthSlice.actions;

export default teacherAuthSlice.reducer