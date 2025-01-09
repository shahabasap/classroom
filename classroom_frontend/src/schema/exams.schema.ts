import { QuestionPaperEnum, QuestionTypeEnum } from "../store/slices/persist.slice"


export interface ExamsSchema {
    _id?: string,
    classroom_id: string,
    title: string,
    instructions: string,
    issued_at: string,
    total_marks: number,
    total_questions: number,
    start_time: string,
    last_time_to_start: string,
    duration: number,
    question_paper_type: QuestionPaperEnum,
    attended: Array<{
        student_id: string,
        student_name: string,
        obtained_mark: number,
        answers:string[],
        correct_answers: number,
        wrong_answers: number,
        result: string,
        valuated:boolean
    }>,
    questions: Array<{
        question: string,
        type: QuestionTypeEnum,
        mark: number,
        options: string[],
        answer?: string
    }>
}

export type ExamQuestionType = ExamsSchema['questions'][number];
export type ExamAttendedType = ExamsSchema['attended'][number]