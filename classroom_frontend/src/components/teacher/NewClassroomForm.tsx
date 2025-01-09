
import { FormControl, Button, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useRef, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close';
import { createClassroom } from '../../api/services/teacher.classroom.services';
import { useAppDispatch, useAppSelector } from '../../store/store';
import handleError from '../../utils/error.handler';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'

import { useNavigate } from 'react-router-dom';
import { newClassroom } from '../../store/slices/teacher.auth.slice';
import useRole from '../../hooks/useRole';


type NewClassroomFormProps = {
    visible: boolean,
    onClose: ()=>void
}
const NewClassroomForm: React.FC<NewClassroomFormProps> = ({ visible, onClose }) => {


    const role = useRole()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.teacherAuth.user);
    const navigate = useNavigate()
    const [classError, setClassError] = useState<boolean>(false);
    const [subjectError, setSubjectError] = useState<boolean>(false);
    const [purposeError, setPurposeError] = useState<boolean>(false)

    const classRef = useRef<HTMLInputElement>(null);
    const subjectRef = useRef<HTMLInputElement>(null)
    const [purpose, setPurpose] = useState('');

    if (!visible) return null;

    const handleChange = (event: SelectChangeEvent) => {
        setPurpose(event.target.value as string);
    };

    const handleSubmit = async () => {
        const className = classRef?.current?.value;
        const subject = subjectRef?.current?.value;

        if (!className) {
            return setClassError(true)
        } else {
            setClassError(false)
        }
        if (!subject) {
            return setSubjectError(true)
        } else {
            setSubjectError(false)
        }
        if (!purpose) {
            return setPurposeError(true)
        } else {
            setPurposeError(false)
        }

        const classroomData = {
            name: className,
            subject,
            purpose,
            class_teacher_id: user?._id,
            class_teacher_name: user?.name
        }
        try {
            const response = await createClassroom(classroomData);

            const teacherClassroom = {
                classroom_id: response._id,
                class_teacher_name: response.class_teacher_name,
                subject: response.subject,
                classroom_name: response.name,
                joined_at: response.createdAt,
                blocked: response.banned
            }
            dispatch(newClassroom(teacherClassroom))
            onClose();
            toast.success("Your Classroom's up!. Lets go and teach some manners")
            navigate(`/${role}/dashboard`)
        } catch (error) {
            console.log(error)
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
                className='bg-white mx-auto  lg:w-1/3  flex flex-col items-center p-10 rounded-md'>
                <div className='flex w-full justify-end'>
                    <div onClick={onClose} className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                        <CloseIcon fontSize='medium' color='error' />
                    </div>
                </div>
                <div className='text-costume-primary-color text-2xl mb-4 font-extrabold'>CREATE CLASSROOM</div>
                <div className='w-full gap-3 flex flex-col'>
                    <div>
                        <p>Give a name for your classroom.</p>
                        <TextField
                            error={classError}
                            inputRef={classRef}
                            label={classError ? "Is there a classroom without name?" : "Name"}
                            id="outlined-basic"
                            fullWidth
                        />
                    </div>

                    <div>
                        <p>What subject are you teaching?</p>
                        <TextField
                            error={subjectError}
                            inputRef={subjectRef}
                            label={subjectError ? "The purpose of the class is to teach a subject" : "Subject"}
                            id="outlined-basic"
                            fullWidth
                        />
                    </div>
                    <div>
                        <p>What is the purpose of your classroom?</p>
                        <FormControl fullWidth error={purposeError}>
                            <InputLabel id="demo-simple-select-label">classroom for</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"

                                value={purpose}
                                label={purposeError ? "Help us with your purpose for a better user experience." : "select a purpose"}
                                onChange={handleChange}
                            >
                                <MenuItem value={'Tuition / coaching centre'}>Tuition / coaching centre</MenuItem>
                                <MenuItem value={'Freelance teaching'}>Freelance teaching</MenuItem>
                                <MenuItem value={'School / college'}>School / college</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        variant="contained">CREATE</Button>
                </div>
            </motion.div>
        </div>

    )
}

export default NewClassroomForm