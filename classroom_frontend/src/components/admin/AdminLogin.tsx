import { useRef } from 'react'
import admin from '../../api/services/admin.services'
import handleError from '../../utils/error.handler'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const navigate = useNavigate()
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)

    const handleLogin = async () => {
 
       
        if (!emailRef.current?.value.trim() || !passwordRef.current?.value.trim()) return;

        const body = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        try {
            await admin.login(body)
            navigate('/admin/teachers')
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <div className='h-screen bg-neutral-900' >
            <div className='h-full  flex justify-center items-center'>
                <div className='text-white  w-2/4 justify-center'>

                    <div className='w-full flex flex-col gap-2'>
                        <p className='text-sm'>EMAIL ADDRESS</p>
                        <input
                            ref={emailRef}
                            className='w-full p-2 text-center bg-neutral-900 border-white border-4 rounded-md' type="text" />
                    </div>
                    <div className='w-full flex  flex-col gap-2 mt-8'>
                        <p className='text-sm'>PASSWORD</p>
                        <div className='w-full flex gap-4'>
                            <input
                                ref={passwordRef}
                                className='w-3/4 p-2 text-center  bg-neutral-900 border-white border-4 rounded-md' type="password" />
                            <button
                                onClick={handleLogin}
                                className='flex-grow border-white hover:bg-neutral-700 hover:text-purple-500 transition-colors border-4 rounded-md duration-300'>
                                LOGIN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin