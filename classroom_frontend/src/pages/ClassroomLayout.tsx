/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react'
import ClassroomNavBar from '../components/ClassroomNavBar';
import { Outlet } from 'react-router-dom';
import { fetchClassroomDetailsForStudent } from '../api/services/student.classroom.services';
import { fetchClassroomDetailsForTeacher } from '../api/services/teacher.classroom.services';
import { fetchClassroomDetailsForStudentThunk } from '../store/slices/student.classroom.slice';
import { fetchClassroomDetailsForTeacherThunk } from '../store/slices/teacher.classroom.slice';

import useRole from '../hooks/useRole';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Toaster } from 'react-hot-toast';

const ClassroomLayout = () => {

  const role = useRole();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => role === 'student' ?
    state.studentAuth.user :
    state.teacherAuth.user);

  const classroom_id = useAppSelector(state => role === 'teacher' ?
    state.persistedData.teacherDatas?.classroom_id :
    state.persistedData.studentDatas?.classroom_id
  )
  useEffect(() => {
    const fetchClassrooms = () => {
      if (user?._id) {
        role == 'student' ?
          dispatch(fetchClassroomDetailsForStudentThunk(() => fetchClassroomDetailsForStudent(classroom_id!))) :
          dispatch(fetchClassroomDetailsForTeacherThunk(() => fetchClassroomDetailsForTeacher(classroom_id!)))
      } else {
        console.error('User ID is undefined in dashboard');
      }
    }

    fetchClassrooms()

  }, [dispatch]);


  return (
    <div className='flex  flex-1'>
      <ClassroomNavBar />
      <div className='w-full m-4 flex-1 '>
        <Outlet />
      </div>
      <Toaster></Toaster>
    </div>
  )
}

export default ClassroomLayout