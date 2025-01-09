
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { NavLink } from 'react-router-dom';

const ExamType = () => {
  
  return (
    <div className='w-3/4  flex flex-col  h-full p-4'>

      <div className=' w-full my-auto  flex flex-col gap-3'>
        <div className='text-2xl'>
          Choose any one of the ways to create exam.
        </div>
        {/* <div className='flex border-2 cursor-pointer hover:bg-opacity-50 bg-blue-100 items-center justify-between px-5 py-5 rounded-md'>
          <div>
            <h3 className='text-lg font-semibold'>1. Upload question paper</h3>
            <h6 className='text-gray-500'>Students will have to upload the answers.</h6>
          </div>
          <div className='flex gap-6 items-center'>
            <div ><FileUploadIcon fontSize='large' /></div>
          </div>
        </div> */}
        <NavLink to='../add_questions' relative='path'>
          <div className='flex border-2 cursor-pointer hover:bg-opacity-50 bg-yellow-100 items-center justify-between px-5 py-5 rounded-md'>
            <div>
              <h3 className='text-lg font-semibold'>1. Manually enter your questions</h3>
              <h6 className='text-gray-500'>Students has the option to either upload or type the answers.</h6>
            </div>
            <div>
              <KeyboardIcon fontSize='large' />
            </div>
          </div>
        </NavLink>

        {/* <div className='flex border-2 cursor-pointer hover:bg-opacity-50 bg-red-50 items-center justify-between px-5 py-5 rounded-md'>
          <div>
            <h3 className='text-lg font-semibold'>3. Choose from question bank</h3>
            <h6 className='text-red-500'>This feature is not available now!</h6>
          </div>

          <div><AccountBalanceIcon fontSize='large' /></div>
        </div> */}
      </div>
    </div>
  )
}

export default ExamType