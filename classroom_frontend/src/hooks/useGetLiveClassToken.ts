import { useEffect, useState } from "react"
import handleError from "../utils/error.handler"
import { getLiveClassToken } from "../api/services/teacher.classroom.services"
import useRole from "./useRole"
import { getJoinLiveClassToken } from "../api/services/student.classroom.services"



const useGetLiveClassToken = () => {
    const role = useRole();
    const [zegoToken, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    useEffect(() => {
        const getToken = async () => {
            try {
                setLoading(true)
                const data = role == 'teacher' ?
                    await getLiveClassToken() :
                    await getJoinLiveClassToken();
                setToken(data as string);
            } catch (error) {
                handleError(error);
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { zegoToken, loading, error }
}

export default useGetLiveClassToken