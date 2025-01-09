
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../store/store'
import ExamSubmissionCard from './ExamSubmissionCard'


const ViewExamSubmission = () => {
    const { examId } = useParams()
    const examDetails = useAppSelector(state => state.teacherClassroom.exams.find(exam => exam._id == examId));

    return (
        <>
            {examDetails ? <div className='w-full flex flex-col h-full'>
                <div className='w-full flex text-lg text-costume-primary-color justify-center font-bold p-5'>ALL SUBMISSIONS</div>
                <hr className='border-2' />
                <div className='p-5'>
                    {examDetails.attended.map(submission=><ExamSubmissionCard examId={examDetails._id!} submission={submission} />)}
                </div>
            </div> : ''}
        </>

    )
}

export default ViewExamSubmission 