/* eslint-disable react-hooks/exhaustive-deps */
import{ useEffect, useState } from 'react'
import useRole from './useRole';
import { getMessagesForTeacher } from '../api/services/teacher.classroom.services';
import { getMessagesForStudent } from '../api/services/student.classroom.services';
import handleError from '../utils/error.handler';

import { useAppDispatch } from '../store/store';
import { saveMessagesInStudentClassroom } from '../store/slices/student.classroom.slice';
import { saveMessagesInTeacherClassroom } from '../store/slices/teacher.classroom.slice';


const useGetMessages = () => {
    const [loading, setLoading] = useState(false)
    const role = useRole();
    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true)
            try {
                if (role == 'teacher') {
                    const chats = await getMessagesForTeacher();
                    dispatch(saveMessagesInTeacherClassroom({ messages: chats }))
                } else if (role == 'student') {
                    const chats = await getMessagesForStudent();
                    dispatch(saveMessagesInStudentClassroom({ messages: chats }))
                }
            } catch (error) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchChats();
    }, []);

    return { loading }
}

export default useGetMessages