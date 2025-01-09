import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import MCQ from './MCQ';
import { QuestionTypeEnum } from '../../../store/slices/persist.slice';
import DescriptiveQuestion from './DescriptiveQuestion';

type QuestionCardPropsType = {
    questionCount: number,

}

const QuestionCard: React.FC<QuestionCardPropsType> = ({ questionCount }) => {
    const [questionType, setQuestionType] = useState<QuestionTypeEnum>();

    const [mark, setMark] = useState('');
    const [markError, setMarkError] = useState(false)

    console.log(mark)

    const validateMark = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (/^[0-9]*$/.test(inputValue) && Number(inputValue) > 0) {
            setMark(inputValue);
        } else {
            setMark('');
        }
    }

    const clearForm = () => {
        setMark('');
        setQuestionType(undefined)
    }

    return (

        <div className='border-2 rounded-md p-3 flex flex-col gap-3 bg-blue-50'>
            <div className=' flex w-full justify-between items-center  p-1'>
                <p className='font-bold'>{`Question ${questionCount}`}</p>
                <div className='bg-white'>
                    <TextField
                        error={markError}
                        value={mark}
                        onChange={validateMark}
                        id="outlined-basic"
                        label={markError ? 'Enter a mark' : 'Marks'}
                        size='small'
                        variant="outlined" />
                </div>
            </div>
            <div>
                <div className='bg-white'>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Question type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={questionType}
                            // defaultValue='Select question type'
                            onChange={(e) => setQuestionType(e.target.value as QuestionTypeEnum)}
                            size='small'
                            label="Question type">
                            <MenuItem value={QuestionTypeEnum.MCQ}>MCQ</MenuItem>
                            <MenuItem value={QuestionTypeEnum.DESCRIPTIVE}>Descriptive</MenuItem>
                            {/* <MenuItem value={QuestionTypeEnum.TOF}>True or false</MenuItem>
                            <MenuItem value={QuestionTypeEnum.FILL_BLANKS}>Fill in the blanks</MenuItem> */}
                        </Select>
                    </FormControl>
                </div>
                <hr className='border w-full mt-2' />
                {questionType == 'mcq' ?
                    <MCQ mark={mark}
                        clearForm={clearForm}
                        questionType={questionType}
                        setMarkError={setMarkError} /> :
                    questionType == 'descriptive' ?
                        <DescriptiveQuestion mark={mark}
                            setMarkError={setMarkError}
                            clearForm={clearForm} /> : ''}
            </div>
        </div>
    )
}

export default QuestionCard