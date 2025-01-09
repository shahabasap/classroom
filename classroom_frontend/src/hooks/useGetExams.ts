/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useRole from "./useRole";
import { useAppDispatch } from "../store/store";
import { getAllExamsForTeacher } from "../api/services/teacher.classroom.services";
import handleError from "../utils/error.handler";
import { saveAllExamsInStoreForTeacher } from "../store/slices/teacher.classroom.slice";
import { getAllExamsForStudent } from "../api/services/student.classroom.services";
import { saveAllExamsInStoreForStudent } from "../store/slices/student.classroom.slice";

const useGetExams = ()=>{
    const [loading,setLoading] = useState(false);
    const role = useRole();
   
    const dispatch = useAppDispatch()

    useEffect(()=>{
        const fetchExams= async ()=>{
            setLoading(true);
            try {
                if(role=='teacher'){
                    const exams = await getAllExamsForTeacher();
                    console.log(exams)
                    dispatch(saveAllExamsInStoreForTeacher(exams))
                }else if(role=='student'){
                    const exams = await getAllExamsForStudent()
                    dispatch(saveAllExamsInStoreForStudent(exams))
                }
            } catch (error) {
                handleError(error)
            }finally{
                setLoading(false)
            }
        }
        fetchExams()
    },[])

    return {loading};
}

export default useGetExams;