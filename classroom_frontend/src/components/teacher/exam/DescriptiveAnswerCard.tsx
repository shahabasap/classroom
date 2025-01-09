import React from 'react'
import { ExamQuestionType } from '../../../schema/exams.schema'


type DescriptiveAnswerCardPropsType={
    question: ExamQuestionType,
    index: number,
    answer: string
}
const DescriptiveAnswerCard:React.FC<DescriptiveAnswerCardPropsType> = ({question,index,answer}) => {
  return (
    <div className=' border-2 rounded-md p-2 mt-2'>
            <div className='bg-white'>
                <div className='p-2 flex justify-between rounded-md'>
                    <div>
                        <span className='font-bold'>{`Question ${index + 1}  `} &nbsp;</span>
                        <span>Descriptive</span>
                    </div>
                    <div>{`Max marks: ${question.mark}`}</div>
                </div>
                <div className='p-2 font-semibold '>{question.question}</div>
                <div className='w-full p-2'>{answer}</div>
            </div>
        </div>
  )
}

export default DescriptiveAnswerCard