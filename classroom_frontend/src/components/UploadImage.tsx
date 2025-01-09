import { Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import toast from 'react-hot-toast';
import { updateProfileImageOfStudent } from '../api/services/student.service';
import handleError from '../utils/error.handler';
import { useAppDispatch } from '../store/store';
import { addStudent } from '../store/slices/student.auth.slice';
import useRole from '../hooks/useRole';
import { updateProfileImageOfTeacher } from '../api/services/teacher.services';
import { addTeacher } from '../store/slices/teacher.auth.slice';



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface UploadImageProps {
    closeForm: ()=>void,
}

const UploadImage: React.FC<UploadImageProps> = ({ closeForm }) => {
    const role = useRole();
    const dispatch = useAppDispatch()

    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null)
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            setFile(files[0])
            setFileURL(URL.createObjectURL(files[0]))
        }
    }

    const handleSubmit = async ()=>{
        if(!file) return toast.error('Select an image to update the profile image.');
        const formData = new FormData();
        formData.append('profile_image',file)
       
        try {

            if(role == 'student'){
                const data = await updateProfileImageOfStudent(formData);
                dispatch(addStudent(data));
                
            }else if(role=='teacher'){
                const data = await updateProfileImageOfTeacher(formData);
                dispatch(addTeacher(data));
            }
            
            closeForm()
        } catch (error) {
            handleError(error)
        }

    }
    return (
        <div className='fixed max-h-screen inset-0 bg-black bg-opacity-30 flex justify-center items-center'>
            <div className='bg-white  w-full sm:w-3/4 p-10 rounded-lg space-y-5'>
                <div className='flex justify-between'>
                    <span className='text-costume-primary-color  font-bold text-2xl'>Change profile picture</span>
                    <div onClick={closeForm}
                        className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                        <CloseIcon fontSize='medium' color='error' />
                    </div>
                </div>

                <hr />
                <div className='flex space-x-5 items-center'>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<DriveFolderUploadIcon />}>
                        Upload file
                        <VisuallyHiddenInput
                            onChange={handleFileSelect}
                            accept='image/*' type="file" />
                    </Button>
                    
                    {file && <div >{file.name}</div>}
                </div>
                {fileURL &&
                    <div className='w-full  flex flex-col items-center justify-center'>
                        <img className='w-1/2  max-h-96 ' src={fileURL} alt="" />
                        <div
                            onClick={handleSubmit}
                            className='primary-btn mt-5'>Save</div>
                    </div>
                }

            </div>
        </div>
    )
}

export default UploadImage