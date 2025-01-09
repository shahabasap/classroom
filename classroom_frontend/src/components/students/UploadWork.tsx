import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';
import handleError from '../../utils/error.handler';
import { submitWork } from '../../api/services/student.classroom.services';

import { useAppDispatch } from '../../store/store';
import { saveSubmittedWork } from '../../store/slices/student.classroom.slice';


type UploadWorkPropsType = {
    closeModal: (value: boolean) => void,
    workId: string,
    deadline: string,
}


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


const UploadWork: React.FC<UploadWorkPropsType> = ({ closeModal, workId, deadline }) => {
    const dispatch = useAppDispatch()
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');

    console.log(deadline)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selectedFile = files[0]
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                const url = URL.createObjectURL(selectedFile);
                setImageUrl(url);
            } else {
                setImageUrl('')
            }
        }
    }


    const handleSubmit = async () => {

        const deadlinems = new Date(deadline).getTime();
        const now = new Date().getTime();
        
        if (now >= deadlinems) return toast.error('Submission time is over!');

        if (!file) return toast.error("Please select a file before submitting the work.");
        const formData = new FormData();

        formData.append('workSubmission', file)
        try {
            const data = await submitWork(workId, formData);
            const payload = {
                workId,
                submissions: data
            }
            dispatch(saveSubmittedWork(payload));
            toast.success('Your answers has been submitted!');
            closeModal(false);
            console.log(data)
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <div className=' fixed flex items-center  overflow-hidden inset-0 bg-black bg-opacity-30 '>
            <div className='mx-auto bg-white max-h-[80vh]  overflow-auto flex flex-col rounded-lg p-5 md:w-3/4 lg:w-2/4 items-center '>
                <div className='flex justify-end w-full'>
                    <div
                        onClick={() => closeModal(false)}
                        className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                        <CloseIcon fontSize='medium' color='error' />
                    </div>
                </div>
                <div className='text-costume-primary-color font-semibold text-lg mb-2'>PUBLISH NEW MATERIAL</div>
                <hr className='border-2 w-full  mb-3' />
                <div className='mb-3'>Upload your answers in the form of pdf or images</div>
                <div className='flex  w-full items-center'>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<DriveFolderUploadIcon />}
                    >Upload file
                        <VisuallyHiddenInput
                            onChange={handleFileSelect}
                            accept='application/pdf, image/*' type="file" />
                    </Button>

                    {file && <div className='ml-2' >{file.name}</div>}
                </div>
                <div className='mt-2'>
                    <img
                        className='max-h-[30vh] aspect-auto '
                        src={imageUrl} alt="" />
                </div>
                <button
                    onClick={handleSubmit}
                    className='primary-btn mt-2 font-semibold'>PUBLISH</button>
            </div>
        </div>
    )
}

export default UploadWork