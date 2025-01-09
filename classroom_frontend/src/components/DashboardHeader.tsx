import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Logo from './Logo'
import { useAppSelector, useAppDispatch } from '../store/store';
import { logoutStudent } from '../api/services/student.service';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { removeStudent } from '../store/slices/student.auth.slice';
import { googleLogout } from '@react-oauth/google';
import { removeTeacher } from '../store/slices/teacher.auth.slice';
import { logoutTeacher } from '../api/services/teacher.services';
import useRole from '../hooks/useRole';
import { removeClassroom } from '../store/slices/teacher.classroom.slice';
import defaultProfile from '../assets/images/defaultProfile.jpg'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  flexDirection: "column",
  alignItems: "centre",

};

interface DashboardHeaderProps {

}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {

  const role = useRole();
  const [open, setOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const [imageError,setImageError] = useState(false)

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user =
    useAppSelector(state => role == 'student' ?
      state.studentAuth.user :
      state.teacherAuth.user);


  if (!user) navigate('/');

  const handleLogout = async () => {
    try {
      role == 'student' ?
        await logoutStudent({ userId: user?._id as string }) :
        await logoutTeacher({ userId: user?._id as string });

      role == 'student' ?
        dispatch(removeStudent()) :
        dispatch(removeTeacher());

      dispatch(removeClassroom())

      googleLogout();

      navigate('/')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }



  return (
    <>
      <header className="bg-costume-secondary-color shadow-md text-white p-4 flex items-center  justify-between sm:px-10">

        <div className="flex items-center space-x-4">
          <Logo />
        </div>
        <div>
          <h1 className="text-xl hidden lg:flex sm:text-2xl  font-extrabold text-costume-primary-color ">{`${role == 'student' ? "STUDENT" : "TEACHER"} DASHBOARD`}</h1>
        </div>
        <div className="relative cursor-pointer " >
          <div className="flex items-center space-x-2 bg-costume-primary-color p-2 rounded-lg hover:bg-gray-600 focus:outline-none">
            <img
              onError={()=>setImageError(true)}
              src={imageError ? defaultProfile : `${user?.profile_image}?${Date.now()}` as string}
              alt="Profile Icon" className="h-8 w-8 rounded-full" />
            <div className=" flex  flex-col text-sm">
              <span onClick={() => navigate(`/${role}/profile`)} className="font-semibold hidden md:block">{user?.name}</span>
              <span className='hidden md:block'>{user?.email}</span>
            </div>
            <Button
              onClick={() => setOpen(prevOpen => !prevOpen)}
              size="small">
              <ArrowDropDownIcon />
            </Button>
          </div>
          {open &&
            <div
              className={`absolute transition-all top-10  right-0 mt-2 w-48 bg-white z-20 text-gray-800 border border-gray-200 rounded-md shadow-lg  `}>
              <a
                onClick={() => navigate(`/${role}/profile`)}
                className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</a>
              <a onClick={() => setLogout(true)} className="block px-4 py-2 cursor-pointer text-sm hover:bg-gray-100">Logout</a>
            </div>}
        </div>

        <Modal
          open={logout}
          onClose={() => setLogout(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography sx={{ alignItems: "center", marginBottom: 4 }} id="modal-modal-title" variant="h6" component="h2">
              Are you sure want to logout?
            </Typography>
            <Stack
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                paddingX: "20px"
              }}
              direction="row">
              <Button
                onClick={handleLogout}
                sx={{
                  bgcolor: "#295782"
                }} variant="contained">Confirm</Button>
              <Button
                onClick={() => setLogout(false)}
                sx={{
                  border: "2px solid #000"
                }}
                variant="outlined">Cancel</Button>
            </Stack>
          </Box>
        </Modal>
        <Toaster></Toaster>
      </header>
      <Outlet></Outlet>
    </>

  )
}

export default DashboardHeader