/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';

import Footer from '../components/Footer';
import { TextField,Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector,useAppDispatch } from '../store/store';
import { addStudent, } from '../store/slices/student.auth.slice';
import { verifyStudent,resendOTP } from '../api/services/student.service';
import toast,{ Toaster }  from 'react-hot-toast';
import { verifyTeacher } from '../api/services/teacher.services';
import handleError from '../utils/error.handler';
import useRole from '../hooks/useRole';

export interface OTPProps{
  
}


const OTP:React.FC<OTPProps> = () => {

  const navigate =useNavigate();
  const dispatch = useAppDispatch();
  const role = useRole()
  const [otp,setOtp] = useState('');
  const [time,setTime] = useState(60);

  useEffect(()=>{
    const updateTime = ()=>{
      setTime(prevTime=>prevTime-1);
    }
    let timerId:number|undefined;

    if(time>0){
       timerId = setInterval(updateTime,1000);
    }
   
    if(time==0) clearInterval(timerId)
    return ()=>clearInterval(timerId)
  },[time])
  
  const userEmail = useAppSelector(state=>state.userRegistry.email);
  const userId = useAppSelector(state=>state.userRegistry.id);

  const handleResend = async ()=>{
    try {

      if(userId && userEmail){

        await resendOTP({userId,userEmail});

        toast.success('Alright, Check your mailbox and dont ask again!',{
          duration: 5000 
        })
        
        setTime(60)

      }else{
        toast.error("Are you even registered? Go back and give us your details first!.",{
          duration: 5000 
        })
      }
      
    } catch (error) {
      handleError(error)
    }
  }
  
  const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault()
    if(!otp) return toast.error('Where is your OTP?');
    if(!userId) return toast.error("Oops! It looks like you have not registered yet.")
    try {
     
      const response = role =="student" ?
        await verifyStudent({otp,userId}) :
        await verifyTeacher({otp,userId})
      
      console.log(response);
      
      dispatch(addStudent({
        email:response.email,
        name:response.name,
        _id:userId,
        blocked:false,
        verified:true,
        classrooms:[],
        createdAt:'',
        updateAt:'',
        profile_image:''
      }))

      navigate(`/${role}/dashboard`)

    } catch (error:any) {
      toast.error(error.response.data)
    }
  }
  
  return (
    <>
    <div className="flex items-center justify-center my-24 p-4">
      <div className="bg-white flex flex-col items-center p-8 rounded-xl border border-gray-200 shadow-xl max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-costume-primary-color" >VEIRFY YOUR EMAIL</h1>
        <p className="text-center mb-6 text-gray-600">
          An OTP has been sent to your email address {userEmail}. Please enter it here.
        </p>
        <TextField 
        size='small'  
        id="outlined-basic" 
        fullWidth label="Enter otp" 
        variant="outlined" 
        onChange={(e)=>setOtp(e.target.value.replace(/\D/g, ''))}
        value={otp}
        sx={{
          '& .MuiInputLabel-root': {
            fontSize: '0.9rem',
          },
        }}
        />
        <Button
        onClick={handleSubmit} 
        fullWidth 
        className='bg-costume-primary-color' 
        variant="contained">Verify</Button>
        <hr className="border-t-2 border-gray-300 w-full" />
        
        <p className='text-costume-primary-color text-xl'>{`00:${time<10 ? '0'+time : time}`}</p>
        <button disabled={time!==0}
        onClick={handleResend} 
        className={`bg-gray-100 p-2 rounded-md text-${time==0 ? 
        "black hover:bg-costume-primary-color cursor-pointer hover:text-white " : "white"}`}>Resend OTP</button>
        
      </div>
    </div>
    <Toaster position='top-right'></Toaster>
    <Footer></Footer>
   </>
  )
    
  
}

export default OTP