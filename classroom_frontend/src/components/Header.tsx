
import { Toaster } from 'react-hot-toast'
import Logo from './Logo'
import { Outlet } from 'react-router-dom'

const Header = () => {
  return <>
    <div className='h-full'>
      <header className='bg-costume-secondary-color  top-0 right-0 z-50 left-0 p-7 shadow-md w-full flex justify-between sm:px-4 md:px-6 lg:px-20 px-4'>
        <Logo />
        <div className='hidden sm:flex items-center justify-center text-lg'>
          <a href="#" className='mx-6'>Home</a>
          <a href="#" className='mx-6'>About</a>
          <a href="#" className='mx-6'>Contact</a>
        </div>
        <div></div>
        <Toaster></Toaster>
      </header>
      <Outlet></Outlet>
    </div>
  </>
}

export default Header