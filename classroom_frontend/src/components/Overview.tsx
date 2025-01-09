
import Button from './basic_elements/Button'
import student from "../assets/images/boys_on_books.jpg"
import teaching from "../assets/images/sir_teaching.jpg"
import teacherStudent from "../assets/images/teacher_teaching.jpg";
import HomeCard from './HomeCard';
import { Link } from 'react-router-dom';
const Overview = () => {
  return (
    <div className=' sm:pt-10 align-bottom p-0 m-0   flex lg:mx-28 sm:mx-5 xs:mx-5'>
        <div className='md:w-2/4 w-full p-0 m-0  flex flex-col items-center gap-7'>
            <p className='text-3xl text-center xs:text-4xl sm:text-6xl  font-extrabold'>
                A classroom beyond your
                imaginations.
            </p>
            <p className='text-center'>
            Discover a world of learning at your fingertips with our comprehensive educational
                platform.you're a student, educator, or lifelong learner, our site offers 
                an extensive collection of resources
            </p>
            <div className='flex  gap-5'>
                <Link to="/teacher/login">
                    <Button  buttonClass='primary-button'>I am a Teacher</Button>
                </Link>
                
                <Link to="/student/login">
                    <Button  buttonClass='primary-button'>I am a Student</Button>
                </Link>
                
            </div>
            <div className='flex justify-between w-full'>
                <HomeCard count="100+" text="classrooms"></HomeCard>
                <HomeCard count="50+" text="Teachers"></HomeCard>
                <HomeCard count="100+" text="classrooms"></HomeCard>
            </div>
        </div>
        <div className='hidden sm:flex md:w-2/4'>
            <div className='hidden sm:block lg:w-1/2'>
                <img src={teaching} alt="photo.jpg"></img>
                <img className='hidden lg:block' src={student} alt="photo.jpg" />
            </div>
            <div className='hidden lg:block'>
                <img src={teacherStudent} alt="photo.jpg" />
            </div>
        </div>
    </div>
  )
}

export default Overview