import { useEffect } from "react";
import { useSocket } from "../context/SocketContext"
import { useAppDispatch } from "../store/store";
import { receiveMessageTostudent, receivePrivateChatForStudent } from "../store/slices/student.classroom.slice";
import { receiveMessageToTeacher, receivePrivateChatForTeacher } from "../store/slices/teacher.classroom.slice";
import { PrivateChatSchema } from "../schema/private.chats.schema";


const useListenToMessages = () => {

    const { socket } = useSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        
        socket?.on('classroomMessage',(data)=>{
            dispatch(receiveMessageTostudent({ message: data }));
            dispatch(receiveMessageToTeacher({ message: data }))
        });

        socket?.on('privateMessage',(message:PrivateChatSchema)=>{
            dispatch(receivePrivateChatForStudent({message}))
            dispatch(receivePrivateChatForTeacher({message}))
        })
        

        return () => { socket?.off('message') }
    }, [dispatch, socket])

}

export default useListenToMessages