import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import React from 'react'
import { Question } from '../../../store/slices/persist.slice'

type ViewMCQPropsType = {
    question: Question,
    count: number
}

const ViewMCQ: React.FC<ViewMCQPropsType> = ({ question, count }) => {

    return (
        <div className=' border-2 rounded-md p-2 mt-2'>
            <div className='bg-white'>
                <div className='p-2 flex justify-between rounded-md'>
                    <div>
                        <span className='font-bold'>{`Question ${count + 1}  `} &nbsp;</span>
                        <span>MCQ</span>
                    </div>
                    <div>{`Max marks: ${question.mark}`}</div>
                </div>
                <div className='p-2 font-semibold break-words'>{question.question}</div>
            </div>
            <div className='p-2'>
                <div >
                    <FormControl >
                        <FormLabel id="demo-radio-buttons-group-label">{`Options `}</FormLabel>
                        <RadioGroup
                            row
                            value={question.answer}
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group">
                            {question.options.map((option, index) =>
                                <div className='bg-white' key={index}>
                                    <FormControlLabel
                                        value={option}
                                        control={<Radio />}
                                        label={
                                            <TextField
                                                disabled
                                                value={option}
                                                size='small'
                                                sx={{
                                                    '& .MuiInputBase-input.Mui-disabled': {
                                                        WebkitTextFillColor: 'black',
                                                        color: 'black',
                                                    },
                                                }}
                                                placeholder={`option ${index + 1}`} />
                                        } />
                                </div>
                            )}
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
        </div>
    )
}

export default ViewMCQ