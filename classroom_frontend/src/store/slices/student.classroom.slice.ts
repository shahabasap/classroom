import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { ClassroomMaterialType, ClassroomMessage, ClassroomSchema } from "../../schema/classroom.schema";
import handleError from "../../utils/error.handler";
import { PrivateChatSchema } from "../../schema/private.chats.schema";
import { WorksSchema, WorkSubmissionType } from "../../schema/works.schema";
import { ExamsSchema } from "../../schema/exams.schema";
import { AnnouncementsSchema } from "../../schema/announcements.schema";



export interface StudentClassroomStateInterface {
    classroom: ClassroomSchema | null;
    privateChats: PrivateChatSchema[],
    works: WorksSchema[],
    exams: ExamsSchema[],
    announcements: AnnouncementsSchema[],
}


export const initialState: StudentClassroomStateInterface = {
    classroom: {
        _id: '',
        name: '',
        subject: '',
        class_teacher_name: '',
        class_teacher_id: '',
        students: [],
        classroom_messages: [],
        strength: 0,
        joining_requests: [],
        banned: false,
        classroom_id: '',
        createdAt: '',
        materials: [],
    },
    privateChats: [],
    works: [],
    exams: [],
    announcements: [],
    // onGOingExam: {
    //     questionPaper: [],
    //     studentAnswers: {
    //         questionIndex: 0,
    //         answer: ""
    //     },
    //     timeSpent: 0,
    //     startedAt:null,
    //     endedAt: null,
    //     title: "",
    //     duration: 0
    // }
}

export const fetchClassroomDetailsForStudentThunk = createAsyncThunk<ClassroomSchema, () => Promise<ClassroomSchema>, { rejectValue: string }>(
    'student/fetchClassrooms', async (getClassrooms, thunkAPI) => {
        try {
            const response = await getClassrooms();
            return response
        } catch (error) {
            handleError(error)

            window.location.href = '/student/dashboard'
            return thunkAPI.rejectWithValue('failed to fetch clasrooms')
        }
    })

export const studentClassroomSlice = createSlice({
    name: "studentClassroom",
    initialState,
    reducers: {
        saveStudentClassroom: (state, action: PayloadAction<ClassroomSchema>) => {
            state.classroom = action.payload
        },
        removeStudentClassroom: (state) => {
            state.classroom = null;
        },
        saveMessagesInStudentClassroom: (state, action: PayloadAction<{ messages: ClassroomMessage[], }>) => {
            if (state.classroom?.classroom_messages) {
                state.classroom.classroom_messages = action.payload.messages
            }
        },
        sendMessageFromStudent: (state, action: PayloadAction<{ message: ClassroomMessage }>) => {
            if (state.classroom) {
                state.classroom.classroom_messages.push(action.payload.message)
            }
        },
        receiveMessageTostudent: (state, action: PayloadAction<{ message: ClassroomMessage }>) => {

            if (state.classroom) {
                if (!state.classroom.classroom_messages) {
                    state.classroom.classroom_messages = []
                }
                state.classroom.classroom_messages.push(action.payload.message)
            }
        },
        saveAllPrivateChatsForStudent: (state, action: PayloadAction<{ messages: PrivateChatSchema[] }>) => {
            state.privateChats = action.payload.messages;
        },
        receivePrivateChatForStudent: (state, action: PayloadAction<{ message: PrivateChatSchema }>) => {
            state.privateChats.push(action.payload.message)
        },
        saveAllMaterialsForStudent: (state, action: PayloadAction<ClassroomMaterialType[]>) => {
            if (state.classroom) {
                state.classroom.materials = action.payload;
            }
        },
        saveAllWorksForStudent: (state, action: PayloadAction<WorksSchema[]>) => {
            state.works = action.payload;
        },
        saveSubmittedWork: (state, actions: PayloadAction<{ workId: string, submissions: WorkSubmissionType[] }>) => {
            if (state.works) {
                const submittedWork = state.works.find(work => work._id == actions.payload.workId);
                if (!submittedWork) return
                submittedWork.submissions = actions.payload.submissions
            }
        },
        saveAllAnnouncementsForStudent: (state, action: PayloadAction<AnnouncementsSchema[]>) => {
            if (state.announcements) {
                state.announcements = action.payload
            }
        },
        addAnnouncementStudent: (state, action: PayloadAction<AnnouncementsSchema>) => {
            if (state.announcements) {
                state.announcements.unshift(action.payload)
            }
        },
        saveAllExamsInStoreForStudent: (state, action: PayloadAction<ExamsSchema[]>) => {
            state.exams = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassroomDetailsForStudentThunk.pending, () => {

            })
            .addCase(fetchClassroomDetailsForStudentThunk.fulfilled, (state, action) => {
                state.classroom = action.payload
            })
            .addCase(fetchClassroomDetailsForStudentThunk.rejected, () => {

            })

    }
})


export const {
    saveStudentClassroom,
    removeStudentClassroom,
    saveMessagesInStudentClassroom,
    sendMessageFromStudent,
    receiveMessageTostudent,
    saveAllPrivateChatsForStudent,
    receivePrivateChatForStudent,
    saveAllMaterialsForStudent,
    saveAllWorksForStudent,
    saveSubmittedWork,
    saveAllAnnouncementsForStudent,
    addAnnouncementStudent,
    saveAllExamsInStoreForStudent,
    
} = studentClassroomSlice.actions;

export default studentClassroomSlice.reducer;
