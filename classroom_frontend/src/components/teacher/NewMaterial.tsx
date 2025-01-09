
import React, { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import { uploadMaterial } from '../../api/services/teacher.classroom.services';
import handleError from '../../utils/error.handler';
import { useAppDispatch } from '../../store/store';
import { addNewMaterial } from '../../store/slices/teacher.classroom.slice';

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

type NewMaterialPropsType = {
    closeModal: (value: boolean) => void
}

const NewMaterial: React.FC<NewMaterialPropsType> = ({ closeModal }) => {

    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | null>(null);
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            setFile(files[0])
        }
    }

    const handelSubmit = async () => {

        if (!file) return toast.error('Please select a file before uploading');
        const title = titleRef?.current?.value;
        const description = descriptionRef?.current?.value;

        if (!title) {
            setTitleError(true);
            return;
        } else { setTitleError(false) }

        if (!description) {
            setDescriptionError(true)
            return
        } else { setDescriptionError(false) }

        const formData = new FormData();
        formData.append('material', file);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const data = await uploadMaterial(formData);

            dispatch(addNewMaterial(data))
            toast.success('File uploaded successfully!')
        } catch (error) {
            console.log('error', error)
            handleError(error)
        }
    }
    return (
        <div className=' fixed flex items-center  inset-0 bg-black bg-opacity-30'>
            <div className='bg-white w-full mx-auto md:w-3/4 lg:w-2/4 p-5 rounded-lg flex flex-col items-center'>
                <div className='flex justify-end w-full'>
                    <div
                        onClick={() => closeModal(false)}
                        className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                        <CloseIcon fontSize='medium' color='error' />
                    </div>
                </div>
                <div className='text-costume-primary-color font-semibold text-lg mb-2'>PUBLISH NEW MATERIAL</div>
                <hr className='border-2 w-full  mb-3' />
                <div className='w-full p-5 space-y-2'>
                    <TextField
                        error={titleError}
                        inputRef={titleRef}
                        helperText={titleError ? 'Title can not be empty' : "Enter a title"}
                        fullWidth
                        id="outlined-basic"
                        label="Title "
                        variant="outlined" />

                    <TextField
                        error={descriptionError}
                        inputRef={descriptionRef}
                        fullWidth
                        helperText={descriptionError ? 'Please provide a descripiton' : "Provide some details"}
                        id="outlined-multiline-flexible"
                        label={"Description"}
                        multiline
                        maxRows={4}
                    />

                    <div className='flex space-x-5 items-center'>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<DriveFolderUploadIcon />}
                        >Upload file
                            <VisuallyHiddenInput
                                onChange={handleFileSelect}
                                accept='application/pdf' type="file" />
                        </Button>

                        {file && <div >{file.name}</div>}
                    </div>
                    <div className='w-full flex '>
                        <button
                            onClick={handelSubmit}
                            className='primary-btn mx-auto '>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewMaterial