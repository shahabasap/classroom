import React from 'react'
import { Question } from '../../../store/slices/persist.slice'

type ViewDescriptivePropsType = {
    question: Question,
    count: number
}

const ViewDescriptive: React.FC<ViewDescriptivePropsType> = ({ question, count }) => {
    return (
        <div className=' border-2 rounded-md p-2 mt-2'>
            <div className='bg-white'>
                <div className='p-2 flex justify-between rounded-md'>
                    <div>
                        <span className='font-bold'>{`Question ${count + 1}  `} &nbsp;</span>
                        <span>Descriptive</span>
                    </div>
                    <div>{`Max marks: ${question.mark}`}</div>
                </div>
                <div className='p-2 font-semibold '>{question.question}</div>
            </div>
        </div>
    )
}

export default ViewDescriptive