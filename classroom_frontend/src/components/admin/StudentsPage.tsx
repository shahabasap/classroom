import { useEffect, useState } from 'react'
import { StudentSchema } from '../../schema/student.schema'
import { ReadableDate } from '../../utils/indian.std.time'
import handleError from '../../utils/error.handler'
import admin from '../../api/services/admin.services'
import { useNavigate } from 'react-router-dom'
import { adminRowsPerTable } from '../../constants/app.constants'
import { ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons'

const StudentsPage = () => {
    const [students, setStudents] = useState<StudentSchema[]>([])
    const [page, setPage] = useState(1);
    const [end, setEnd] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await admin.students(adminRowsPerTable, page);
                if (data.length == 0) {
                    setEnd(true);
                    return
                } else { setEnd(false) }
                setStudents(data)
            } catch (error) {
                handleError(error)
            }
        }
        fetchStudents()
    }, [page]);

    const handlePagination = (value: string) => {
        if (value === 'next') {
            if (end) return;
            setPage(prevPage => prevPage + 1)
        } else if (value === 'prev') {
            if (page == 1) return
            setPage(prevPage => prevPage - 1)
        }
    }

    return (
        <div className='bg-neutral-900  rounded-lg h-full p-5 m-2 mt-0 ml-0 ' >
            <h1 className='text-3xl font-bold'>
                Students
            </h1>
            <div className='mt-10 p-3'>
                <table className='w-full'>
                    <thead>
                        <tr >
                            <th className='text-start pl-5'>#</th>
                            <th className='text-start'>Name</th>
                            <th className='text-start'>Email</th>
                            <th className='text-start'>Member Since</th>
                            <th className='text-start'>Enrolled Classrooms</th>
                            {/* <th className='text-start'>Action</th> */}
                        </tr>
                    </thead>
                    <tbody className='space-y-10'>
                        <tr>
                            <td colSpan={6} >
                                <hr className='my-3 border-white border-opacity-10 ' />
                            </td>
                        </tr>
                        {students.map(student =>
                            <tr
                                onClick={() => navigate(`/admin/student/${student._id}`)}
                                className='hover:bg-neutral-800 text-gray-200 font-light' >
                                <td className=' py-4 pl-5  text-start rounded-l-lg'>1</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{ReadableDate(student.createdAt)}</td>
                                <td>{student.classrooms.length}</td>
                                
                            </tr>)}
                    </tbody>
                </table>
                <div className='w-full flex justify-center mt-5'>
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

export default StudentsPage