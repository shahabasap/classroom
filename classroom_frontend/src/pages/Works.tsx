import { useState } from 'react'
import useRole from '../hooks/useRole'
import NewWork from '../components/teacher/NewWork';
import { convertToIST } from '../utils/indian.std.time';
import useGetWorks from '../hooks/useGetWorks';
import { useAppSelector } from '../store/store';
import UploadWork from '../components/students/UploadWork';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ViewSubmissions from '../components/teacher/ViewSubmissions';


const Works = () => {
    useGetWorks();
    const role = useRole();
    const [openNewWork, setOpenNewWork] = useState(false);
    const [openSubmitWork, setOpenSubmitWork] = useState(false);
    const [openSbumissions, setOpenSubmissions] = useState(false);
    const [selectedWork, setSelectedWork] = useState('')

    const works = useAppSelector(state => role == 'teacher' ?
        state.teacherClassroom.works :
        state.studentClassroom.works)
    const studentId = useAppSelector(state => role == 'student' && state.studentAuth.user?._id)
    
    return (
        <div className='h-full rounded-lg border-2 shadow-md border-gray-200 w-full'>
            {role == 'teacher' &&
                <div>
                    <div className='w-full  flex py-5 justify-center'>
                        <button
                            onClick={() => setOpenNewWork(true)}
                            className='primary-btn py-2 font-semibold'> NEW WORK</button>
                    </div>
                    <hr className='border mx-2' />
                </div>}
            <div className='w-full  p-4  '>
                {works && works.map(work =>
                    <div
                        key={work._id}
                        className='w-full border-2 mb-4 sm:flex justify-between items-center shadow-sm p-3 px-6 rounded-lg'>
                        <div className='space-y-1 w-full sm:w-3/5 mr-2'>
                            <h2 className='text-xl font-semibold text-costume-primary-color'>{work.topic}</h2>
                            <h4 className='text-lg break-words'>{work.description}</h4>
                            <h4 className='text-lg text-red-600'>Deadline: {convertToIST(work.deadline)}</h4>
                            <h5 className='text-gray-400 text-sm'>{convertToIST(work.createdAt)}</h5>
                        </div>
                        {role == 'student' && work.submissions.some(submission => submission.student_id == studentId) &&
                            (work.submissions.some(submission => (submission.student_id == studentId && submission.valuated == true)) ?
                                <div className='text-costume-primary-color font-semibold'>
                                    {`SCORE: ${work.submissions.find(submission => submission.student_id == studentId && submission.valuated == true)?.marks}`}
                                </div> :
                                <p className='text-md text-orange-700 font-semibold'>VALUATION PENDING</p>)}
                        <div className='flex flex-col gap-3 lg:flex-row'>
                            <button
                                onClick={() => window.open(work.work_file_url, '_blank')}
                                className='primary-btn'>Open</button>
                            {role == 'teacher' &&
                                <button
                                    onClick={() => {
                                        setSelectedWork(work._id)
                                        setOpenSubmissions(true)
                                    }}
                                    className='success-btn'>
                                    View submissions
                                </button>}

                            {(role == 'student' && (new Date(work.deadline).getTime() < new Date().getTime())) &&
                                (!work.submissions.some(submission => submission.student_id == studentId) ?

                                    <div className='flex justify-center whitespace-nowrap danger-btn gap-2 items-center'>
                                        <CancelIcon />
                                        Not Submitted
                                    </div> :
                                    <div className='flex justify-center success-btn gap-2 items-center'>
                                        <CheckCircleIcon />
                                        Submitted
                                    </div>)
                            }

                            {(role == 'student' && (new Date(work.deadline).getTime() > new Date().getTime())) &&
                                ((!work.submissions.some(submission => submission.student_id == studentId)) ?
                                    <button
                                        onClick={() => {
                                            setSelectedWork(work._id)
                                            setOpenSubmitWork(true)
                                        }}
                                        className='success-btn'>Submit</button> :
                                    <div className='flex justify-center success-btn gap-2 items-center'>
                                        <CheckCircleIcon />
                                        Submitted
                                    </div>)}
                        </div>
                        {role == 'student' && openSubmitWork && selectedWork == work._id &&
                            <UploadWork deadline={work.deadline} workId={work._id} closeModal={setOpenSubmitWork} />}
                        {role == 'teacher' && openSbumissions && selectedWork == work._id &&
                            <ViewSubmissions work={work} closeSubmissions={setOpenSubmissions} />}
                    </div>
                )}
            </div>
            {role == 'teacher' && openNewWork && <NewWork closeModal={setOpenNewWork} />}
        </div>

    )
}

export default Works