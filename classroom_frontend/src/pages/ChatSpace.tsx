import { useState, useRef, useEffect } from 'react'
import { useAppSelector } from '../store/store'
import useRole from '../hooks/useRole';
import { sendMessagesForTeacher } from '../api/services/teacher.classroom.services';
import { sendMessagesForStudent } from '../api/services/student.classroom.services';

import handleError from '../utils/error.handler';
import { Toaster } from 'react-hot-toast';
import useGetMessages from '../hooks/useGetMessages';

import useListenToMessages from '../hooks/useListenToMessages';
import { convertToIST } from '../utils/indian.std.time';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import PrivateChat from '../components/PrivateChat';

type SelectedUserType = {
    userId: string,
    userName: string
}

const ChatSpace = () => {
    const role = useRole();
    useListenToMessages()
    const [message, setMessage] = useState('');

    const [selectedUser, setSelectedUser] = useState<SelectedUserType | null>(null);


    const { loading } = useGetMessages();
    const recentMessageRef = useRef<HTMLDivElement | null>(null);

    const messages = useAppSelector(state => role == 'student' ?
        state.studentClassroom.classroom?.classroom_messages :
        state.teacherClassroom.classroom?.classroom_messages)

    const onlineUsers = useAppSelector(state => state.socket.onlineUsers)

    useEffect(() => {
        if (recentMessageRef.current) {
            recentMessageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])



    const currUser = useAppSelector(state => role == 'teacher' ?
        state.teacherAuth.user :
        state.studentAuth.user)

    if (!currUser) console.error('User data not available in redux');

    const userId = currUser!._id

    const classroom = useAppSelector(state => role == 'teacher' ?
        state.teacherClassroom.classroom :
        state.studentClassroom.classroom)


    if (!classroom) return

    const sendMessage = async () => {
        try {
            if (message.length == 0) return;
            if (role == 'teacher') {
                sendMessagesForTeacher({ message });
            } else if (role == 'student') {
                sendMessagesForStudent({ message });
            }
            setMessage('')

        } catch (error) {
            handleError(error)
        }
    }

const chats = messages && messages.map((chat) => {
        return (
            <div key={chat._id}>
                {userId == chat.sender_id ?
                    <div
                        className="flex justify-end mb-4 cursor-pointer">
                        <div className="flex flex-col max-w-96 bg-costume-primary-color text-white rounded-lg p-3 ">
                            <p>{chat.message}</p>
                            <span className='self-end text-xs text-gray-400'>{convertToIST(chat.send_at)}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                            <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" className="w-8 h-8 rounded-full" />
                        </div>
                    </div> :
                    <div
                        className="flex mb-4 cursor-pointer ">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                            <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-8 h-8 rounded-full" />
                        </div>
                        <div className="flex flex-col max-w-96 bg-white border-2  rounded-lg p-3 ">
                            <div className='flex gap-3 justify-between'>
                                <p className='text-xs text-gray-500'>{chat.sender_name}</p>
                                <span className='self-start text-[0.65rem] text-gray-400'>{convertToIST(chat.send_at)}</span>
                            </div>
                            <p className="text-gray-700">{chat.message}</p>

                        </div>
                    </div>
                }
            </div>
        )
    });

    return (
        <>

            <div className="flex  border-4  rounded-lg border-gray-300 flex-1 ">
                <div className=" bg-white border-r p-2 border-gray-300">

                    {/* <!-- Contact List --> */}
                    <div className="overflow-y-auto  p-3 mb-9 pb-20">

                        {<div
                            onClick={() => setSelectedUser(null)}
                            className={` ${selectedUser == null && 'bg-costume-primary-color text-white'}
                            flex items-center mb-2 cursor-pointer hover:bg-costume-primary-color hover:text-white  p-2 rounded-md`}>
                            <div className='mr-3'>
                                <GroupsIcon fontSize='large' />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{classroom.subject}</h2>
                                <p className="">Classroom</p>
                            </div>
                        </div>}

                        <p className='mb-2 '>Participants</p>
                        <hr className='border-2 mb-2 border-gray-400' />
                        {role == 'student' &&
                            <div onClick={() => {
                                setSelectedUser({
                                    userId: classroom.class_teacher_id,
                                    userName: classroom.class_teacher_name
                                })
                            }}
                                className={` ${selectedUser?.userId == classroom.class_teacher_id && 'bg-costume-primary-color text-white'}
                            flex items-center mb-2 cursor-pointer hover:bg-costume-primary-color hover:text-white  p-2 rounded-md`}>
                                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                    <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-12 h-12 rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">{classroom.class_teacher_name}</h2>
                                    <p className="">Class teacher</p>
                                </div>
                            </div>}



                        {role == 'teacher' && classroom && classroom?.students &&
                            classroom.students.map(student => (
                                <div onClick={() => {
                                    setSelectedUser({
                                        userId: student.student_id,
                                        userName: student.name
                                    })

                                }}
                                    key={student.student_id}
                                    className={` ${selectedUser?.userId == student.student_id && 'bg-costume-primary-color text-white'} 
                                    flex items-center space-x-2 mb-4 cursor-pointer hover:bg-costume-primary-color hover:text-white p-2 rounded-md`}>
                                    <div className='mr-3 relative'>
                                        <PersonIcon fontSize='large' />
                                        {onlineUsers.includes(student.student_id) &&
                                            <div className='h-2 w-2 absolute top-0 left-1 rounded-full bg-green-500'></div>}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-md ">{student.name}</h2>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* <!-- Main Chat Area --> */}
                {selectedUser ? <PrivateChat user={selectedUser} /> :
                    <div className="flex-1 flex relative  flex-col   ">

                        <div className="bg-white p-4 text-gray-700 shadow-lg">
                            <h1 className="text-2xl font-semibold">{classroom.subject}</h1>
                        </div>
                        {loading ?
                            <div className='h-[70vh]'>Loading..</div> :
                            <div className=" overflow-y-scroll no-scrollbar h-[70vh] p-4  pb-20">
                                {chats}
                                <div ref={recentMessageRef}></div>
                            </div>}

                        <div className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full">
                            <div className="flex items-center">
                                <input
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') sendMessage();
                                    }}
                                    value={message}
                                    type="text" placeholder="Type a message..." className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500" />
                                <button
                                    onClick={sendMessage}
                                    className="bg-costume-primary-color text-white px-4 py-2 rounded-md ml-2">Send</button>
                            </div>
                        </div>
                    </div>}
            </div>
            <Toaster position='top-right'></Toaster>
        </>

    )
}

export default ChatSpace




