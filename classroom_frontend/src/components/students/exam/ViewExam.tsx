
import {  useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/store';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import { convertToIST } from '../../../utils/indian.std.time';
import { startExam } from '../../../api/services/student.service';
import { saveOnGoingExamDetails } from '../../../store/slices/persist.slice';
import handleError from '../../../utils/error.handler';
import { useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { APP_URL } from '../../../constants/env';

const ViewExam = () => {
    
    const dispatch = useAppDispatch()
    const { examId } = useParams();
    const [loading, setLoading] = useState(false)
    const examDetails = useAppSelector(state => state.studentClassroom.exams.find(exam => exam._id === examId));
    
    if (!examDetails) return;
    const handleStartExam = async () => {
        try {
            setLoading(true)
            const exam = await startExam(examId!);
            setLoading(false)
            dispatch(saveOnGoingExamDetails(exam));
            window.open(`${APP_URL}student/classroom/exams/attend/${examId}`)
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className=' w-full flex flex-col h-full items-center p-5 '>
            <div className='text-lg font-bold text-costume-primary-color uppercase'>{examDetails.title}</div>
            <hr className='border w-full mx-2 mt-3' />
            <div className='flex w-full md:w-3/4  h-full flex-col'>
                <div className='mt-5 w-full'>
                    <div className='flex flex-col gap-5 '>
                        <div className=' w-full  p-3 rounded-lg flex flex-col items-center shadow-lg border-2'>
                            <h1 className='text-lg font-bold text-costume-primary-color'>Timers</h1>
                            <hr className='mt-2 w-full border' />
                            <div className=' flex flex-col md:flex-row gap-2 md:gap-0 justify-around w-full mt-3 '>
                                <div className='flex md:w-1/4 gap-1 flex-col justify-center items-center '>
                                    <AvTimerIcon />
                                    <h6>{`${examDetails.duration} minutes`}</h6>
                                </div>
                                <div className='flex md:w-1/4 gap-1 flex-col justify-center items-center '>
                                    <AccessTimeIcon />
                                    <h6>{`${convertToIST(examDetails.start_time as string)} `}</h6>
                                </div>
                                <div className='flex md:w-1/4 gap-1 flex-col justify-center items-center '>
                                    <AlarmOffIcon />
                                    <h6>{`${convertToIST(examDetails.last_time_to_start as string)}`}</h6>
                                </div>
                            </div>
                        </div>
                        <div className=' w-full  p-3 rounded-lg flex flex-col items-center shadow-lg border-2'>
                            <h1 className='text-lg font-bold text-costume-primary-color'>Questions</h1>
                            <hr className='mt-2 w-full border' />
                            <div className=' flex flex-col md:flex-row gap-2 md:gap-0 justify-around w-full mt-3 '>
                                <div className='flex md:w-1/4 gap-1 flex-col justify-center items-center '>
                                    <h1>Total Questions</h1>
                                    <h6 className='font-bold'>{`${examDetails.questions.length}`}</h6>
                                </div>
                                <div className='flex md:w-1/4 gap-1 flex-col justify-center items-center '>
                                    <h1>Total marks</h1>
                                    <h6 className='font-bold'>{`${examDetails.questions.reduce((acc, curr) => acc += Number(curr.mark), 0)} `}</h6>
                                </div>
                            </div>
                        </div>
                        <div className=' w-full  p-3 rounded-lg flex flex-col items-center shadow-lg border-2'>
                            <h1 className='text-lg font-bold text-costume-primary-color'>Instructions</h1>
                            <hr className='mt-2 w-full border' />
                            <div className='w-full p-4'>
                                <li>Once you start the exam, then there is no going back until it is submitted.</li>
                                <li>Refreshing the page or switching between tabs during exam will result in failure of exam.</li>
                                <li>Exam has to be submitted within the proivided time.</li>
                                <li>{examDetails.instructions}</li>
                            </div>
                        </div>
                        {(Date.now() >= new Date(examDetails.start_time).getTime() && Date.now() <= new Date(examDetails.last_time_to_start).getTime()) &&
                            <div className='w-full flex justify-center'>
                                <button
                                    onClick={handleStartExam}
                                    className='primary-btn'>Start Exam</button>
                            </div>}
                    </div>
                </div>
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </div>
    )
}

export default ViewExam