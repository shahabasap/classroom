import React, { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import styled from '@emotion/styled';
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';
import handleError from '../../utils/error.handler';
import { publishNewWork } from '../../api/services/teacher.classroom.services';
import { useAppDispatch } from '../../store/store';
import { createWork } from '../../store/slices/teacher.classroom.slice';


type NewWorkPropsType = {
    closeModal: (value: boolean) => void
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
const NewWork: React.FC<NewWorkPropsType> = ({ closeModal }) => {
    const dispatch = useAppDispatch();
    const [isToday,setIsToday] = useState(false)
    const [topicError, setTopicError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [workTypeError, setWorkTypeError] = useState(false)
    const [markError, setMarkError] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [time, setTime] = useState<Dayjs | null>(null);
    const [workType, setWorkType] = useState('');
    const [maxMarks, setMaxMarks] = useState('0');
    const [imageUrl, setImageUrl] = useState('');

    const topicRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);

    const validateMark = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (/^[0-9]*$/.test(inputValue) && Number(inputValue) >= 0) {
            setMaxMarks(inputValue);
        } else {
            setMaxMarks('');
        }
    }

    const validateDate = (selectedDate: Dayjs | null) => {
        setDate(selectedDate);
        const formattedDate = selectedDate?.format("YYYY-MM-DD");
        const today = dayjs().format('YYYY-MM-DD');
        if(formattedDate == today){
            setIsToday(true)
        }else{setIsToday(false)}        
    }

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

    const handlePublish = async () => {
        const topic = topicRef.current?.value;
        const description = descriptionRef.current?.value;
        if (!file) return toast.error("Please select the question material for the work. It can be PDF files or images")

        if (!topic) {
            setTopicError(true)
            return
        } else { setTopicError(false) }

        if (!date) {
            setDateError(true)
            return;
        } else { setDateError(false) }

        if (!time) {
            setTimeError(true)
            return;
        } else { setTimeError(false) }

        if (!workType) {
            setWorkTypeError(true);
            return;
        } else { setWorkTypeError(false) }

        if (!maxMarks) {
            setMarkError(true)
            return
        } else { setMarkError(false) }

        const formData = new FormData();

        formData.append('work', file);
        formData.append('topic', topic);
        formData.append('description', description || '')
        formData.append('submissionDate', date.format('YYYY-MM-DD'))
        formData.append('submissionTime', time.format('HH:mm'))
        formData.append('maxMarks', maxMarks)
        formData.append('workType', workType);

        try {
            const data = await publishNewWork(formData);
            dispatch(createWork(data));
            closeModal(false)
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <div className=' fixed flex items-center  overflow-hidden inset-0 bg-black bg-opacity-30 '>
            <div className='mx-auto bg-white max-h-[80vh] overflow-auto flex flex-col rounded-lg p-5 md:w-3/4 lg:w-2/4 items-center '>
                <div className='flex justify-end w-full'>
                    <div
                        onClick={() => closeModal(false)}
                        className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                        <CloseIcon fontSize='medium' color='error' />
                    </div>
                </div>
                <div className='text-costume-primary-color font-semibold text-lg mb-2'>PUBLISH NEW MATERIAL</div>
                <hr className='border-2 w-full  mb-3' />
                <div className='w-full p-5 space-y-3'>
                    <TextField
                        inputRef={topicRef}
                        error={topicError}
                        fullWidth
                        id="outlined-basic"
                        label="Topic of the work* "
                        variant="outlined" />
                    <TextField
                        inputRef={descriptionRef}
                        fullWidth
                        id="outlined-multiline-flexible"
                        label={"Describtion"}
                        multiline
                        maxRows={4} />
                    <p>Submission deadline</p>
                    <div className='flex w-full'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'TimePicker']}>
                                <DatePicker
                                    disablePast
                                    value={date}
                                    onChange={validateDate}
                                    slotProps={{
                                        textField: {
                                            helperText: dateError ? 'Select a submission date' : '',
                                            sx: {
                                                '& .MuiFormHelperText-root': { color: 'red' }
                                            }
                                        },
                                    }}
                                    label="Submission date" />
                                <TimePicker
                                    disablePast={isToday}
                                    value={time}
                                    onChange={setTime}
                                    disabled={!date}
                                    slotProps={{
                                        textField: {
                                            helperText: timeError ? 'Select a submission time' : '',
                                            sx: {
                                                '& .MuiFormHelperText-root': { color: 'red' }
                                            }
                                        },
                                    }}
                                    label="Submission time" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className='flex space-x-4 '>
                        <FormControl >
                            <InputLabel id="demo-simple-select-helper-label">Work type</InputLabel>
                            <Select
                                error={workTypeError}
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={workType}
                                label="Age"
                                onChange={(e: SelectChangeEvent) => setWorkType(e.target.value)}>
                                <MenuItem value={'assignment'}>Assignment</MenuItem>
                                <MenuItem value={'homework'}>Homework</MenuItem>
                            </Select>
                            <FormHelperText>Type of the work</FormHelperText>
                        </FormControl>
                        <TextField
                            required
                            id="outlined-required"
                            error={markError}
                            label="Maximum marks"
                            defaultValue='0'
                            value={maxMarks}
                            onChange={validateMark}
                        />
                    </div>
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
                                accept='application/pdf, image/*' type="file" />
                        </Button>

                        {file && <div >{file.name}</div>}
                    </div>
                </div>
                <div>
                    <img
                        className='max-h-[30vh] aspect-auto '
                        src={imageUrl} alt="" />
                </div>
                <button
                    onClick={handlePublish}
                    className='primary-btn mt-2 font-semibold'>PUBLISH</button>
            </div>
        </div>
    )
}

export default NewWork