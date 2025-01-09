import { TextField } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { saveExamAnswer } from '../../../store/slices/persist.slice'


type AnswerDesctiptivePropsType = {
    // setStudentAnswer:React.Dispatch<React.SetStateAction<string>>,
    index:number
}
const AnswerDesctiptive:React.FC<AnswerDesctiptivePropsType> = ({index}) => {

    const dispatch = useAppDispatch();
    const answer = useAppSelector(state=>state.persistedData.onGOingExam.studentAnswers[index])
    const onTyping = (value:string)=>{
        dispatch(saveExamAnswer({studentAnswer:value,questionIndex:index}))
    }   
    return (
        <div className='bg-white mt-3'>
            <TextField
                onBlur={(e)=>onTyping(e.target.value)}
                defaultValue={answer}
                id="outlined-multiline-flexible"
                label = {`Enter your answer here`}
                multiline
                fullWidth
                rows={4} />
        </div>
    )
}

export default AnswerDesctiptive