import React, { useState } from 'react'
import useRole from '../hooks/useRole'
import { useAppSelector } from '../store/store';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import UploadImage from '../components/UploadImage';
import { Toaster } from 'react-hot-toast';
// import EditCareers from '../components/EditCareers';
import defaultProfile from '../assets/images/defaultProfile.jpg'

const Profile: React.FC = () => {
    const [imageError, setImageError] = useState(false)
    const role = useRole();
    const [openUploadImage, setOpenUploadImage] = useState<boolean>(false);
    // const [openCareers, setOpenCareers] = useState<boolean>(false)

    const user = useAppSelector(state => role == 'teacher' ?
        state.teacherAuth.user :
        state.studentAuth.user);
    return (
        <div className=' md:flex flex-row  justify-center  my-16 m-0 rounded-2xl sm:mx-5 md:mx-16 border-solid border-2   '>
            <div className=' flex md:w-1/3 p-10    justify-center image items-start'>
                <div className='relative'>
                    <img
                        onError={() => setImageError(true)}
                        src={imageError ? defaultProfile : `${user?.profile_image}?${new Date().getTime()}` as string}
                        alt=""
                        className=" rounded-3xl w-60 h-60   object-cover "
                    />
                    <div onClick={() => setOpenUploadImage(true)}
                        className='absolute bg-white p-1 rounded-md flex items-center justify-center  bottom-2 right-2'>
                        <AddAPhotoIcon />
                    </div>
                </div>
            </div>

            <div className='w-2/3 mx-auto  py-10 '>
                <div className="flow-root  px-5">
                    <div className='text-lg text-costume-primary-color font-semibold mb-3'>Personal Details</div>
                    <hr className='border-2' />
                    <dl className=" divide-y divide-gray-200 text-sm">
                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 ">
                            <dt className="font-medium text-gray-900">Name</dt>
                            <dd className="text-gray-700 sm:col-span-2">{user?.name}</dd>
                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 ">
                            <dt className="font-medium text-gray-900">Email</dt>
                            <dd className="text-gray-700 sm:col-span-2">{user?.email}</dd>
                        </div>

                        {/* <div className="grid grid-cols-1 gap-1  py-3 sm:grid-cols-3 ">
                            <dt className="font-medium text-gray-900 ">Address</dt>
                            <div className='flex justify-between sm:col-span-2'>
                                <dd className="text-red-400 ">Not set</dd>
                                <p className='underline text-costume-primary-color cursor-pointer'>edit</p>
                            </div>
                        </div> */}
                    </dl>
                </div>
                {/* <div className="flow-root px-5 mt-3">
                    <div className=' flex justify-between mb-3 text-costume-primary-color items-center'>
                        <p className='text-lg font-semibold'>Career Details</p>
                        <p className='font-normal text-sm cursor-pointer mr-3'>Add+</p>
                    </div> */}
                {/* <hr className='border-2'/> */}
                {/* <dl className=" divide-y divide-gray-200 text-sm">
                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 ">
                            <dt className="font-medium text-gray-900">Name</dt>
                            <dd className="text-gray-700 sm:col-span-2">{user?.name}</dd>
                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 ">
                            <dt className="font-medium text-gray-900">Email</dt>
                            <dd className="text-gray-700 sm:col-span-2">{user?.email}</dd>
                        </div>

                        <div className="grid grid-cols-1 gap-1  py-3 sm:grid-cols-3 ">
                            <dt className="font-medium text-gray-900 ">Address</dt>
                            <div className='flex justify-between sm:col-span-2'>
                                <dd className="text-red-400 ">Not set</dd>
                                <p className='underline text-costume-primary-color cursor-pointer'>edit</p>
                            </div>
                        </div>
                    </dl> */}
                {/* </div> */}
            </div>
            {openUploadImage && <UploadImage closeForm={() => setOpenUploadImage(false)} />}
            {/* {openCareers && <EditCareers/>} */}
            <Toaster></Toaster>
        </div>
    )
}

export default Profile