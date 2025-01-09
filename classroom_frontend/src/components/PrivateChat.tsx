import React, { useEffect, useRef, useState } from 'react'

import { sendPrivateMessageForTeacher } from '../api/services/teacher.classroom.services';
import handleError from '../utils/error.handler';
import useGetPrivateChats from '../hooks/useGetPrivateChats';
import { useAppSelector } from '../store/store';
import useRole from '../hooks/useRole';
import MessageBox from './MessageBox';
import { sendPrivateMessageForStudent } from '../api/services/student.classroom.services';
import { useSocket } from '../context/SocketContext';



type PrivateChatsPropsType = {
    user: {
        userId: string,
        userName: string
    }
}

const PrivateChat: React.FC<PrivateChatsPropsType> = ({ user }) => {
    const { socket } = useSocket();
    const role = useRole();

    const { loading } = useGetPrivateChats(user.userId);
    const [message, setMessage] = useState('');

    const latestMessage = useRef<HTMLDivElement | null>(null)

    const userId = useAppSelector(state => role == 'teacher' ?
        state.teacherAuth.user?._id :
        state.studentAuth.user?._id)

    const classroomId = useAppSelector(state => role == 'teacher' ?
        state.teacherClassroom.classroom?._id :
        state.studentClassroom.classroom?._id)

    const messages = useAppSelector(state => role == 'teacher' ?
        state.teacherClassroom.privateChats :
        state.studentClassroom.privateChats);

    useEffect(() => {
        if (latestMessage.current) {
            latestMessage.current.scrollIntoView()
        }
    });


    if (socket) {
        socket.emit('joinChatroom', [user.userId, userId, classroomId])
    }

    if (loading) return;

    const sendPrivateMessage = async () => {
        if (message.trim() == '') return;

        try {
            const data = {
                message,
                receiverName: user.userName
            }
            role == 'teacher' ?
                await sendPrivateMessageForTeacher(user.userId, data) :
                await sendPrivateMessageForStudent(user.userId, data);
            setMessage('')
        } catch (error) {
            handleError(error)
        }
    }

    return (

        <div className="flex-1 flex relative  flex-col   ">
            <div className="bg-white p-4 text-gray-700 shadow-lg">
                <h1 className="text-2xl font-semibold">{user.userName}</h1>
            </div>
            <div className=" overflow-y-scroll no-scrollbar h-[70vh] p-4  pb-20">
                {messages.map(message => <MessageBox key={message._id} message={message} />)}
                <div ref={latestMessage}></div>
            </div>
            <div className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full">
                <div className="flex items-center">
                    <input
                        onKeyDown={(e) => {
                            if (e.key == 'Enter') sendPrivateMessage();
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        type="text" placeholder="Type a message..." className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500" />
                    <button
                        onClick={sendPrivateMessage}
                        className="bg-costume-primary-color text-white px-4 py-2 rounded-md ml-2">Send</button>
                </div>
            </div>
        </div>

    )
}

export default PrivateChat