import  {useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/store';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import PinIcon from '@mui/icons-material/Pin';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { setPassStatus } from '../../../store/slices/persist.slice';
import { publishExamResult } from '../../../api/services/teacher.classroom.services';
import handleError from '../../../utils/error.handler';
import { useNavigate } from 'react-router-dom';

const ValuationSummary = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [statusError, setStatusError] = useState(false)
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const examId = useAppSelector(state => state.persistedData.valuatingExam.examId);
    const studentId = useAppSelector(state => state.persistedData.valuatingExam.studentId);

    const examDetails = useAppSelector(state => state.teacherClassroom.exams.find(exam => exam._id == examId));
    const submission = examDetails?.attended.find(submission => submission.student_id === studentId);

    const result = useAppSelector(state => state.persistedData.valuatingExam)
    
    const handlePass = () => {
        setStatus('pass')
        dispatch(setPassStatus({ status: "pass" }))
    }

    const handleFail = () => {
        setStatus('fail');
        dispatch(setPassStatus({ status: 'fail' }))
    }

    const handlePublish = async () => {
        if (!status) {
            return setStatusError(true)
        } else { setStatusError(false) }
        try {
            await publishExamResult(result.examId,result);
            navigate('../')
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <div className='w-full flex flex-col h-full'>
            <div className='w-full flex justify-between p-5'>
                <div className='text-lg font-bold uppercase' >{examDetails?.title}</div>
                <div className='font-bold uppercase'>{submission?.student_name}</div>
            </div>
            <hr className='w-full border-2' />
            <div className='w-full flex justify-center h-full items-center  p-5'>
                <div className='flex md:flex-row md:flex-wrap justify-center w-full flex-col gap-4 font-bold p-5 border-2 rounded-md items-center' >
                    <div className='border-2 md:w-2/5  p-2 flex w-full items-center gap-2 rounded-md bg-blue-50'>
                        <DoneOutlineIcon fontSize='large' className='text-green-700 ' />
                        <p>{` ${result.response?.reduce((acc, cur) => acc += Number(cur), 0)} correct answers`}</p>
                    </div>
                    <div className='border-2 md:w-2/5 p-2 flex w-full items-center gap-2 rounded-md bg-red-50'>
                        <CloseIcon fontSize='large' className='text-red-700 ' />
                        <p>{`${result.response?.reduce((acc, curr) => acc += curr == false ? 1 : 0, 0)} wrong answers`}</p>
                    </div>
                    <div className='border-2 md:w-2/5 p-2 flex w-full items-center gap-2 rounded-md bg-yellow-100'>
                        <PinIcon fontSize='large' className='text-yellow-700 ' />
                        <p>{`SCORE: ${result.totalMark} out of ${examDetails?.total_marks}`}</p>
                    </div>
                    <div className={`border-2 md:w-2/5 ${statusError && 'border-red-600'} p-2 flex w-full items-center gap-2 rounded-md ${status == 'pass' ? ' bg-green-400' : status == 'fail' ? 'bg-red-500' : 'bg-white'}`}>
                        <MilitaryTechIcon fontSize='large' className='text-black ' />
                        <div className='flex border-2 border-black'>
                            <button
                                onClick={handlePass}
                                className={`${status == 'pass' && 'bg-green-300'} border px-2 py-1 transition-colors duration-300 rounded-l-md`}>Pass</button>
                            <button
                                onClick={handleFail}
                                className={`${status == 'fail' && 'bg-red-300'} border px-2 py-1 transition-colors duration-300 rounded-r-md`}>Fail</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full justify-center flex my-3'>
                <button
                    onClick={handlePublish}
                    className='success-btn'>Publish</button>
            </div>
        </div>
    )
}

export default ValuationSummary