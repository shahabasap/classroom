import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client'
import { BASE_URL } from "../constants/env";
import useRole from "../hooks/useRole";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";

import { setOnlineUsers } from "../store/slices/socket.slice";
import { addAnnouncementStudent } from "../store/slices/student.classroom.slice";
import { addAnnouncementTeacher } from "../store/slices/teacher.classroom.slice";
import { setLiveClassStatus } from "../store/slices/persist.slice";

interface SocketContextType {
    socket: Socket | null,
    onlineUsers: string[]
}



const defaultContextValue: SocketContextType = {
    socket: null,
    onlineUsers: []
};

export const SocketContext = createContext<SocketContextType>(defaultContextValue);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const dispatch = useAppDispatch()

    const onlineUsers: [] = []
    const role = useRole();

    const classroomId = useAppSelector(state => role == 'student' ?
        state.persistedData.studentDatas?.classroom_id :
        state.persistedData.teacherDatas?.classroom_id);

    const activeUser = useAppSelector(state => role == 'student' ?
        state.studentAuth.user?._id :
        state.teacherAuth.user?._id)

    useEffect(() => {
        if (activeUser) {
            const socket = io(BASE_URL, {
                // path: "/classconnect",
                query: {
                    classroomId,
                    userId: activeUser
                },
                withCredentials: true, 
                timeout: 10000
            });

            setSocket(socket);

            socket.on('connect', () => {
                console.log('Connected to server');
            });
            
            socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
            });

            socket.on('onlineUsers', (users) => {
                console.log('online',users)
                dispatch(setOnlineUsers({ onlineUsers: users }))
            })

            socket.on('announcement', data => {
                dispatch(addAnnouncementStudent(data))
                dispatch(addAnnouncementTeacher(data))
            })

            socket.on('classroomState', (state: { live: boolean }) => {
                console.log(state)
                dispatch(setLiveClassStatus(state?.live))
            })

            socket.on('liveClassStarted', (liveClass) => {
                console.log(liveClass)
                dispatch(setLiveClassStatus(true))
            })

            socket.on('liveClassEnded', (liveClass) => {
                console.log(liveClass)
                dispatch(setLiveClassStatus(false))
            })

            return () => { 
                console.log('closing connection')
                socket.close() 
            }
        } else {
            console.log('clossing connection')
            socket?.close();
            setSocket(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            <Outlet />
        </SocketContext.Provider>
    )
}