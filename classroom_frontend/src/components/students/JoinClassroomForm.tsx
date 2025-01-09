import { motion } from 'framer-motion'
import CloseIcon from '@mui/icons-material/Close';
import {  TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { findClassroomForStudent,studentRequestToJoinClassroom } from '../../api/services/student.classroom.services';
import handleError from '../../utils/error.handler';
import React from 'react';
import toast from 'react-hot-toast';

type ClassroomType ={
    classroom_id:string,
    subject:string,
    name:string,
    class_teacher_name:string
}

type JoinClassroomFormProps = {
    visible: boolean,
    onClose: ()=>void
}

const JoinClassroomForm: React.FC<JoinClassroomFormProps> = ({ visible, onClose }) => {
  
    const classroomIdRef = useRef<HTMLInputElement>(null);
    const [idError, setIdError] = useState<boolean>(false)
    const [classroom, setClassroom] = useState<null |ClassroomType>(null);

    if (!visible) return null;

    const searchClassroom = async () => {

        const classroom_id = classroomIdRef?.current?.value as string;
        console.log(classroom_id)
        if (!classroom_id) {
            setIdError(true)
            return
        }
        setIdError(false)
        try {
            const classroom = await findClassroomForStudent(classroom_id);
            setClassroom(classroom as ClassroomType)
        } catch (error) {
            handleError(error)
        }
    }

    const requestToJoin = async (classroom_id:string)=>{
        try {
            const request = await studentRequestToJoinClassroom(classroom_id);
            console.log(request);
            onClose();
            toast.success('Your request has been send. Now sit tight and wait for the response!',{
                duration:5000
            })
        } catch (error) {
            handleError(error)
        }
    }
    return (

        <div
            className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
                flex justify-center items-center  `}>
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, scale: 1 }}
                className='bg-white mx-auto  lg:w-2/3  flex flex-col items-center p-10 rounded-md'>
                <div className='flex w-full justify-end'>
                    <div onClick={onClose}
                        className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                        <CloseIcon fontSize='medium' color='error' />
                    </div>
                </div>
                <div className='text-costume-primary-color text-2xl mb-4 font-extrabold'>JOIN A CLASSROOM</div>
                <div className='w-full gap-3 flex flex-col'>
                    <div>
                        <p>Give us an ID to find it for you.</p>
                        <div className='flex gap-2 items-baseline'>
                            <TextField
                                inputRef={classroomIdRef}
                                label={idError ? "Are you gonna find a classroom or not?" : "CLRM-12356"}
                                id="outlined-basic"
                                error={idError}
                                fullWidth >

                            </TextField>
                            <button
                                onClick={searchClassroom}
                                className='primary-btn h-12'>Search</button>
                        </div>
                    </div>
                    {classroom && 
                        <motion.div
                            initial={{ opacity: 0, scale: 1, x: 100 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            exit={{ opacity: 0, scale: 1 }}
                            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{`${classroom.name} : ${classroom.subject}`}</h5>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{`ID: ${classroom.classroom_id}`}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{`Class taken by: ${classroom.class_teacher_name}`}</p>
                            <a  onClick={()=>requestToJoin(classroom.classroom_id)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Request to join
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </motion.div> }
                </div>
            </motion.div>

        </div>
    )
}

export default JoinClassroomForm