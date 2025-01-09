import React from 'react';


interface InnerContent{
    title:string,
    description:string,
    image:string
}

const HomeLargeCards:React.FC<InnerContent> = ({title,description,image}) => {
  return (
<div className='border flex  shadow-xl p-6 rounded-lg text-base md:px-10 py-10 '>
  <div className='flex flex-col  gap-6 items-center sm:w-3/4'>
    <p className='text-2xl sm:text-4xl text-center  font-extrabold'>{title}</p>
    <p className='text-center'>{description}</p>
  </div>
  <div className=' overflow-hidden sm:w-1/4 md:max-h-52'>
    <img className=' hidden sm:block w-full h-full object-contain rounded-full' src={image} alt="" />
  </div>
</div>

  )
}

export default HomeLargeCards