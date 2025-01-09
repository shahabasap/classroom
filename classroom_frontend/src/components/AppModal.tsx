import React, { Dispatch, SetStateAction } from 'react'
import CloseIcon from '@mui/icons-material/Close';

type AppModalPropsType = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    children: React.ReactNode
}

const AppModal: React.FC<AppModalPropsType> = ({ open, setOpen, children }) => {
    if (!open) return null;
    return (
        <>
            <div className='fixed inset-0 w-full h-screen flex  justify-center items-center  bg-black bg-opacity-30'>
                <div className='bg-white flex flex-col gap-4 p-3 rounded-md  w-2/3'>
                    <div className='flex w-full  justify-end'>
                        <div onClick={() => setOpen(false)} className='border hover:border-2 cursor-pointer hover:border-gray-400 p-1 rounded-md'>
                            <CloseIcon fontSize='medium' color='error' />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </>

    )
}

export default AppModal