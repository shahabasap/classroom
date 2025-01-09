import React from 'react'
import { ExamAttendedType } from '../../../schema/exams.schema'
import { useNavigate } from 'react-router-dom'
import { saveValuatingExam } from '../../../store/slices/persist.slice'
import { useAppDispatch } from '../../../store/store'

import useRole from '../../../hooks/useRole'


type ExamSubmissionCardType = {
    examId: string,
    submission: ExamAttendedType
}
const ExamSubmissionCard: React.FC<ExamSubmissionCardType> = ({ examId, submission }) => {
    const role = useRole()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleEvaluation = () => {
        dispatch(saveValuatingExam({ examId, studentId: submission.student_id, totalMark: 0 }));
        navigate('../answer_paper')
    }
    return (
        <div className='bg-white p-3 px-5 flex justify-between items-center rounded-md border  w-full'>
            <h1>{submission.student_name}</h1>
            <div>
                {submission.valuated ?
                    <div className='flex gap-5'>
                        <h1 className='font-bold'>Score: {submission.obtained_mark}</h1>
                        {submission.result == 'pass' ? <span className='font-bold text-green-600'>Pass</span> :
                            <span className='text-red-600 font-bold'>Fail</span>}
                    </div> :
                    <h1 className='text-orange-500'>Valuation Pending</h1>}
            </div>
            <div>
               { role == 'teacher' &&  
                <button
                    onClick={handleEvaluation}
                    className='primary-btn '>Evaluate</button>}
            </div>
        </div>
    )
}

export default ExamSubmissionCard