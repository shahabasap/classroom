import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material'
import React from 'react'
import { ExamQuestionType } from '../../../schema/exams.schema'

type MCQAnswerCardPropsType = {
    question: ExamQuestionType,
    index: number,
    answer: string
}

const MCQAnswerCard: React.FC<MCQAnswerCardPropsType> = ({ question, index, answer }) => {

    return (
        <div className=' border-2 rounded-md p-2 mt-2'>
            <div className='bg-white'>
                <div className='p-2 flex justify-between rounded-md'>
                    <div>
                        <span className='font-bold'>{`Question ${index + 1}  `} &nbsp;</span>
                        <span>MCQ</span>
                    </div>
                    <div>{`Max marks: ${question.mark}`}</div>
                </div>
                <div className='p-2 font-semibold break-words'>{question.question}</div>
            </div>
            <div className='p-2'>
                <div >
                    <h1> Student Answer: <span>{answer}</span> </h1>
                    <h1>Correct answer: <span>{question.answer}</span></h1>
                </div>
                <div >
                    <FormControl >
                        <FormLabel id="demo-radio-buttons-group-label">{`Options `}</FormLabel>
                        <RadioGroup
                            row
                            value={question.answer}
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group">
                            {question.options.map((option, index) =>
                                <div
                                    key={index}>
                                    <FormControlLabel
                                        value={option}
                                        control={<Radio />}
                                        label={
                                            <TextField
                                                color='success'
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

export default MCQAnswerCard