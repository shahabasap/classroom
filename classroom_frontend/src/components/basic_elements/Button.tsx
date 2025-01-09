import React from 'react'

interface ButtonProps{
    buttonClass:string,
    children:React.ReactNode
}

const AppButton: React.FC<ButtonProps> = ({buttonClass,children}) => {
  return (
    <button className={`whitespace-nowrap  rounded-md  text-sm  px-2 py-1 xs:py-2 xs:px-3 xs:text-md font-bold ${buttonClass}`}>{children}</button>
  )
}

export default AppButton