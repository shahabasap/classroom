import { Tooltip, IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react'

import { ReadableDate } from '../../utils/indian.std.time';
import { StudentSchema } from '../../schema/student.schema';
import toast from 'react-hot-toast';
import admin from '../../api/services/admin.services';
import handleError from '../../utils/error.handler';
import { useParams } from 'react-router-dom';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';

const StudentProfile = () => {
    const { studentId } = useParams();
    const [reason,setReason] = useState<string>('')
    const [student, setStudent] = useState<StudentSchema | null>()
    const [openBlockStudent, setOpenBlockStudent] = useState(false);

    useEffect(() => {
        if (!studentId) return
        const fetchStudent = async () => {
            try {
                const data = await admin.fetchStudentInfo(studentId);
                console.log(data)
                setStudent(data);
            } catch (error) {
                handleError(error)
            }
        }

        fetchStudent();
    }, []);

    const handleBlockStudent = async () => {
        try {
            if(!reason) return toast.error('Please specify the reason for blocking this user.')
            await admin.blockStudent(studentId!,{reason});
            setOpenBlockStudent(false)
            toast.success(`User has been ${student?.blocked ? 'Unblocked' : 'Blocked'} successfully`);
            setStudent(prevStudent => {
                if (prevStudent) {
                    return {
                        ...prevStudent,
                        blocked: !prevStudent.blocked
                    }
                }
                return null
            })
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <div className='bg-gradient-to-b overflow-hidden from-red-500 to-neutral-900 flex flex-col h-full rounded-lg '>
            {student &&
                <div className='relative  p-5 overflow-hidden rounded-lg'>
                    <div className='text-2xl p-2    flex z-10 relative mb-5'>
                        <p className='text-white text-opacity-30 hover:underline cursor-pointer'>students</p>
                        <p className=''>/ Profile</p>
                    </div>
                    <div className='w-full flex justify-between '>
                        <div className=' flex'>
                            <div className='w-1/3 aspect-square mr-3 '>
                                <img src={`${student.profile_image}`}
                                    className='rounded-lg w-96'
                                    alt="" />
                            </div>
                            <div className='p-1 self-end '>
                                <p className='text-3xl font-extrabold '>{student.name}</p>
                                <p className=''>{student.email}</p>
                            </div>
                        </div>
                        <div className='self-end'>
                            {student.blocked ?
                                <button onClick={() => setOpenBlockStudent(true)}
                                    className='bg-green-400 p-1 flex items-center rounded-full'>
                                    <Tooltip title="Unblock">
                                        <IconButton className='text-white '>
                                            <PersonIcon fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                </button> :
                                <button onClick={() => setOpenBlockStudent(true)}
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
            {openBlockStudent &&
                <div className='fixed inset-0 flex z-20 items-center justify-center bg-black bg-opacity-30'>
                    <div className=' flex flex-col gap-10 items-center p-10 rounded-md bg-neutral-800 '>
                        <h3 className='text-white text-xl text-opacity-70'>{`Are you sure to ${student?.blocked ? 'unblock' : 'block'} this user?`}</h3>
                        <div className='bg-neutral-700 rounded-md w-full'>
                            <TextField
                                onChange={(e)=>setReason(e.target.value)}
                                id="outlined-multiline-flexible"
                                label={ student?.blocked?"Send message via mail":'Send reason via mail'}
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
                                        onClick={handleBlockStudent}
                                        className='text-red-500 cursor-pointer hover:text-6xl text-5xl' fontSize='large' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="No">
                                <IconButton className='text-white'>
                                    <CancelIcon
                                        onClick={() => setOpenBlockStudent(false)}
                                        className='text-green-500 cursor-pointer hover:text-6xl text-5xl' fontSize='large' />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>}

            <div className=' p-3 bg-black bg-gradient-to-t from-neutral-900 to-transparent bg-opacity-15 flex-1'>
                <div className='p-3 mb-2'>
                    <h1 className='text-4xl font-extrabold text-white text-opacity-80 '>Enrolled classrooms</h1>
                </div>
                <table className='w-full'>
                    <thead >
                        <tr className='text-white  text-opacity-75'>
                            <th className='text-start  font-semibold pl-5'>#</th>
                            <th className='text-start font-semibold'>Name</th>
                            <th className='text-start font-semibold'>Subject</th>
                            <th className='text-start font-semibold'>Created at</th>
                        </tr>
                    </thead>
                    <tbody className='space-y-10'>
                        <tr>
                            <td colSpan={6} >
                                <hr className='my-3 border-white border-opacity-10 ' />
                            </td>
                        </tr>
                        {student?.classrooms.map((classroom, index) => {
                            
                            return (<tr
                                className='hover:bg-neutral-700 hover:bg-opacity-50 cursor-pointer text-gray-200 font-light' >
                                <td className=' py-4 pl-5  text-start rounded-l-lg'>{index + 1}</td>
                                <td>{classroom.classroom_name}</td>
                                <td>{classroom.subject}</td>
                                <td>{ReadableDate(classroom.joined_at)}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentProfile