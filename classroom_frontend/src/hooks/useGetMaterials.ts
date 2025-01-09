/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import useRole from "./useRole";
import { useAppDispatch } from "../store/store";
import handleError from "../utils/error.handler";
import { getMaterialsForTeacher } from "../api/services/teacher.classroom.services";
import { getMaterialsForStudent } from "../api/services/student.classroom.services";
import { saveAllMaterialsForTeacher } from "../store/slices/teacher.classroom.slice";
import { saveAllMaterialsForStudent } from "../store/slices/student.classroom.slice";

const useGetMaterials = ()=>{
    const [loading,setLoading] = useState(false);
    const role = useRole();
    const dispatch = useAppDispatch();

    useEffect(()=>{
        const fetchDatas = async ()=>{
            try {
                if(role=='teacher'){
                    setLoading(true)
                    const materials = await getMaterialsForTeacher();
                    dispatch(saveAllMaterialsForTeacher(materials))
                }else if(role == 'student'){
                    const materials = await getMaterialsForStudent();
                    dispatch(saveAllMaterialsForStudent(materials));
                }
            } catch (error) {
                handleError(error)
            }finally{
                setLoading(false)
            }
        }

        fetchDatas();
    },[])

    return {loading};
}

export default useGetMaterials