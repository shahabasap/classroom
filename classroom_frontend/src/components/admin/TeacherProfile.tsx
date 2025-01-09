import { useEffect, useState } from 'react'
import { TeacherSchema } from '../../schema/teacher.schema';
import handleError from '../../utils/error.handler';
import admin from '../../api/services/admin.services';
import { useParams } from 'react-router-dom';
import { ReadableDate } from '../../utils/indian.std.time';
import { ClassroomSchema } from '../../schema/classroom.schema';


import { IconButton, TextField, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import toast from 'react-hot-toast';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';


const TeacherProfile = () => {
    const { teacherId } = useParams();
    const [reason,setReason] = useState<string>('')
    const [teacher, setTeacher] = useState<TeacherSchema | null>(null);
    const [openBlockTeacher, setOpenBlockTeacher] = useState(false)

    useEffect(() => {
        if (!teacherId) return
        const fetchTeacher = async () => {
            try {
                const data = await admin.fetchTeacherInfo(teacherId);
                setTeacher(data);
            } catch (error) {
                handleError(error)
            }
        }

        fetchTeacher();
    }, [teacherId]);

    const handleBlockTeacher = async () => {
        try {
            if(!reason) return toast.error('Please specify the reason for blocking this user.')
            await admin.blockTeacher(teacherId!,{reason});
            setOpenBlockTeacher(false)
            toast.success(`User has been ${teacher?.blocked ? 'Unblocked' : 'Blocked'} successfully`);
            setTeacher(prevTeacher => {
                if (prevTeacher) {
                    return {
                        ...prevTeacher,
                        blocked: !prevTeacher.blocked
                    }
                }
                return null
            })
        } catch (error) {
            handleError(error)
        }
    }


    return (
        <div className='bg-gradient-to-b overflow-hidden from-green-400 to-neutral-900 flex flex-col h-full rounded-lg '>
            {teacher &&
                <div className='relative  p-5 overflow-hidden rounded-lg'>
                    <div className='text-2xl p-2    flex z-10 relative mb-5'>
                        <p className='text-white text-opacity-30 hover:underline cursor-pointer'>Teachers</p>
                        <p className=''>/ Profile</p>
                    </div>
                    <div className='w-full flex justify-between '>
                        <div className=' md:flex'>
                            <div className='w-1/3  mr-3 '>
                                <img src={`${teacher.profile_image}`}
                                    className='rounded-lg aspect-square w-96'
                                    alt="" />
                            </div>
                            <div className='p-1 self-end '>
                                <p className='text-3xl font-extrabold '>{teacher.name}</p>
                                <p className=''>{teacher.email}</p>
                            </div>
                        </div>
                        <div className='self-end'>
                            {teacher.blocked ?
                                <button onClick={() => setOpenBlockTeacher(true)}
                                    className='bg-green-400 p-1 flex items-center rounded-full'>
                                    <Tooltip title="Unblock">
                                        <IconButton className='text-white '>
                                            <PersonIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                </button> :
                                <button onClick={() => setOpenBlockTeacher(true)}
                                    className='bg-red-500 p-1 flex items-center rounded-full'>
                                    <Tooltip title="Block">
                                        <IconButton className='text-white '>
                                            <PersonOffIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                </button>}
                        </div>
                    </div>
                </div>}
            {openBlockTeacher &&
                <div className='fixed inset-0 flex z-20 items-center justify-center bg-black bg-opacity-30'>
                    <div className=' flex flex-col gap-10 items-center p-5 rounded-md bg-neutral-800 '>
                        <h3 className='text-white text-xl text-opacity-70'>{`Are you sure to ${teacher?.blocked ? 'unblock' : 'block'} this user?`}</h3>
                        <div className='bg-neutral-700 rounded-md w-full'>
                            <TextField
                                onChange={(e)=>setReason(e.target.value)}
                                id="outlined-multiline-flexible"
                                label={ teacher?.blocked?"Send message via mail":'Send reason via mail'}
                                multiline
                                color='warning'
                                inputProps={{
                                    style:{color:'white'}
                                }}
                                fullWidth
                                maxRows={4}/>
                        </div>
                        <div className='flex w-full justify-center gap-8'>
                            <Tooltip title="Yes">
                                <IconButton className='text-white'>
                                    <CheckCircleIcon
                                        onClick={handleBlockTeacher}
                                        className='text-red-500 cursor-pointer hover:text-6xl text-5xl' fontSize='large' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="No">
                                <IconButton className='text-white'>
                                    <CancelIcon
                                        onClick={() => setOpenBlockTeacher(false)}
                                        className='text-green-500 cursor-pointer hover:text-6xl text-5xl' fontSize='large' />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>}

            <div className=' p-3 bg-black bg-gradient-to-t from-neutral-900 to-transparent bg-opacity-15 flex-1'>
                <div className='p-3 mb-2'>
                    <h1 className='text-4xl font-extrabold text-white text-opacity-80 '>Owned classrooms</h1>
                </div>
                <table className='w-full'>
                    <thead >
                        <tr className='text-white  text-opacity-75'>
                            <th className='text-start  font-semibold pl-5'>#</th>
                            <th className='text-start font-semibold'>Name</th>
                            <th className='text-start font-semibold'>Subject</th>
                            <th className='text-start font-semibold'>Created at</th>
                            <th className='text-start font-semibold'>Strength</th>
                            {/* <th className='text-start'>Action</th> */}
                        </tr>
                    </thead>
                    <tbody className='space-y-10'>
                        <tr>
                            <td colSpan={6} >
                                <hr className='my-3 border-white border-opacity-10 ' />
                            </td>
                        </tr>
                        {teacher?.classrooms.map((classroom, index) => {
                            const classroomDetail = classroom.classroom_id as unknown as ClassroomSchema;
                            return (<tr
                                className='hover:bg-neutral-700 hover:bg-opacity-50 cursor-pointer text-gray-200 font-light' >
                                <td className=' py-4 pl-5  text-start rounded-l-lg'>{index + 1}</td>
                                <td>{classroom.classroom_name}</td>
                                <td>{classroom.subject}</td>
                                <td>{ReadableDate(classroom.joined_at)}</td>
                                <td>{classroomDetail.students.length}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeacherProfile