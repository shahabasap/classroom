/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { saveAllAnnouncementsForStudent } from "../store/slices/student.classroom.slice";
import { saveAllAnnouncementsForTeacher } from "../store/slices/teacher.classroom.slice";
import { useAppDispatch } from "../store/store";
import handleError from "../utils/error.handler";
import useRole from "./useRole";
import { fetchAnnouncementsForTeacher } from "../api/services/teacher.services";
import { fetchAnnouncementsForStudent } from "../api/services/student.service";

const useGetAnnouncements = () => {
    const [loading, setLoading] = useState(false);
    const role = useRole();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchDatas = async () => {
            setLoading(true)
            try {
                if (role == 'teacher') {
                    const materials = await fetchAnnouncementsForTeacher();
                    dispatch(saveAllAnnouncementsForTeacher(materials))

                } else if (role == 'student') {
                    const materials = await fetchAnnouncementsForStudent();
                    dispatch(saveAllAnnouncementsForStudent(materials));

                }
                setLoading(false)
            } catch (error) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }

        fetchDatas();
    }, [])

    return { loading };
}

export default useGetAnnouncements