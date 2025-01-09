import React from 'react'

type CardProps = {
  title: string,
  count:string
}

const AdminDashboardCard:React.FC<CardProps> = ({title,count}) => {
  return (
    <div className='w-1/4 bg-neutral-800 flex flex-col items-center p-3 rounded-lg text-white'>
      <p className='text-2xl font-semibold mb-4'>{title}</p>
      <p className='text-4xl font-bold'>{count}</p>
    </div>
  )
}

export default AdminDashboardCard 