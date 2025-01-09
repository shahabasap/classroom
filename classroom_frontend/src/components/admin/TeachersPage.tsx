import { useEffect, useState } from 'react'
import handleError from '../../utils/error.handler'
import admin from '../../api/services/admin.services'
import { TeacherSchema } from '../../schema/teacher.schema'
import { ReadableDate } from '../../utils/indian.std.time'
import { useNavigate } from 'react-router-dom'

import { ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons'
import { adminRowsPerTable } from '../../constants/app.constants'

const TeachersPage = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState<TeacherSchema[]>([]);
    const [page,setPage] = useState(1)
    const [end, setEnd] = useState(false);
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await admin.teachers(adminRowsPerTable, page);
                if (data.length == 0) {
                    setEnd(true);
                    return
                } else { setEnd(false) }
                setTeachers(data)
            } catch (error) {
                handleError(error)
            }
        }
        fetchTeachers()
    }, [page]);
    
    const handlePagination = (value: string) => {
        if (value == 'next') {
            if (end) return;
            setPage(prevPage => prevPage + 1)
        } else if (value == 'prev') {
            if (page == 1) return
            setPage(prevPage => prevPage - 1)
        }
    }


    console.log('teachers: ', teachers)
    return (
        <div className='bg-neutral-900  rounded-lg h-full p-5 m-2 mt-0 ml-0 ' >
            <h1 className='text-3xl font-bold'>
                Teachers
            </h1>
            <div className='mt-10 p-3'>
                <table className='w-full'>
                    <thead>
                        <tr >
                            <th className='text-start pl-5'>#</th>
                            <th className='text-start'>Name</th>
                            <th className='text-start'>Email</th>
                            <th className='text-start'>Member Since</th>
                            <th className='text-start'>Classrooms</th>
                            {/* <th className='text-start'>Action</th> */}
                        </tr>
                    </thead>
                    <tbody className='space-y-10'>
                        <tr>
                            <td colSpan={6} >
                                <hr className='my-3 border-white border-opacity-10 ' />
                            </td>
                        </tr>
                        {teachers.map(teacher =>
                            <tr
                                onClick={() => navigate(`/admin/teacher/${teacher._id}`)}
                                className='hover:bg-neutral-800 cursor-pointer text-gray-200 font-light' >
                                <td className=' py-4 pl-5  text-start rounded-l-lg'>1</td>
                                <td>{teacher.name}</td>
                                <td>{teacher.email}</td>
                                <td>{ReadableDate(teacher.createdAt)}</td>
                                <td>{teacher.classrooms.length}</td>
                                {/* <td className='rounded-r-lg'>Block</td> */}
                            </tr>)}
                    </tbody>
                </table>
                <div className='w-full flex justify-center gap-5 mt-5'>
                <button
                        onClick={() => handlePagination('prev')}
                        className=' text-red-500 rounded-full hover:border hover:bg-gray-800 border-white border-opacity-20 flex justify-center items-center'>
                        <ArrowLeftIcon fontSize='medium' /></button>
                    <button
                        onClick={() => handlePagination('next')}
                        className=' text-red-500 rounded-full  hover:border hover:bg-gray-800 border-white border-opacity-20 flex justify-center items-center'>
                        <ArrowRightIcon fontSize='medium' /></button>
                </div>
            </div>
        </div>
    )
}

export default TeachersPage