
import { Container, Paper, Typography, Box, TextField, Button, Stack, IconButton, InputAdornment } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';

import { NavLink, useNavigate } from 'react-router-dom';
import React from 'react';

import { forgotPasswordStudent, loginStudent } from '../api/services/student.service';
import { useAppDispatch } from '../store/store';
import { addStudent } from '../store/slices/student.auth.slice';
import { addTeacher } from '../store/slices/teacher.auth.slice';
import { forgotPasswordTeacher, loginTeacher, loginTeacherWithGoogle } from '../api/services/teacher.services';
import handleError from '../utils/error.handler';

import { useGoogleLogin, TokenResponse } from '@react-oauth/google';


import { loginStudentWithGoogle } from '../api/services/student.service';
import useRole from '../hooks/useRole';
import { validEmail } from '../utils/form.validations';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface LoginProps {

}

const Login: React.FC<LoginProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const role = useRole()
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [forgtoPassword, setForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (response: TokenResponse) => {

      console.log(response)
      try {
        const loginUser = role == 'student' ?
          await loginStudentWithGoogle(response) :
          await loginTeacherWithGoogle(response);

        role == 'student' ?
          dispatch(addStudent(loginUser)) :
          dispatch(addTeacher(loginUser));

        navigate(`/${role}/dashboard`);
      } catch (error) {

        handleError(error);
        navigate(`/${role}/login`)
      }
    },
    onError: (error) => {

      handleError(error);
      navigate(`/${role}/login`)
    }
  })

  const vaidateEmailInput = () => {
    const email = emailRef.current?.value;
    if (!email) {
      setEmailError(true)
    } else {
      setEmailError(false)
    }
  }

  const validatePasswordInput = () => {
    const password = passwordRef.current?.value;
    if (!password) {
      setPasswordError(true)
    } else {
      setPasswordError(false)
    }
  }

  const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForgotPassword(true)
  }

  const validateForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (emailError || passwordError) {
      return toast.error('Please enter valid datas')
    }
    try {

      if (role == 'student') {
        const data = await loginStudent({
          email: emailRef.current?.value as string,
          password: passwordRef.current?.value as string
        });
        console.log('response from student login: ', data)
        dispatch(addStudent(data))
      } else if (role == 'teacher') {
        const data = await loginTeacher({
          email: emailRef.current?.value as string,
          password: passwordRef.current?.value as string
        });
        console.log('response from teacher login: ', data)
        dispatch(addTeacher(data));
      }

      navigate(`/${role}/dashboard`);
    } catch (error: unknown) {
      handleError(error);
    }
  }

  const handleResetLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim() || validEmail(forgotPasswordEmail)) {
      setForgotPasswordEmailError(true)
      return
    }
    try {
      role == 'teacher' ?
        await forgotPasswordTeacher({ email: forgotPasswordEmail }) :
        await forgotPasswordStudent({ email: forgotPasswordEmail });

      setForgotPassword(false)
      toast.success('A password reset link has been send to your mail address')
    } catch (error) {
      handleError(error)
    }
  }
  return (
    <>
      <Container maxWidth="sm" className="flex items-center justify-center  min-h-screen p-4 ">
        <Paper elevation={3} className="p-6  rounded-lg shadow-lg w-full max-w-md">
          <Typography variant="h4" component="h1" className="mb-4 text-center text-costume-primary-color font-semibold">
            {role == "student" ? "Student" : "Teacher"} Login
          </Typography>
          <Divider></Divider>
          <Box component="form" noValidate autoComplete="off" className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">Enter registered email address</p>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              helperText={emailError ? "Enter a valid email address" : ""}
              error={emailError}
              onBlur={vaidateEmailInput}
              inputRef={emailRef}
              sx={{
                '& .MuiInputBase-root': {
                  height: '3rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.8rem',
                },
              }}
            />

            <p className="text-sm text-gray-600">Enter your password</p>
            <TextField
              label="Password"
              type={showPassword? "text":"password"}
              error={passwordError}
              helperText={passwordError ? "Enter a password" : ""}
              variant="outlined"
              fullWidth
              required
              inputRef={passwordRef}
              onBlur={validatePasswordInput}
              sx={{
                '& .MuiInputBase-root': {
                  height: '3rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.8rem',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={()=>setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <button
              onClick={handleForgotPassword}
              className='text-costume-primary-color text-sm cursor-pointer'>forgot password?</button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              className="py-2 bg-costume-primary-color"
              onClick={validateForm}
            >
              LOGIN
            </Button>
          </Box>
          <Stack spacing={1} className="mt-4">
            <Typography variant="body2" align="center">
              Dont have an account? <NavLink className="text-costume-primary-color hover:underline"
                to={`/${role}/signup`}>Register</NavLink>
            </Typography>
            <Divider>or</Divider>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<FaGoogle className='text-green-700' />}
              className="mt-2 text-green-700"
              onClick={() => googleLogin()}
            >
              Login with Google
            </Button>

          </Stack>
        </Paper>
      </Container>
      {forgtoPassword &&
        <div className='fixed inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center'>
          <div className='w-full bg-white flex flex-col  items-center rounded-md md:w-2/4 p-5'>
            <div className='flex w-full justify-end'>
              <div
                onClick={() => setForgotPassword(false)}
                className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                <CloseIcon fontSize='medium' color='error' />
              </div>
            </div>
            <div className='text-lg font-bold text-costume-primary-color'>FORGOT PASSWORD</div>
            <hr className='border w-full mt-2' />
            <p className='text-xl text-costume-primary-color font-semibold mt-5'>Enter your registered email address</p>
            <div className='w-full mt-5'>
              <TextField
                label={forgotPasswordEmailError ? 'Not a valid email address' : "Enter email address"}
                variant="outlined"
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                fullWidth

                error={forgotPasswordEmailError}
                required
              />
            </div>
            <button
              onClick={handleResetLink}
              className='primary-btn mt-5'>Get reset link</button>
          </div>
        </div>}
     
      <Footer></Footer>
    </>
  );
};

export default Login;