import React from 'react';
import { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Container, Paper, Typography, Box, TextField, Button, Stack, IconButton, InputAdornment } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import Divider from '@mui/material/Divider';
import Footer from '../components/Footer';
import { CircularProgress } from '@mui/material';

import toast, { Toaster } from 'react-hot-toast';

import { useGoogleLogin } from '@react-oauth/google';
import { TokenResponse } from '@react-oauth/google';

import { validEmail, validName, validPassword, passwordMatch } from '../utils/form.validations';
import { registerStudent } from '../api/services/student.service';
import { registerTeacher } from '../api/services/teacher.services';
import handleError from '../utils/error.handler';
import { loginStudentWithGoogle } from '../api/services/student.service';
import { loginTeacherWithGoogle } from '../api/services/teacher.services';
import { useAppDispatch } from '../store/store';
import { registerUser } from '../store/slices/register.slice';
import { addStudent } from '../store/slices/student.auth.slice';
import { addTeacher } from '../store/slices/teacher.auth.slice';
import useRole from '../hooks/useRole';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



interface SignUpProps {
  
}

const Signup: React.FC<SignUpProps> = () => {

  const role = useRole()
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [emailError, setEmailError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const googleLogin = useGoogleLogin({

    onSuccess: async (response: TokenResponse) => {

      const loginUser = role == 'student' ?
        await loginStudentWithGoogle(response) :
        await loginTeacherWithGoogle(response);

      role == 'student' ?
        dispatch(addStudent({
          email: loginUser.email,
          _id: loginUser.id,
          name: loginUser.name,
          profile_image: loginUser.profile_image,
          classrooms:[],
          createdAt:'',
          updateAt:'',
          blocked:false,
          verified:true
        })) :
        dispatch(addTeacher({
          email: loginUser.email,
          _id: loginUser.id,
          name: loginUser.name,
          profile_image: loginUser.profile_image,
          classrooms:[],
          createdAt:'',
          blocked:false,
          verified:true
        }));

      navigate(`/${role}/dashboard`);
    },
    onError: (error) => {
      handleError(error)
    }
  })

  const validateEmail = () => {
    setEmailError(validEmail(emailRef.current?.value));
  }

  const validateName = () => {
    setNameError(validName(nameRef.current?.value))
  };

  const validatePassword = () => {
    setPasswordError(validPassword(passwordRef.current?.value))
  }

  const vaidateConfirmPassword = () => {
    setConfirmPasswordError(passwordMatch(passwordRef.current?.value, confirmPasswordRef.current?.value))
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!emailRef.current?.value ||
      !nameRef.current?.value ||
      !passwordRef.current?.value ||
      !confirmPasswordRef.current?.value
    ) return toast.error('You need to give us all the details buddy! Fill all the fields')

    if (emailError || passwordError || confirmPasswordError || nameError) return toast.error("Entered datas are not valid")

    const user = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      confirmPassword: confirmPasswordRef.current?.value
    }

    try {
      setLoading(true);
      const response = (role == 'student')
        ? await registerStudent(user)
        : await registerTeacher(user);

      dispatch(registerUser({
        email: response.email,
        id: response.id,
        role:role
      }));

      navigate(`/${role}/verify`);

    } catch (error) {
      console.log(error)
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Container maxWidth="sm" className="flex items-center justify-center min-h-screen p-4 ">
        <Paper elevation={3} className="p-6 rounded-lg shadow-lg w-full max-w-md">
          <Typography variant="h4" component="h1" className="mb-4 text-center text-costume-primary-color font-semibold">
            {role == "student" ? "Student" : "Teacher"} Signup
          </Typography>
          <Divider></Divider>
          {loading &&
            <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
          <Box component="form" noValidate autoComplete="off" className="mt-4 space-y-4">

            <TextField
              label={emailError ? "Its EMAIL! not a post mail. Type something valid" : "Email address"}
              variant="outlined"
              fullWidth
              error={emailError}
             
              required
              inputRef={emailRef}
              onBlur={validateEmail}
              sx={{
                '& .MuiInputBase-root': {
                  height: '3rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                },
              }}
            />
            
            <TextField
              label={nameError ? "Is this even a name? Give us real stuff" : "Full name"}
              variant="outlined"
              fullWidth
              required
              error={nameError}
             
              inputRef={nameRef}
              onBlur={validateName}
              sx={{
                '& .MuiInputBase-root': {
                  height: '3rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.8rem',
                },
              }}
            />
           
            <TextField
              label={passwordError ? "This ain't a proper password" : "Password"}
              type={showPassword? "text":"password"}
              variant="outlined"
              fullWidth
              inputRef={passwordRef}
              error={passwordError}
              helperText={passwordError ? "Should contain atleast 6 letters, 1 number, 1 special charactor(#?!@$%^&*-)" : ""}
              onBlur={validatePassword}
              required
              sx={{
                '& .MuiInputBase-root': {
                  height: '3rem',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.8rem',
                },}}
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
                }}/>
            <TextField
              label={confirmPasswordError ? "You mispelled your password! Check it again" : "Retype password"}
             
              variant="outlined"
              type={showConfirmPassword? "text":"password"}
              fullWidth
              required
              error={confirmPasswordError}
              inputRef={confirmPasswordRef}
              onBlur={vaidateConfirmPassword}
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
                      onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}/>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              className="py-2 bg-costume-primary-color"
              onClick={handleSubmit}
            >
              SignUp
            </Button>
          </Box>
          <Stack spacing={1} className="mt-4">
            <Typography variant="body2" align="center">
              Already have an account?
              <NavLink to={`/${role}/login`} className="text-costume-primary-color hover:underline">
                Login</NavLink>
            </Typography>
            <Divider>or</Divider>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<FaGoogle className='text-green-700' />}
              className="mt-2 text-green-700"
              onClick={() => googleLogin()}
            >
              Continue wiht google
            </Button>
          </Stack>
        </Paper>
        <Toaster position='bottom-right'></Toaster>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default Signup;

