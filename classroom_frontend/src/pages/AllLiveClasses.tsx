import { useState } from 'react'
import AppModal from '../components/AppModal'
import { TextField } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'

import useRole from '../hooks/useRole'
import { useAppDispatch, useAppSelector } from '../store/store'
import { setLiveClassTitle } from '../store/slices/persist.slice'
const AllLiveClasses = () => {

    const role = useRole()
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const [openModal, setOpenModal] = useState(false);
    const [titleError, setTitleError] = useState(false)
    const [title, setTitle] = useState('');
    const newClass = useAppSelector(state => state.persistedData.liveClass.live)

    const classroomId = useAppSelector(state => role == 'teacher' ?
        state.teacherClassroom.classroom?._id :
        state.studentClassroom.classroom?._id);

    const handleStart = async () => {
        if (!title) {
            return setTitleError(true)
        } else { setTitleError(false) }
        dispatch(setLiveClassTitle(title))
        navigate(`join?classroomId=${classroomId}`)
    }
    return (
        <div className='h-full bg-gray-50 p-3 rounded-lg flex flex-col items-center border-2  shadow-md border-gray-200 w-full'>
            <div className='w-full p-5 flex justify-center'>
                <h1 className='text-xl text-costume-primary-color font-bold'>LIVE CLASSES</h1>
            </div>
            <hr className='border-2 w-full' />
            {role == 'teacher' && <div className=' mt-3 rounded-md justify-center w-full p-5 flex'>

                <button
                    onClick={() => setOpenModal(true)}
                    className='primary-btn bg-white font-bold border text-red-600'>Go Live</button>
                <AppModal open={openModal} setOpen={setOpenModal} >
                    <div className='p-3 flex flex-col items-center gap-5  '>
                        <TextField
                            value={title}
                            error={titleError}
                            onChange={(e) => setTitle(e.target.value)}
                            label={"Title for the classroom"}
                            id="outlined-basic"
                            helperText={titleError && 'Enter a valid title'}
                            fullWidth />
                        <button
                            onClick={handleStart}
                            className='primary-btn '>START</button>
                    </div>
                </AppModal>
            </div>}
            {
                newClass &&
                <div className='border-2 bg-white mt-3 rounded-md items-center justify-between w-full p-5 px-10 flex'>
                    <div className=''>
                        <h1 className='font-bold text-lg text-red-500'>A live class is happening now</h1>
                    </div>
                    <button
                        onClick={() => navigate(`join?classroomId=${classroomId}`)}
                        className='flex  justify-center border rounded-md px-2 bg-blue-50 hover:bg-green-100  items-center'>
                        <span className=' px-2 py-1 text-red-600 text-lg  font-extrabold rounded-md '>LIVE</span>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                    </button>
                    <button 
                    onClick={() => navigate(`join?classroomId=${classroomId}`)}
                    className='primary-btn '>Attend</button>
                </div>}
            <Outlet />
        </div>
    )
}

export default AllLiveClasses