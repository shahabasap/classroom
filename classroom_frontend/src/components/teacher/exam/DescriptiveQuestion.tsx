import { TextField } from '@mui/material'
import React, { useState } from 'react'
import { Question, QuestionTypeEnum, saveQuestion } from '../../../store/slices/persist.slice';
import { useAppDispatch } from '../../../store/store';

type DescriptiveQuestionPropsType ={
    mark:string,
    setMarkError:(value:boolean)=>void,
    clearForm:()=>void;
}

const DescriptiveQuestion:React.FC<DescriptiveQuestionPropsType> = ({mark,setMarkError,clearForm}) => {
    const dispatch = useAppDispatch()
    const [question, setQuestion] = useState('');
    const [questionError, setQuestionError] = useState(false)
    const validateQuestion = () => {
        if (!question.trim() || question.length <= 3) {
            return setQuestionError(true)
        } else { setQuestionError(false) }
        console.log(mark)
        if(!mark){
            return setMarkError(true)
        }else{setMarkError(false)}

        const payload:Question = {
            question,
            type:QuestionTypeEnum.DESCRIPTIVE,
            mark,
            options:[],
            answer:''
        }
        dispatch(saveQuestion(payload));
        clearForm();
    }
    return (
        <div className='mt-2 flex flex-col gap-4'>
            <div className='bg-white'>
                <TextField
                    onChange={(e) => setQuestion(e.target.value)}
                    id="outlined-multiline-flexible"
                    label={questionError ? 'Question is too short ' : 'Type question here'}
                    multiline
                    size='small'
                    error={questionError}
                    fullWidth
                    rows={4} />
            </div>
            <div className='w-full flex flex-col md:flex-row md:px-5 items-center justify-center mt-2'>
                <div className='w-full md:w-1/3'>
                    <button
                        onClick={validateQuestion}
                        className='success-btn w-full   mx-auto'>Save</button>
                </div>
            </div>
        </div>
    )
}

export default DescriptiveQuestion