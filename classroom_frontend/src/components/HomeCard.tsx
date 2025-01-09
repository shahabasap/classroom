import React from 'react'
import { FaUsers } from "react-icons/fa";

interface Content{
    count:string,
    text:string
}

const HomeCard:React.FC<Content> = ({count,text}) => {
  return (
        <div className=' bg-white min-w-24 max-w-40 md:min-w-40 border flex flex-col items-center  shadow-xl p-6 rounded-lg text-base'>
            <FaUsers className='text-costume-primary-color h-1/3 w-1/3'/>
            <h2 className='text-xl font-bold mb-1 '>{count} </h2>
            <h2 className='text-xl font-bold mb-1 '>{text} </h2>
        </div>
  )
}

export default HomeCard