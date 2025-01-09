import { useEffect, useState } from 'react'
import { ClassroomSchema } from '../../schema/classroom.schema'
import handleError from '../../utils/error.handler';
import admin from '../../api/services/admin.services';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';

import { useNavigate, useParams } from 'react-router-dom';
import { IconButton, TextField, Tooltip } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import toast from 'react-hot-toast';


const ClassroomInfo = () => {
  const navigate = useNavigate()
  const [classroom, setClassroom] = useState<ClassroomSchema | null>(null);
  const { classroomId } = useParams();
  const [reason, setReason] = useState<string>('')
  const [openBanClassroom, setOpenBanClassroom] = useState(false)


  useEffect(() => {
    const fetchClassroomInfo = async () => {
      try {
        const data = await admin.fetchClassroomInfo(classroomId!);
        setClassroom(data)
      } catch (error) {
        handleError(error)
      }
    }
    fetchClassroomInfo();
  }, [classroomId]);

  if (!classroomId) {
    navigate('/admin/teachers');
    return
  }

  const handleBanClassroom = async () => {
    try {
      if (!reason) return toast.error('Please specify the reason for blocking this user.')
      await admin.banOrUnbanClassroom(classroomId, { reason })
      setOpenBanClassroom(false)
      setClassroom(prevClassroom => {
        if (prevClassroom) {
          return {
            ...prevClassroom,
            banned: !prevClassroom?.banned
          }
        }
        return null
      })
    } catch (error) {
      handleError(error)
    }

  }
  return (
    <div className='  bg-gradient-to-b  from-blue-900 to-neutral-900 flex flex-col h-full  rounded-lg'>
      {classroom &&
        <div className=' p-5'>
          <div className=' flex '>
            <div className='  w-1/5 aspect-square mr-5  justify-center bg-gradient-to-t from-blue-800 to-blue-300 rounded-lg items-center flex  self-end'>
              <div className='text-8xl  '>
                <SchoolRoundedIcon fontSize='inherit' />
              </div>
            </div>
            <div className='self-end flex gap-1 flex-col'>
              <p className='font-semibold text-white text-opacity-80'>Classroom</p>
              <h1 className='text-6xl  font-extrabold '>{classroom.subject}</h1>
              <h2 className='text-2xl  font-bold text-white text-opacity-70'>{classroom.name}</h2>
              <h2 className='text-2xl  text-white text-opacity-70 hover:underline cursor-pointer'>{classroom.class_teacher_name}</h2>
            </div>
            <div className='self-end ml-auto mr-10'>
              {classroom.banned ?
                <button
                  onClick={() => setOpenBanClassroom(true)}
                  className='bg-green-400 p-1 flex items-center rounded-full'>
                  <Tooltip title="Unban">
                    <IconButton className='text-white '>
                      <PersonIcon fontSize='large' />
                    </IconButton>
                  </Tooltip>
                </button> :
                <button
                  onClick={() => setOpenBanClassroom(true)}
                  className='bg-red-500 p-1 flex items-center rounded-full'>
                  <Tooltip title="Ban">
                    <IconButton className='text-white '>
                      <PersonOffIcon fontSize='large' />
                    </IconButton>
                  </Tooltip>
                </button>}
            </div>
          </div>
        </div>}
      {openBanClassroom &&
        <div className='fixed inset-0 flex z-20 items-center justify-center bg-black bg-opacity-30'>
          <div className=' flex flex-col gap-10 items-center p-10 rounded-md bg-neutral-800 '>
            <h3 className='text-white text-xl text-opacity-70'>{`Are you sure to ${classroom?.banned ? 'remove ban of this' : 'ban'} this classroom?`}</h3>
            <div className='bg-neutral-700 rounded-md w-full'>
              <TextField
                onChange={(e) => setReason(e.target.value)}
                id="outlined-multiline-flexible"
                label={classroom?.banned ? "Send message via mail" : 'Send reason via mail'}
                multiline
                color='warning'
                inputProps={{
                  style: { color: 'white' }
                }}
                fullWidth
                maxRows={4} />
            </div>
            <div className='flex w-full justify-center gap-8'>
              <Tooltip title="Yes">
                <IconButton className='text-white'>
                  <CheckCircleIcon
                    onClick={handleBanClassroom}
                    className='text-red-500 cursor-pointer hover:text-6xl text-5xl' fontSize='large' />
                </IconButton>
              </Tooltip>
              <Tooltip title="No">
                <IconButton className='text-white'>
                  <CancelIcon
                    onClick={() => setOpenBanClassroom(false)}
                    className='text-green-500 cursor-pointer hover:text-6xl text-5xl' fontSize='large' />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>}

      <div className=' p-3 bg-black  bg-gradient-to-t from-neutral-900 to-transparent bg-opacity-15 flex-1'>
        <div className='p-3 mb-2'>
          <h1 className='text-4xl font-extrabold text-white text-opacity-80 '>Students</h1>
        </div>
        <table className='w-full'>
          <thead >
            <tr className='text-white  text-opacity-75'>
              <th className='text-start  font-semibold pl-5'>#</th>
              <th className='text-start font-semibold'>Name</th>
              <th className='text-start font-semibold'>Status</th>
              {/* <th className='text-start font-semibold'>Created at</th> */}
              {/* <th className='text-start font-semibold'>Strength</th> */}
              {/* <th className='text-start'>Action</th> */}
            </tr>
          </thead>
          <tbody className='space-y-10'>
            <tr>
              <td colSpan={6} >
                <hr className='my-3 border-white border-opacity-10 ' />
              </td>
            </tr>
            {classroom?.students.map((student, index) =>
              <tr
                key={classroom._id}
                className='hover:bg-neutral-700 hover:bg-opacity-50 cursor-pointer text-gray-200 font-light' >
                <td className=' py-4 pl-5  text-start rounded-l-lg'>{index + 1}</td>
                <td>
                  <div>
                    <h1>{student.name}</h1>
                    <h2 className='text-sm text-gray-400'>{student.email}</h2>
                  </div>
                </td>
                <td>{student.blocked ? 'Blocked' : 'Active'}</td>
                {/* <td>{ReadableDate(student.blocked)}</td> */}
                {/* <td>{'classroomDetail.students.length'}</td> */}
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassroomInfo