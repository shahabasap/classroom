import { TextField } from '@mui/material'
import React, { useState } from 'react'
import DescriptiveAnswerCard from './DescriptiveAnswerCard'
import MCQAnswerCard from './MCQAnswerCard'
import { ExamAttendedType, ExamQuestionType } from '../../../schema/exams.schema'
import { useAppDispatch } from '../../../store/store'
import { updateMark, updateResponse } from '../../../store/slices/persist.slice'
type StudentAnswersPropsType = {
    question: ExamQuestionType,
    submission: ExamAttendedType,
    index: number
}
const StudentAnswers: React.FC<StudentAnswersPropsType> = ({ question, submission, index }) => {
    const [response, setResponse] = useState<string | null>(null);
    const [mark, setMark] = useState<string | number>(0);
    const dispatch = useAppDispatch()
    const handleTrue = () => {
        setResponse('true')
        dispatch(updateResponse({ value: true, index }))
    }

    const handleFalse = () => {
        dispatch(updateResponse({ value: false, index }))
        setResponse('false')
    }

    const handleMark = (mark: string) => {
        if ((/^\d+(\.\d+)?$/.test(mark.trim()) && parseFloat(mark.trim()) >= 0 && parseFloat(mark.trim()) <= question.mark) || mark.trim() == '') {
            setMark(mark);
            dispatch(updateMark({ mark: Number(mark), index }))
        }
    }
    return (
        <div className='w-full p-5 border bg-white rounded-md'>
            <div>
                {question.type == 'mcq' ?
                    <MCQAnswerCard question={question} index={index} answer={submission?.answers[index]} /> :
                    <DescriptiveAnswerCard question={question} index={index} answer={submission?.answers[index]} />}
            </div>
            <div className='w-full mt-4 flex gap-3 items-center md:justify-end px-5'>
                <div>
                    <TextField
                        value={mark}
                        onChange={(e) => handleMark(e.target.value)}
                        color='success'
                        size='small'
                        sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: 'black',
                                color: 'black',
                            },
                        }}
                        placeholder={`mark`} />
                </div>
                <div className='rounded-md border-2 inline-block'>
                    <button
                        onClick={handleTrue}
                        className={`${response == 'true' && 'bg-green-300'} px-2 py-1 transition-colors duration-300 rounded-l-md`}>Correct</button>
                    <button
                        onClick={handleFalse}
                        className={`${response == 'false' && 'bg-red-300'} px-2 py-1 transition-colors duration-300 rounded-r-md`}>Wrong</button>
                </div>
            </div>
        </div>
    )
}

export default StudentAnswers