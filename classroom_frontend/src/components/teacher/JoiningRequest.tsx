import React from 'react'
import { StudentSchema } from '../../schema/student.schema'
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { acceptJoiningRequest, rejectJoiningRequest } from '../../api/services/teacher.classroom.services';
import handleError from '../../utils/error.handler';
import { useAppDispatch } from '../../store/store';
import { acceptRequests,  rejectRequests } from '../../store/slices/teacher.classroom.slice';

type JoiningRequestTableProps = {
    requests:StudentSchema[]
    closeRequests:React.Dispatch<React.SetStateAction<boolean>>,
    classroom_id:string
}



const JoiningRequestTable: React.FC<JoiningRequestTableProps> = ({ closeRequests,classroom_id,requests }) => {
    const dispatch = useAppDispatch();
    console.log(classroom_id)
    const acceptRequestHandler = async (student_id:string,index:number)=>{
        try {
            const body = {student_id}
            const accepted = await acceptJoiningRequest(body);

            const data = accepted.students;

            dispatch(acceptRequests({index,data}))


        } catch (error) {
            console.log(error)

            handleError(error)
        }
    }

    const rejectRequestHandler = async (student_id:string,index:number)=>{
        try {
            const body = {student_id}
            await rejectJoiningRequest(body);
            dispatch(rejectRequests({index,data:[]}))
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <motion.div
        initial={{ opacity: 0, scale: 0, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        exit={{ opacity: 0, scale: 1 }} 
        className='fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center'>
            <div className="bg-white rounded-xl shadow-xl border p-8 w-3xl">
                <div className="mb-4 flex justify-between">
                    <h1 className="font-semibold text-gray-800">Joinig requests</h1>
                    <div onClick={()=>closeRequests(false)}
                    className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                        <CloseIcon fontSize='medium' color='error' />
                    </div>
                </div>
                {requests.map((student:StudentSchema,index:number) =>
                    <div key={student._id} className="flex gap-6 items-center mb-8">
                        <div className="w-1/5">
                            <img className="w-12 h-12 rounded-full border border-gray-100 shadow-sm" src={student.profile_image} alt="user image" />
                        </div>
                        <div className="w-4/5 flex flex-col space-y-4">
                            <div>
                                <span className="font-semibold text-gray-800">{student.name}</span>
                                <p className='text-gray-400'>{student.email}</p>
                            </div>
                            <div className="font-semibold space-x-3">
                               <button onClick={()=>acceptRequestHandler(student._id!,index)}
                                
                               className='success-btn w-20'>{'Accept'}</button>
                               <button onClick={()=>rejectRequestHandler(student._id!,index)}
                                
                                className='danger-btn w-20'>{'Reject'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default JoiningRequestTable