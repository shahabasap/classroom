import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { blockOrUnblockStudent, getStudentProfie, removeStudentFromClassroom } from '../api/services/teacher.classroom.services'
import { useNavigate, useParams } from 'react-router-dom'
import { StudentSchema } from '../schema/student.schema'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import handleError from '../utils/error.handler'
import { useAppDispatch, useAppSelector } from '../store/store'
import { blockOrUnblockStudentRedux, removeStudent } from '../store/slices/teacher.classroom.slice'
import useRole from '../hooks/useRole'


const PersonalDetails = () => {

    const role = useRole();
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { student_id } = useParams();

    const studentClassroomState = useAppSelector(state => state.teacherClassroom.classroom?.students.find(student => student.student_id == student_id));

    const classroomId = useAppSelector(state=>state.teacherClassroom.classroom?._id)
    
    const [student, setStudent] = useState<StudentSchema | null>(null);

    useEffect(() => {

        const fetchStudentProfile = async () => {
            const data = await getStudentProfie(student_id!);
            setStudent(data)
        }

        fetchStudentProfile();
    }, [student_id]);

    if (!student_id) {
        return
    }

    const showSwal = async () => {
        withReactContent(Swal).fire({
            title: "Do you really want to remove this student?",
            text: "This action can't be undone",
            showCancelButton: true,
            confirmButtonColor: "#C40C0C",
            cancelButtonColor: "#295782",
            confirmButtonText: "Yes, Kick out!",
            cancelButtonText: 'No,keep them here'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await removeStudentFromClassroom(student_id);
                    dispatch(removeStudent({ student_id: student_id }));
                    navigate(`/${role}/classroom/${classroomId}/summary`)
                    toast.success('Student has been removed successfully')
                } catch (error) {
                    handleError(error)
                }
            }
        })
    }

    const handleBlock = () => {

        const showSwal = async () => {
            withReactContent(Swal).fire({
                title: "This student wont be ablet to access your classroom until you unblock them",
                text: "Would you like to proceed?",
                showCancelButton: true,
                confirmButtonColor: "#C40C0C",
                cancelButtonColor: "#295782",
                confirmButtonText: "Yes,Block!",
                cancelButtonText: 'Cancel'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await blockOrUnblockStudent(student_id!);
                        dispatch(blockOrUnblockStudentRedux({ student_id: student_id }));
                        toast.success(`student has been ${studentClassroomState?.blocked? 'unblocked':'blocked'} successfully`)
                    } catch (error) {
                        handleError(error)
                    }
                }
            })
        }

        showSwal();
    }
    return (
        <>
            {student && <div className=' md:flex flex-row items-center justify-center  my-16 m-0 rounded-2xl sm:mx-5 md:mx-16 border-solid border-2   '>
                <div className=' relative flex md:w-1/3 p-10 justify-center image '>
                    <img
                        src={`${student?.profile_image}?${new Date().getTime()}` as string}
                        alt=""
                        className=" rounded-3xl w-60 h-60 object-cover "
                    />
                </div>

                <div className='w-2/3 mx-auto  py-10 '>

                    <div className="flow-root space-y-5 px-10">
                        <div className='text-lg text-costume-primary-color font-semibold'>Personal Details</div>
                        {studentClassroomState?.blocked && <div className='text-red-600'>This student is currently blocked!</div>}
                        <dl className=" divide-y divide-gray-200 text-sm">
                            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 ">
                                <dt className="font-medium text-gray-900">Name</dt>
                                <dd className="text-gray-700 sm:col-span-2">{student?.name}</dd>
                            </div>

                            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 ">
                                <dt className="font-medium text-gray-900">Email</dt>
                                <dd className="text-gray-700 sm:col-span-2">{student?.email}</dd>
                            </div>

                            {/* <div className="grid grid-cols-1 gap-1  py-3 sm:grid-cols-3 ">
                                <dt className="font-medium text-gray-900 ">Phone number</dt>
                                <div className='flex justify-between sm:col-span-2'>
                                    <dd className="text-gray-700 ">9605633278</dd>
                                    <p className='underline text-costume-primary-color cursor-pointer'>edit</p>
                                </div>
                            </div> */}

                            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 ">
                                <dt className="font-medium text-gray-900">School or College </dt>
                                <dd className="text-gray-700 sm:col-span-2">
                                    Govt Engineering college Kozhikode
                                </dd>
                            </div>
                        </dl>
                        <div className='w-full flex justify-end space-x-5'>
                            <button
                                onClick={showSwal}
                                className='danger-btn'>Remove</button>
                            {studentClassroomState?.blocked ? <button
                                onClick={handleBlock}
                                className='warning-btn'>Unblock</button> :
                                <button
                                    onClick={handleBlock}
                                    className='warning-btn'>Block</button>}
                        </div>
                    </div>
                </div>

                <Toaster></Toaster>
            </div>}
        </>
    )
}

export default PersonalDetails

