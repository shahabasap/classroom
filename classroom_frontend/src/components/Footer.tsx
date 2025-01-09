import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'; // Import icons

const Footer = () => {
  return (
    <footer className=' mt-10 py-6 border-t-2 border-gray-300'>
    <div className='container mx-auto px-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 align-middle lg:grid-cols-4 gap-8'>

        <div className='flex flex-row items-center mx-auto space-x-4 '>
          <a href='#' aria-label='Facebook'>
            <FaFacebook className='text-2xl hover:text-blue-500' />
          </a>
          <a href='#' aria-label='Instagram'>
            <FaInstagram className='text-2xl hover:text-pink-500' />
          </a>
          <a href='#' aria-label='Twitter'>
            <FaTwitter className='text-2xl hover:text-blue-400' />
          </a>
        </div>
        
        {/* Second Column: Text Lines */}
        <div className='space-y-2 text-center'>
          <p className='text-xl'>About Us</p>
          <p>Careers</p>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
        
        {/* Third Column: Text Lines */}
        <div className='space-y-2 text-center'>
          <p>Contact</p>
          <p>Support</p>
          <p>FAQs</p>
          <p>Help Center</p>
        </div>
        
        {/* Fourth Column: Text Lines */}
        <div className='space-y-2 text-center'>
          <p>Blog</p>
          <p>News</p>
          <p>Events</p>
          <p>Reviews</p>
        </div>
        

      </div>
      <div className='text-center w-full pb-4 mt-8'>
            <p className='text-gray-500'>
                &copy; {new Date().getFullYear()} GradeWeb. All rights reserved.
            </p>
        </div>
    </div>
  </footer>
  )
}

export default Footer