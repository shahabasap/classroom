/* eslint-disable react-refresh/only-export-components */
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import useRole from '../hooks/useRole';
import { useAppSelector } from '../store/store';
import { ZEGO_APP_ID } from '../constants/env';
import { ZEGO_SERVER_SECRET } from '../constants/env';
import useGetLiveClassToken from '../hooks/useGetLiveClassToken';
import { useSocket } from '../context/SocketContext';
import { startLiveClass } from '../api/services/teacher.classroom.services';


export function getUrlParams(url = window.location.href) {
    const urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

export default function ZegoLiveClass() {
    const { socket } = useSocket();
    const classTitle = useAppSelector(state => state.persistedData.liveClass.title);
    const { zegoToken, loading } = useGetLiveClassToken(); 

    const role = useRole();


    const classroomId = useAppSelector(state => 
        role === 'teacher' ? state.teacherClassroom.classroom?._id : role === 'student' ? state.studentClassroom.classroom?._id : undefined
    );
    const userId = useAppSelector(state =>
        role === 'teacher' ? state.teacherAuth.user?._id : role === 'student' ? state.studentAuth.user?._id : undefined
    );
    const userName = useAppSelector(state =>
        role === 'teacher' ? state.teacherAuth.user?.name : role === 'student' ? state.studentAuth.user?.name : undefined
    );

    if (loading) {
        return <div>Loading</div>
    }

    if (!zegoToken || !classroomId || !userId || !userName) return;

    const myMeeting = async (element:  HTMLElement | null | undefined) => {

        const appID = Number(ZEGO_APP_ID);
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, ZEGO_SERVER_SECRET, classroomId, userId, userName);
        const roomId = getUrlParams().get('classroomId');

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'copy link',
                    url:
                        window.location.protocol + '//' +
                        window.location.host + window.location.pathname +
                        '?classroomId=' +
                        roomId,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
            onJoinRoom: () => {
                if (role == 'teacher') {
                    socket?.emit('liveClassStarted', classroomId);
                    const body = {
                        title:classTitle
                    }
                    startLiveClass(body)
                }
            },
            onLeaveRoom: () => {
                if (role == 'teacher') {
                    socket?.emit('liveClassEnded', classroomId);
                }
            }
        });
    };

    return (
        <div
            className="myCallContainer fixed inset-0 bg-white"
            ref={myMeeting}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}