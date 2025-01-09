
import { useAppSelector } from '../../../store/store'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';
import toast from 'react-hot-toast';
import { submitExam } from '../../../api/services/student.service';
import handleError from '../../../utils/error.handler';
import { useNavigate } from 'react-router-dom';

const ReviewAnswers = () => {
    const navigate = useNavigate()
    const exam = useAppSelector(state => state.persistedData.onGOingExam);

    const attended = exam.studentAnswers.reduce((acc, curr) => acc += curr != null ? 1 : 0, 0)
    const timeSpend = () => {
        const time = Date.now() - new Date(exam.startedAt!).getTime();

        return Math.min(Math.floor(time / (1000 * 60)), exam.duration)
    }
    const onSubmit = async () => {
        const lastTimeToSubmit = new Date(exam.startedAt!).getTime() + (exam.duration * 60 * 1000)
        if (Date.now() > lastTimeToSubmit) {
            return toast.error('Oops! Submission time is over.')
        }

        try {
            const data = {
                examId: exam.examId,
                answers: exam.studentAnswers,
                startedAt: exam.startedAt,
                endedAt: new Date()
            }
            await submitExam(exam.examId, data);
            toast.success('Exam submitted successfully')
            navigate('../')
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <div className='w-full flex flex-col h-full '>
            <div className='w-full flex justify-between items-center bg-gray-100 p-5'>
                <h1 className='text-lg font-bold uppercase'>{exam.title}</h1>
                <div>
                    <p className='font-bold'>{`Answered: ${exam.studentAnswers.reduce((acc, curr) => acc += curr != null ? 1 : 0, 0)}/${exam.questionPaper.length}`}</p>
                </div>
            </div>

            <div className='w-full flex justify-center h-full items-center  p-5' >
                <div className='flex md:flex-row md:flex-wrap w-full flex-col gap-4 font-bold p-5 border-2 rounded-md items-center' >
                    <div className='border-2 md:w-2/5  p-2 flex w-full items-center gap-2 rounded-md bg-blue-50'>
                        <DoneOutlineIcon fontSize='large' className='text-green-700 ' />
                        <p>{attended} questions answered</p>
                    </div>
                    <div className='border-2 md:w-2/5 p-2 flex w-full items-center gap-2 rounded-md bg-red-50'>
                        <CloseIcon fontSize='large' className='text-red-700 ' />
                        <p>{`${exam.questionPaper.length - attended} questions skipped`}</p>
                    </div>
                    <div className='border-2 md:w-2/5 p-2 flex w-full items-center gap-2 rounded-md bg-yellow-100'>
                        <TimerIcon fontSize='large' className='text-yellow-700 ' />
                        <p>{`${timeSpend()} minutes spend`}</p>
                    </div>
                    <div className='border-2 md:w-2/5 p-2 flex w-full items-center gap-2 rounded-md bg-blue-100'>
                        <TimerIcon fontSize='large' className='text-blue-700 ' />
                        <p>{`${exam.duration - timeSpend()} minutes left`}</p>
                    </div>
                </div>
            </div>
            <div className='w-full flex mb-4 justify-center'>
                <button
                    onClick={onSubmit}
                    className='primary-btn'>Submit</button>
            </div>
        </div>
    )
}

export default ReviewAnswers