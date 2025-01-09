/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";
import useRole from "./useRole";
import { getAllWorksForTeacher } from "../api/services/teacher.classroom.services";
import { saveAllWorksForTeacher } from "../store/slices/teacher.classroom.slice";
import { getAllWorksForStudent } from "../api/services/student.classroom.services";
import { saveAllWorksForStudent } from "../store/slices/student.classroom.slice";
import handleError from "../utils/error.handler";


const useGetWorks = () => {
    const [loading, setLoading] = useState(false)
    const role = useRole();
    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchWorks = async () => {
            setLoading(true);
            try {
                if(role == 'teacher'){
                    const works = await getAllWorksForTeacher();
                    dispatch(saveAllWorksForTeacher(works))
                }else if (role == 'student'){
                    const works = await getAllWorksForStudent();
                    dispatch(saveAllWorksForStudent(works))
                }
            } catch (error) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchWorks();
    },[])

    return {loading}
}

export default useGetWorks;