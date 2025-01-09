import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ExamQuestionType, ExamsSchema } from "../../schema/exams.schema"


type StudentPersistDatasType = {
    classroom_id: string | null
}

export enum QuestionPaperEnum {
    ADD = 'addQuestion',
    UPLOAD = 'uploadQuestion',
    BANK = 'chooseQuestion'
}

export enum QuestionTypeEnum {
    MCQ = 'mcq',
    TOF = 'trueOrFalse',
    DESCRIPTIVE = 'descriptive',
    FILL_BLANKS = 'fillBlanks',
}

export type Question = {
    question: string,
    type: QuestionTypeEnum,
    mark: string,
    options: string[],
    answer?: string
}

export type CreateExamBasicDetailsType = {
    title: string,
    instructions: string,
    duration: number,
    startTime: Date | string,
    lastTimeToStart: Date | string,
    questionPaperType?: QuestionPaperEnum,
    questions: Question[]
}


type TeacherPersistDatasType = {
    classroom_id: string | null,
}

export interface PersistedDatasInterface {
    studentDatas: StudentPersistDatasType | null,
    teacherDatas: TeacherPersistDatasType | null,
    createExam: CreateExamBasicDetailsType | null,
    onGOingExam: {
        examId: string,
        title: string,
        duration: number,
        questionPaper: ExamQuestionType[],
        studentAnswers: string[],
        timeSpent: number,
        startedAt: string | null,
        endedAt: string | null,
        totalMarks: number,
        lastTimeToStart: string
    },
    valuatingExam: {
        studentId: string,
        examId: string,
        totalMark: number,
        marks?: number[],
        response?: boolean[],
        status?: string
    },
    liveClass:{
        title:string,
        live:boolean
    }
}


const initialState: PersistedDatasInterface = {
    studentDatas: {
        classroom_id: null
    },
    teacherDatas: {
        classroom_id: null,
    },
    createExam: null,
    onGOingExam: {
        examId: '',
        questionPaper: [],
        studentAnswers: [],
        timeSpent: 0,
        startedAt: null,
        endedAt: null,
        title: "",
        duration: 0,
        totalMarks: 0,
        lastTimeToStart: ""
    },
    valuatingExam: {
        studentId: "",
        examId: "",
        totalMark: 0,
        marks: [],
        response: [],
        status: 'fail'
    },
    liveClass: {
        title: "",
        live: false
    }
}

export const PersistedDatasSlice = createSlice({
    name: "persistedDatas",
    initialState,
    reducers: {
        saveStudentEquipedClassroom: (state, action: PayloadAction<{ classroom_id: string }>) => {
            state.studentDatas = action.payload;
        },
        deleteStudentEquipedClassroom: (state) => {
            if (state.studentDatas) {
                state.studentDatas.classroom_id = null;
            }
        },
        deleteAllPersistedDatasOfStudent: (state) => {
            state.studentDatas = null
        },
        saveTeacherEquipedClassroom: (state, action: PayloadAction<{ classroom_id: string }>) => {
            if (state.teacherDatas) {
                state.teacherDatas.classroom_id = action.payload.classroom_id;
            }

        },
        deleteTeacherEquipedClassroom: (state) => {
            if (state.teacherDatas) {
                state.teacherDatas.classroom_id = null;
            }
        },
        deleteAllPersistedDatasOfTeacher: (state) => {
            state.teacherDatas = null
        },
        createExamState:(state)=>{
            state.createExam = {
                title: '',
                instructions: '',
                duration: 0,
                startTime: '',
                lastTimeToStart: '',
                questions: []
            }
        },
        saveCreateExamBasicDetails: (state, action: PayloadAction<CreateExamBasicDetailsType>) => {
            if(state.createExam){
                state.createExam.title = action.payload.title;
                state.createExam.instructions = action.payload.instructions;
                state.createExam.startTime =  action.payload.startTime;
                state.createExam.lastTimeToStart = action.payload.lastTimeToStart;
                state.createExam.duration = action.payload.duration
            }
        },
        saveQuestionPaperType: (state, action: PayloadAction<QuestionPaperEnum>) => {
            if (state.createExam) {
                state.createExam.questionPaperType = action.payload
            }
        },
        saveQuestion: (state, action: PayloadAction<Question>) => {
            
            if (state.createExam) {
                state.createExam.questions.push(action.payload)
            }
        },
        clearExamDetails: (state) => {
            console.log('clearing data');
            state.createExam = null;
        },
        saveOnGoingExamDetails: (state, action: PayloadAction<ExamsSchema>) => {
            if (state.onGOingExam) {
                state.onGOingExam.title = action.payload.title;
                state.onGOingExam.duration = action.payload.duration;
                state.onGOingExam.questionPaper = action.payload.questions;
                state.onGOingExam.startedAt = new Date().toISOString();
                state.onGOingExam.lastTimeToStart = action.payload.last_time_to_start
                state.onGOingExam.studentAnswers = [];
                state.onGOingExam.examId = action.payload._id!
                state.onGOingExam.totalMarks = action.payload.total_marks
            }
        },
        saveExamAnswer: (state, action: PayloadAction<{ studentAnswer: string, questionIndex: number }>) => {
            if (state.onGOingExam) {
                console.log(action.payload)
                if (action.payload.studentAnswer == '' && state.onGOingExam.studentAnswers[action.payload.questionIndex] != '') return;
                state.onGOingExam.studentAnswers[action.payload.questionIndex] = action.payload.studentAnswer;
            }
        },
        saveValuatingExam: (state, action: PayloadAction<{ studentId: string, examId: string, totalMark: number }>) => {
            state.valuatingExam = action.payload
        },
        updateTotalMark: (state, action: PayloadAction<{ totalMark: number }>) => {
            state.valuatingExam.totalMark += action.payload.totalMark
        },
        updateMark: (state, action: PayloadAction<{ mark: number, index: number }>) => {
            if (!state.valuatingExam.marks) {
                state.valuatingExam.marks = []
            }
            state.valuatingExam.marks[action.payload.index] = action.payload.mark;
            state.valuatingExam.totalMark = state.valuatingExam.marks.reduce((acc, curr) => {
                const num = Number(curr);
                return acc + (isNaN(num) ? 0 : num)
            }, 0)

            console.log(state.valuatingExam.marks)
            console.log(state.valuatingExam.totalMark)
        },
        updateResponse: (state, action: PayloadAction<{ value: boolean, index: number }>) => {
            if (!state.valuatingExam.response) {
                state.valuatingExam.response = [];
            }
            state.valuatingExam.response[action.payload.index] = action.payload.value;

        },
        setPassStatus: (state, action: PayloadAction<{ status: string }>) => {
            state.valuatingExam.status = action.payload.status
        },
        setLiveClassTitle:(state,action:PayloadAction<string>)=>{
            state.liveClass.title = action.payload
        },
        setLiveClassStatus:(state,action:PayloadAction<boolean>)=>{
            state.liveClass.live = action.payload;
        }
    }
})

export default PersistedDatasSlice.reducer;

export const {
    saveStudentEquipedClassroom,
    deleteStudentEquipedClassroom,
    deleteAllPersistedDatasOfStudent,
    saveTeacherEquipedClassroom,
    deleteTeacherEquipedClassroom,
    deleteAllPersistedDatasOfTeacher,
    saveCreateExamBasicDetails,
    saveQuestionPaperType,
    saveQuestion,
    clearExamDetails,
    saveOnGoingExamDetails,
    saveExamAnswer,
    saveValuatingExam,
    updateMark,
    updateResponse,
    setPassStatus,
    setLiveClassTitle,
    setLiveClassStatus,
    createExamState
} = PersistedDatasSlice.actions