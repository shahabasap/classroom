

import { useAppSelector } from '../../../store/store'

import StudentAnswers from './StudentAnswers';
import { useNavigate } from 'react-router-dom';

const AnswerPaper = () => {
    const navigate = useNavigate()
    const examId = useAppSelector(state => state.persistedData.valuatingExam.examId);
    const studentId = useAppSelector(state => state.persistedData.valuatingExam.studentId);
    
    const examDetails = useAppSelector(state => state.teacherClassroom.exams.find(exam => exam._id == examId));
    const submission = examDetails?.attended.find(submission => submission.student_id === studentId);
    const totalMark = useAppSelector(state => state.persistedData.valuatingExam.totalMark)
    const handleSubmit = () => {
        navigate('../valuation_summary')
    }
    return (
        <div className='h-screen overflow-auto w-full flex flex-col'>
            <div className='p-5 flex w-full items-center bg-green-200 justify-between'>
                <div className='font-bold text-lg uppercase'>{examDetails?.title}</div>
                <div className='font-bold'>
                    <h1>{submission?.student_name}</h1>
                    <p>Score:{totalMark}</p>
                </div>
            </div>
            <div className='flex flex-col gap-3 p-2'>
                {examDetails &&
                    examDetails.questions.map((quesiton, index) =>
                        <StudentAnswers question={quesiton} submission={submission!} index={index} />
                    )}
            </div>
            <div className='w-full flex justify-center my-3'>
                <button
                    onClick={handleSubmit}
                    className='primary-btn'>Submit</button>
            </div>
        </div>
    )
}

export default AnswerPaper