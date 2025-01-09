import  { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { useNavigate } from 'react-router-dom';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import { convertToIST } from '../../../utils/indian.std.time';
import handleError from '../../../utils/error.handler';
import { createExam } from '../../../api/services/teacher.classroom.services';
import toast from 'react-hot-toast';
import { clearExamDetails } from '../../../store/slices/persist.slice';

const PreviewExam = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const examDetails = useAppSelector(state => state.persistedData.createExam);
   
    useEffect(()=>{
      if(!examDetails){
        navigate('/teacher/classroom/exams')
      }
    },[examDetails,navigate])

    if (!examDetails) {
        return
    }
    const handlePublish = async () => {
        try {
            await createExam(examDetails);
            toast.success('New exam published successfully');
           
            dispatch(clearExamDetails())
           
            navigate('/teacher/classroom/exams')
        } catch (error) {
            handleError(error)
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
                                    <h6>{`${convertToIST(examDetails.startTime as string)} `}</h6>
                                </div>
                                <div className='flex md:w-1/4 gap-1 flex-col justify-center items-center '>
                                    <AlarmOffIcon />
                                    <h6>{`${convertToIST(examDetails.lastTimeToStart as string)}`}</h6>
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
                    </div>
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <button
                onClick={handlePublish}
                className='primary-btn'>Publish</button>
        </div>
    )
}

export default PreviewExam