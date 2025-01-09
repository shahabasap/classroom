import { InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import TimerIcon from '@mui/icons-material/Timer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import dayjs, { Dayjs } from 'dayjs';


import { CreateExamBasicDetailsType, saveCreateExamBasicDetails } from '../../../store/slices/persist.slice';
import { millisecondsInIST } from '../../../utils/indian.std.time';
import { useAppDispatch } from '../../../store/store';
import { useNavigate } from 'react-router-dom';

const NewExam = () => {
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [title,setTitle] = useState('');
    const [instructions,setInstructions] = useState('')
    const [startMoment, setStartMoment] = useState<Dayjs | null>(null);
    const [endMoment, setEndMoment] = useState<Dayjs | null>(null);
    const [duration, setDuration] = useState('');
    
    const [startError,setStartError] = useState('');
    const [endError,setEndError] = useState('')
    const [durationError,setDurationError] = useState(false);
    const [titleError,setTitleError] = useState(false);
    
    const validateDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (/^[0-9]*$/.test(inputValue) && Number(inputValue) > 0) {
            setDuration(inputValue);
        } else {
            setDuration('');
        }
    }


    const onProceed = () => {
        
        let errorOccured = false;

        if(!title){
            setTitleError(true)
            errorOccured = true;
        } else setTitleError(false);

        if(!duration){
            setDurationError(true);
            errorOccured = true;
        } else setDurationError(false);
       
        if(!startMoment){
            setStartError('Start time can not be empty');
            errorOccured = true;
        } else setStartError('');

        if(!endMoment){
            setEndError('Deadline can not be empty');
            errorOccured = true
        } else setEndError('');

        if((startMoment && endMoment) && (startMoment.valueOf() >= endMoment?.valueOf())){
            errorOccured = true
            setEndError('Deadline can not be before start time')
        }
        const msIST = millisecondsInIST()
        
        if((startMoment ) && startMoment.valueOf() <= msIST){
            setStartError('Start time can not be in the past');
            errorOccured = true
        } 
        
        if(endMoment && endMoment.valueOf()<=msIST){
            setEndError('Can not start in the past');
            errorOccured = true
        } 
        
        if(errorOccured){
            console.log('error')
            return;
        } 
   
        const basicDetails:CreateExamBasicDetailsType = {
            title,
            instructions,
            duration: Number(duration),
            startTime: dayjs(startMoment).format('YYYY-MM-DDTHH:mm:ss'),
            lastTimeToStart: dayjs(endMoment).format('YYYY-MM-DDTHH:mm:ss'),
            questions:[]
        }

        dispatch(saveCreateExamBasicDetails(basicDetails))

        navigate('/teacher/classroom/exams/preview')
    }
    return (
        <div className=' w-full flex flex-col items-center p-5 '>
            <div className='text-lg font-bold text-costume-primary-color'>EXAM DETAILS</div>
            <hr className='border w-full mx-2 mt-3' />
            <div className='w-3/4 mt-4 flex flex-col gap-3'>
                <div>Basic details</div>
                <div className='bg-white'>
                    <TextField
                        placeholder='ex: Test paper - 2'
                        size='small'
                        onChange={(e)=>setTitle(e.target.value)}
                        error={titleError}
                        fullWidth
                        id="outlined-basic"
                        label="Title of the exam "
                        helperText={titleError && 'Title of the exam can not empty'}
                        variant="outlined" />

                </div>
                <div className='bg-white'>
                    <TextField
                        fullWidth
                        onChange={(e)=>setInstructions(e.target.value)}
                        size='small'
                        id="outlined-textarea"
                        label="Insructions for the exam"
                        placeholder="ex: Any malpractices caught will be result in fauilure of exam."
                        multiline
                    />
                </div>
                <div>Schedule details</div>
                <div className='flex flex-col '>
                    <div className=' bg-white w-fit '>
                        <TextField
                            id="input-with-icon-textfield"
                            label="Duration"
                            error={durationError}
                            helperText={durationError && `Duration can not be 0 or empty`}
                            value={duration}
                            onChange={validateDuration}
                            placeholder='minutes'
                            size='small'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TimerIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined" />
                    </div>
                    <div className='text-yellow-600 mt-3'>Student can start the exam anytime between start and end time</div>
                    <div className='flex gap-3'>
                        <div className='bg-white'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker
                                        disabled={duration ? false : true}
                                        disablePast
                                        onChange={setStartMoment}
                                        label="Starting time" />
                                </DemoContainer>
                            </LocalizationProvider>
                            { startError && <div className='text-sm text-red-600'>{startError}</div>}
                        </div>
                        <div className='bg-white'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker
                                        disabled={(startMoment && duration) ? false : true}
                                        disablePast
                                        onChange={setEndMoment}
                                        minDateTime={startMoment!}
                                        label="Last time to start exam" />
                                </DemoContainer>
                            </LocalizationProvider>
                            {endError && <div className='text-sm text-red-600'>{endError}</div>}
                        </div>
                    </div>
                    <div className='w-full flex justify-center mt-10'>
                        <button 
                        onClick={onProceed}
                        className='primary-btn py-2'>Preview</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NewExam