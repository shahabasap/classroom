import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Question, QuestionTypeEnum, saveQuestion } from '../../../store/slices/persist.slice'
import { useAppDispatch } from '../../../store/store'

type MCQPropsType = {
    mark: string,
    questionType: QuestionTypeEnum,
    setMarkError: (value: boolean) => void,
    clearForm:()=>void;
}
const MCQ: React.FC<MCQPropsType> = ({ mark, setMarkError, questionType,clearForm }) => {
    const dispatch = useAppDispatch()
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['']);
    const [correctOption, setCorrectOption] = useState('');

    const [questionError, setQuestionError] = useState(false);
    const [optionsError, setOptionsError] = useState('');
    const [optionError, setOptionError] = useState(-1);


    const handleOptionInput = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value
        setOptions(newOptions)
    }

    const addOption = () => {
        if (options.length == 6) return
        if (options[options.length - 1].trim() === '') {
            setOptionError(options.length - 1);
            return;
        } else {
            setOptionError(-1)
        }
        setOptions(prevOptions => [...prevOptions, ''])
    }

    const validateQuestion = () => {
        console.log(options.length)

        if (!mark) {
            return setMarkError(true);
        } else { setMarkError(false) }

        if (!question) return setQuestionError(true)
        else setQuestionError(false)

        if (options.length <= 1 || options[1].trim() == '') {
            return setOptionsError("Atleast 2 options must be provided")
        } else { setOptionsError('') }

        if (!correctOption) {
            return setOptionsError('Please select a correct option')
        } else { setOptionsError('') }

        const payload: Question = {
            question,
            type: questionType,
            mark,
            options,
            answer: correctOption
        }
        dispatch(saveQuestion(payload));
        clearForm();
    }

    return (
        <div className=' mt-2'>
            <div className='bg-white'>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Type question here"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    multiline
                    size='small'
                    error={questionError}
                    fullWidth
                    maxRows={4} />
            </div>
            <div className='p-2'>
                <div >
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">{`Options (Mark correct one)`}</FormLabel>
                        <RadioGroup
                            onChange={(e) => setCorrectOption(e.target.value)}
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group">
                            {options.map((option, index) =>
                                <div key={index}>
                                    <FormControlLabel
                                        value={option}
                                        control={<Radio />}
                                        label={
                                            <div className='bg-white'><TextField
                                                error={(optionError != -1) && optionError == index}
                                                onChange={(e) => handleOptionInput(index, e.target.value)}
                                                size='small'
                                                placeholder={`option ${index + 1}`} />
                                            </div>} />
                                </div>)}
                        </RadioGroup>
                    </FormControl>
                    {optionsError && <div className='text-red-600 mt-2'>{optionsError}</div>}
                </div>
                <div>
                    <button
                        onClick={addOption}
                        className='text-gray-400 hover:text-black cursor-pointer'>Add option</button>
                </div>
            </div>
            <div className='w-full flex flex-col md:flex-row md:px-5 items-center justify-center mt-2'>
                <div className='w-full md:w-1/3'>
                    <button
                        onClick={validateQuestion}
                        className='success-btn w-full   mx-auto'>Save</button>
                </div>
            </div>
        </div>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export default MCQ