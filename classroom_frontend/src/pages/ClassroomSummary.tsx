
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import classroomImage from "../assets/images/classroom.jpg"
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';

import useRole from '../hooks/useRole';
import { useEffect, useState } from 'react';

import JoiningRequestTable from '../components/teacher/JoiningRequest';
import { useAppDispatch, useAppSelector } from '../store/store';
import { removeClassroom, } from '../store/slices/teacher.classroom.slice';
import { Skeleton } from '@mui/material';


const ClassroomSummary = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const role = useRole();
  const [loading, setLoading] = useState(true);
  const [openReqeusts, setOpenRequests] = useState<boolean>(false);
  const classroomInfo = useAppSelector(state => role == 'student' ?
    state.studentClassroom.classroom :
    state.teacherClassroom.classroom);

  useEffect(() => {
    const time = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(time)
  }, [])

  const onlineUsers = useAppSelector(state => state.socket.onlineUsers)

  const handleExit = () => {
    dispatch(removeClassroom())
    navigate(`/${role}/dashboard`)
  }



  return (
    <div className={`w-full   h-full p-5 rounded-lg`}>
      {classroomInfo &&
        <div
          style={{
            backgroundImage: `url(${classroomImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className={`rounded-md shadow-lg overflow-hidden relative`}>
          <div className="absolute inset-0 bg-black z-0 opacity-30 rounded-md"></div> 
          <div className=' relative  p-8 border-2 z-10  md:flex shadow-xl justify-between rounded-md'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-3xl md:text-5xl  text-white font-bold'>{classroomInfo?.subject}</h1>
              <span className='text-3xl text-white'>{classroomInfo?.name}</span>
            </div>
            <button
              onClick={handleExit}
              className="inline-flex self-center bg-costume-primary-color items-center gap-2 
            rounded-md px-4 py-2 text-sm text-white hover:bg-red-400  focus:relative
            transition duration-300 ease-in-out">
              <ExitToAppIcon />Exit</button>
          </div>
        </div>}

      <div className='md:flex justify-between py-3 px-8'>
        <div className='flex flex-col '>
          <span className='text-2xl font-semibold '>{classroomInfo?.class_teacher_name}</span>
          <span className='text-lg ' >{classroomInfo?.classroom_id}</span>
          <span className='text-lg'>Strength: {classroomInfo?.students.length}</span>
        </div>
        {role == 'teacher' && <button

          onClick={() => setOpenRequests(true)}
          className="relative inline-flex self-center bg-costume-primary-color items-center gap-2 
            rounded-md px-4 py-2 text-sm text-white hover:bg-gray-400  focus:relative
            transition duration-300 ease-in-out">
          <GroupAddIcon />
          <span>Requests</span>
          {classroomInfo && (classroomInfo.joining_requests.length != 0 &&
            <span className='absolute -top-1 -right-1 p-3 h-4 w-4 rounded-full flex items-center justify-center bg-red-600'>{classroomInfo.joining_requests.length}</span>)}
        </button>}
      </div>
      <hr />
      <div className='p-5'>
        <div className="flex flex-col border-2 rounded-md p-4">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr >
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">S.NO</th>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {!loading ? (classroomInfo && classroomInfo.students.map((student: {
                      student_id: string,
                      blocked: boolean,
                      email: string,
                      name: string,
                    }, index) =>
                      <tr onClick={role == 'teacher' ? () => navigate(`/teacher/student/profile/${student.student_id}`) : undefined}
                        key={student.student_id} className="hover:bg-gray-100 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {student.blocked ?
                            <p className={`bg-red-400 inline-block p-1 px-2 rounded-lg text-xs`}>Blocked</p> :
                            <p className={`bg-green-400 inline-block p-1 px-2 rounded-lg text-xs`}>Active</p>
                          }
                        </td>
                        {onlineUsers.includes(student.student_id) ?
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">online</td> :
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500">offline</td>
                        }
                      </tr>)) :
                      Array.from({ length: 5 }).map((_, index) =>
                        <tr className='mb-2' key={index} >
                          <td colSpan={5}>
                            <Skeleton variant="rectangular" animation="wave" width={"100%"} height={40} /></td>
                        </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {classroomInfo && (openReqeusts && <JoiningRequestTable
        requests={classroomInfo.joining_requests}
        classroom_id={classroomInfo._id}
        closeRequests={setOpenRequests} />)}
    </div>
  )
}

export default ClassroomSummary