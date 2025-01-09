import { Box, TextField } from '@mui/material'
import { useState } from 'react'
import { passwordMatch, validPassword } from '../utils/form.validations'
import { useNavigate, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import useRole from '../hooks/useRole'
import { forgotPasswordResetTeacher } from '../api/services/teacher.services'
import { forgotPasswordResetStudent } from '../api/services/student.service'
import handleError from '../utils/error.handler'

const ResetPassword = () => {
    const {resetPasswordToken} = useParams()
    const navigate = useNavigate();
    const role = useRole()
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    console.log(resetPasswordToken)

    if(!resetPasswordToken){
        return <div className='w-full h-full flex items-center justify-center bg-red-200'>
            <div className=' p-10'>
                <h1 className='text-2xl font-bold'> You are not a autherised user!</h1>
            </div>
        </div>
    }

    const validatePassword = () => {
        setPasswordError(validPassword(password))
    }

    const validateConfirmPassword = () => {
        setConfirmPasswordError(passwordMatch(password, confirmPassword))
    }

    const handleSubmit = async()=>{
        if(!password || !confirmPassword || passwordError || confirmPasswordError){
            toast.error('Enter valid datas')
            return
        }

        try {
            const body = {
                newPassword :password
            }
            role == 'teacher'?
            await forgotPasswordResetTeacher(resetPasswordToken,body):
            await forgotPasswordResetStudent(resetPasswordToken,body);
            toast.success('Password reset successfully');
            navigate(`/${role}/login`)
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <div className='w-full h-full flex items-center justify-center bg-gray-50'>
            <div className='w-full bg-white rounded-md p-5 md:w-1/2'>
                <div className='w-full flex flex-col items-center justify-center'>
                    <h1 className='text-lg font-bold text-costume-primary-color'>RESET PASSWORD</h1>
                    <hr className='border-2 w-full mt-3' />
                </div>
                <div className='mt-5 p-5 flex flex-col items-center gap-5 '>
                    <Box component='form' className='flex w-full flex-col gap-5'>
                        <TextField
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validatePassword}
                            error={passwordError}
                            placeholder='Password must be in this format: abc@123'
                            label={passwordError ? "Not a valid password" : 'Enter a password'}
                            type="password"
                            variant="outlined"
                            fullWidth
                            required />
                        <TextField
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                            label={confirmPasswordError ? "Passwords doesnot match" :"Confirm the new password"}
                            error={confirmPasswordError}
                            onBlur={validateConfirmPassword}
                            type="password"
                            variant="outlined"
                            fullWidth
                            required />
                    </Box>
                    <button 
                    onClick={handleSubmit}
                    className='primary-btn '>Submit</button>
                </div>

            </div>
            <Toaster></Toaster>
        </div>
    )
}

export default ResetPassword