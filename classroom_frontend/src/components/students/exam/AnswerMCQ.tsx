import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'

import { useAppDispatch, useAppSelector } from '../../../store/store'
import { saveExamAnswer } from '../../../store/slices/persist.slice'

type AnswerMCQPropsType = {
    index: number,
    options: string[],
}
const AnswerMCQ: React.FC<AnswerMCQPropsType> = ({ index, options }) => {
    const dispatch = useAppDispatch()
    const answers = useAppSelector(state => state.persistedData.onGOingExam.studentAnswers);
    const onSelect = (value:string)=>{
        dispatch(saveExamAnswer({studentAnswer:value,questionIndex:index}))
    }
    return (
        <div className=' mt-2'> 
            <div className='p-2'>
                <div >
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">{`Options (Mark correct one)`}</FormLabel>
                        <RadioGroup
                            onChange={(e) => onSelect(e.target.value)}
                            defaultValue={answers[index]}
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group">
                            {options.map((option, index) =>
                                <div key={index}>
                                    <FormControlLabel
                                        value={option}
                                        control={<Radio />}
                                        label={
                                            <div className='bg-white'>
                                                <TextField
                                                    value={option}
                                                    size='small'
                                                />
                                            </div>} />
                                </div>
                            )}
                        </RadioGroup>
                    </FormControl>

                </div>
            </div>
        </div>
    )
}

export default AnswerMCQ