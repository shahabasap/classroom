import { useEffect, useState } from "react";
import useRole from "./useRole";
import handleError from "../utils/error.handler";
import { getPrivateMessagesForTeacher } from "../api/services/teacher.classroom.services";
import { useAppDispatch } from "../store/store";
import { saveAllPrivateChatsForTeacher } from "../store/slices/teacher.classroom.slice";
import { getPrivateMessagesForStudent } from "../api/services/student.classroom.services";
import { saveAllPrivateChatsForStudent } from "../store/slices/student.classroom.slice";


const useGetPrivateChats = (receiverId: string) => {
    const [loading, setLoading] = useState(false);

    const role = useRole();
    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true)
            try {
                if (role == 'teacher') {
                    const chats = await getPrivateMessagesForTeacher(receiverId);
                    dispatch(saveAllPrivateChatsForTeacher({ messages: chats }))
                    console.log('teacher private chats: ', chats)
                } else if (role == 'student') {
                    const chats = await getPrivateMessagesForStudent(receiverId);
                    dispatch(saveAllPrivateChatsForStudent({ messages: chats }))
                }
            } catch (error) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }

        fetchChats();
    }, [receiverId,dispatch,role]);

    return { loading }
}

export default useGetPrivateChats