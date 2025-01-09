/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { authenticateUser } from "../api/services/general.services";
import { useAppDispatch, useAppSelector } from "../store/store";
import { addStudent } from "../store/slices/student.auth.slice";
import { addTeacher } from "../store/slices/teacher.auth.slice";



export const useAuth = (role: string) => {

    const dispatch = useAppDispatch();
    const user =
        useAppSelector(state => role == 'student' ?
            state.studentAuth.user?._id :
            state.teacherAuth.user?._id);

    const [loading, setLoading] = useState(true);
    const [activeUser, setActiveUser] = useState<string | null>(null)
    const [error, setError] = useState(false)
    useEffect(() => {

        const validateUser = () => {
            setLoading(true)
            authenticateUser(role)
                .then(response => {
                    role == 'student' ?
                        dispatch(addStudent(response)) :
                        dispatch(addTeacher(response));

                    setActiveUser(response)
                })
                .catch(() => {
                    console.log('user not authenticated')
                    setError(true)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        if (!user) {
            validateUser();
        } else {
            setLoading(false)
            setActiveUser(user)
        }
    }, [user])

    return { loading, activeUser, error };
}