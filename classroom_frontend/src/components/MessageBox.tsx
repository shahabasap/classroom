import React from 'react'
import useRole from '../hooks/useRole';
import { useAppSelector } from '../store/store';
import { PrivateChatSchema } from '../schema/private.chats.schema';
import { convertToIST } from '../utils/indian.std.time';

type MessageBoxPropsType = {
    message: PrivateChatSchema;
}

const MessageBox: React.FC<MessageBoxPropsType> = ({ message }) => {

    const role = useRole();

    const userId =
        useAppSelector(state => role == 'teacher' ?
            state.teacherAuth.user?._id :
            state.studentAuth.user?._id);

    if (!userId) return;
    return (
        <div key={message._id}>
            {userId == message.sender_id ?
                <div
                    className="flex justify-end mb-4 cursor-pointer">
                    <div className="flex flex-col max-w-96 bg-costume-primary-color text-white rounded-lg p-3 ">
                        <p>{message.message}</p>
                        <span className='self-end text-xs text-gray-400'>{convertToIST(message.createdAt)}</span>
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
                            <p className='text-xs text-gray-500'>{message.sender_name}</p>
                            <span className='self-start text-[0.65rem] text-gray-400'>{convertToIST(message.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>

                    </div>
                </div>
            }
        </div>
    )
}

export default MessageBox