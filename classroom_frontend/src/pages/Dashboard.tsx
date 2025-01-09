
import { Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAppSelector } from '../store/store';

import NewClassroomForm from '../components/teacher/NewClassroomForm';
import { useState } from 'react';

import ClassroomCard from '../components/ClassroomCard';
import useRole from '../hooks/useRole';
import JoinClassroomForm from '../components/students/JoinClassroomForm';

import { motion } from 'framer-motion';




const Dashboard: React.FC = () => {

    const role = useRole()

    const classrooms = (useAppSelector(state =>
        role === 'teacher' ? state.teacherAuth.user?.classrooms : state.studentAuth.user?.classrooms) || [])
    const [showForm, setShowForm] = useState(false);
    const handleClose = () => setShowForm(false);

    return (
        <>
            <div className='  rounded-lg    sm:p-4 sm:my-10 sm:mx-10 border shadow-lg '>
                <div className=' px-4 flex justify-center p-3   rounded-md'>
                    <Button
                        onClick={() => setShowForm(true)}
                        className='bg-costume-primary-color p-2 px-3  text-white' variant="outlined" startIcon={<AddCircleIcon />}>
                        {role == "student" ? "JOIN" : "CREATE"} A NEW CLASSROOM
                    </Button>
                </div>
                <hr className='m-4' />
                <div className='flex flex-col gap-10 overflow-x-hidden'>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.25
                                }
                            }
                        }}
                        initial="hidden"
                        animate="show"
                        className='grid md:grid-cols-1  lg:grid-cols-4 gap-10 p-10'>
                        {classrooms.length != 0 && classrooms.map((classroom: {
                            _id?: string,
                            classroom_id: string,
                            class_teacher_name: string,
                            subject: string,
                            classroom_name: string,
                            blocked: boolean
                        }) => <ClassroomCard
                                key={classroom._id ?? ''}
                                name={classroom.classroom_name}
                                class_teacher_name={classroom.class_teacher_name}
                                subject={classroom.subject}
                                _id={classroom.classroom_id}
                                blocked={classroom.blocked}
                                role={role}
                            />)}

                    </motion.div>
                </div>
                {role == 'teacher' ?
                    <NewClassroomForm onClose={handleClose} visible={showForm} /> :
                    <JoinClassroomForm visible={showForm} onClose={handleClose} />}
            </div>

        </>
    )
}

export default Dashboard