import React from 'react'
import { cardColors } from '../utils/card.colors'
import { useNavigate } from 'react-router-dom'

import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAppDispatch } from '../store/store'
import { saveStudentEquipedClassroom, saveTeacherEquipedClassroom } from '../store/slices/persist.slice'
import { fetchClassroomDetailsForStudent } from '../api/services/student.classroom.services'
import handleError from '../utils/error.handler'

import { fetchClassroomDetailsForTeacher } from '../api/services/teacher.classroom.services'

type ClassroomCardPropsType = {
    name: string,
    class_teacher_name: string,
    subject: string,
    blocked: boolean,
    _id?: string | undefined,
    role: string
}

const ClassroomCard: React.FC<ClassroomCardPropsType> = ({ name, subject, class_teacher_name, _id, blocked, role }) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const index = Math.floor(Math.random() * cardColors.length)
    const bgColor = cardColors[index].bg;
    const svgColor = cardColors[index].svg

    const capitalizeFirstLetter = (string: string) => {
        const newString = string?.charAt(0).toUpperCase() + string?.slice(1)
        return newString
    }

    const enterClassroom = async () => {
        try {
            const classroom = role =='student'?
             await fetchClassroomDetailsForStudent(_id!):
             await fetchClassroomDetailsForTeacher(_id!)
            console.log(classroom)
            if (blocked) {
                return toast.error("You have been banned from this classroom")
            }
            role == 'student' ?
                dispatch(saveStudentEquipedClassroom({ classroom_id: _id! })) :
                dispatch(saveTeacherEquipedClassroom({ classroom_id: _id! }));

            navigate(`/${role}/classroom/${_id}/summary`)
        } catch (error) {
            handleError(error)
        }

    }
    return (

        <motion.div
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 }
            }}
            className={`relative inline-flex  w-72 flex-col  min-h-40  mx-2 mb-6 overflow-hidden ${bgColor} rounded-lg shadow-xl `}>
            <svg className="absolute bottom-0 left-0 mb-8 " viewBox="0 0 375 283" fill="none">
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill={`${svgColor}`}>
                </rect>
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill={`${svgColor}`}>
                </rect>
            </svg>
            <div className="absolute w-full bottom-0 flex flex-col   px-6  pb-6 mt-6 text-white">
                <span className="block text-2xl font-bold text-black -mb-1 ">
                    {capitalizeFirstLetter(subject)}
                </span>
                <span className="block text-lg  text-black  ">
                    {capitalizeFirstLetter(name)}
                </span>
                <div className="flex justify-between">
                    <span
                        className="block text-xl p-0 bg-gray-800 bg-gradient-to-b from-transparent 0 to-transparen bg-opacity-5 rounded-sm">
                        {class_teacher_name}
                    </span>
                </div>
                <div className='flex flex-col items-end w-full '>
                    <button
                        onClick={enterClassroom}
                        type="button"
                        className="py-2 px-4  bg-white bg-opacity-30 hover:bg-green-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white  
                            transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                        Enter
                    </button>
                </div>
            </div>
        </motion.div>

    )
}

export default ClassroomCard