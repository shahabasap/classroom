import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

import { ClassroomMaterialType, ClassroomMessage, ClassroomSchema } from "../../schema/classroom.schema";
import { PrivateChatSchema } from "../../schema/private.chats.schema";
import { WorksSchema } from "../../schema/works.schema";
import { ExamsSchema } from "../../schema/exams.schema";
import { AnnouncementsSchema } from "../../schema/announcements.schema";


export interface TeacherClassroomStateInterface {
    classroom: null | ClassroomSchema,
    privateChats: PrivateChatSchema[],
    works:WorksSchema[],
    exams:ExamsSchema[],
    announcements:AnnouncementsSchema[],
    liveClass:{
        title:string
    }
}

const initialState: TeacherClassroomStateInterface = {
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
    liveClass: {
        title: ""
    }
}

export interface ManageRequestPayload {
    index: number,
    data: Array<{
        student_id: string,
        email: string,
        name: string,
        blocked: boolean,
    }>
}

export const fetchClassroomDetailsForTeacherThunk = createAsyncThunk<ClassroomSchema, () => Promise<ClassroomSchema>, { rejectValue: string }>(
    'teacher/fetchClasssroom', async (getClassroom, thunkAPI) => {
        try {
            const response = await getClassroom();
            console.log(response)
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue('failed to fetch classroom details for teacher')
        }
    }
)

export const teacherClassroomSlice = createSlice({
    name: "teacherClassroom",
    initialState,
    reducers: {
        saveClassroom: (state, action: PayloadAction<ClassroomSchema>) => {
            state.classroom = action.payload;
        },
        removeClassroom: (state) => {
            state.classroom = null;
        },
        acceptRequests: (state, action: PayloadAction<ManageRequestPayload>) => {

            state.classroom?.joining_requests.splice(action.payload.index, 1)[0];
            if (state.classroom) {
                state.classroom.students = action.payload.data
            }
        },
        removeStudent: (state, action: PayloadAction<{ student_id: string }>) => {
            const index = state.classroom?.students.findIndex(student => student.student_id == action.payload.student_id);
            if (index !== -1) {
                state.classroom?.students.splice(index!, 1)
            }
        },
        rejectRequests: (state, action: PayloadAction<ManageRequestPayload>) => {
            state.classroom?.joining_requests.splice(action.payload.index, 1)
        },
        blockOrUnblockStudentRedux: (state, action: PayloadAction<{ student_id: string }>) => {
            const student_id = action.payload.student_id
            state.classroom?.students.forEach(student => {
                if (student.student_id == student_id) {
                    student.blocked = !(student.blocked)
                }
            })
        },
        saveMessagesInTeacherClassroom: (state, action: PayloadAction<{ messages: ClassroomMessage[] }>) => {
            if (state.classroom?.classroom_messages) {
                state.classroom.classroom_messages = action.payload.messages
            }
        },
        sendMessageFromTeacher: (state, action: PayloadAction<{ message: ClassroomMessage }>) => {
            if (state.classroom) {
                state.classroom.classroom_messages.push(action.payload.message)
            }
        },
        receiveMessageToTeacher: (state, action: PayloadAction<{ message: ClassroomMessage }>) => {
            if (state.classroom) {
                if(!state.classroom.classroom_messages){
                    state.classroom.classroom_messages = [];
                }
                state.classroom.classroom_messages.push(action.payload.message)
            }
        },
        saveAllPrivateChatsForTeacher: (state, action: PayloadAction<{ messages: PrivateChatSchema[] }>) => {
            state.privateChats = action.payload.messages;
        },
        receivePrivateChatForTeacher: (state, action: PayloadAction<{ message: PrivateChatSchema }>) => {
            state.privateChats.push(action.payload.message)
        },
        addNewMaterial: (state, action: PayloadAction<ClassroomMaterialType>) => {
            if (state.classroom) {
                if(!state.classroom.materials){
                    state.classroom.materials = [];
                }
                state.classroom.materials.push(action.payload);
            }
        },
        saveAllMaterialsForTeacher:(state,action:PayloadAction<ClassroomMaterialType[]>)=>{
            if(state.classroom){
                state.classroom.materials = action.payload
            }
        },
        createWork:(state,action:PayloadAction<WorksSchema>)=>{
            if(!state.works)  state.works = [];
            state.works.unshift(action.payload)
        },
        saveAllWorksForTeacher:(state,action:PayloadAction<WorksSchema[]>)=>{
            state.works = action.payload;
        },
        updateWorkMarkRedux:(state,action:PayloadAction<WorksSchema>)=>{
            const index = state.works.findIndex(work=>work._id == action.payload._id);
            if(index!=-1){
                state.works[index] = action.payload
            }
        },
        saveAllExamsInStoreForTeacher:(state,action:PayloadAction<ExamsSchema[]>)=>{
            state.exams = action.payload;
        },
        saveAllAnnouncementsForTeacher:(state,action:PayloadAction<AnnouncementsSchema[]>)=>{
            if(state.announcements){
                state.announcements = action.payload
            }
        },
        addAnnouncementTeacher:(state,action:PayloadAction<AnnouncementsSchema>)=>{
            if(state.announcements){
                state.announcements.unshift(action.payload)
            }
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassroomDetailsForTeacherThunk.pending, () => {

            })
            .addCase(fetchClassroomDetailsForTeacherThunk.fulfilled, (state, action) => {
                state.classroom = action.payload
            })
            .addCase(fetchClassroomDetailsForTeacherThunk.rejected, () => {
                console.error('thunk fetching of teacherClassroom failed')
            })

    }
})


export const {
    saveClassroom,
    removeClassroom,
    acceptRequests,
    rejectRequests,
    removeStudent,
    blockOrUnblockStudentRedux,
    saveMessagesInTeacherClassroom,
    sendMessageFromTeacher,
    receiveMessageToTeacher,
    saveAllPrivateChatsForTeacher,
    receivePrivateChatForTeacher,
    addNewMaterial,
    saveAllMaterialsForTeacher,
    createWork,
    saveAllWorksForTeacher,
    updateWorkMarkRedux,
    saveAllExamsInStoreForTeacher,
    saveAllAnnouncementsForTeacher,
    addAnnouncementTeacher,
    
} = teacherClassroomSlice.actions;

export default teacherClassroomSlice.reducer;

