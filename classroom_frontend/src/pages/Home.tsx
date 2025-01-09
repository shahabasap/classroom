
import Overview from '../components/Overview'
import HomeLargeCards from '../components/HomeLargeCards'
import { onlineClassroomDesc } from '../assets/texts'
import onlineClassroom from "../assets/images/online_teaching.jpg";
import examStudent from "../assets/images/exam-student.jpg";
import materialsImage from "../assets/images/girls_on_books.jpg";
import Footer from '../components/Footer'

const Home = () => {

  
  return (
    <>
      <div className='pt-20'>
        <Overview/>
        <div className='flex flex-col gap-7 lg:mx-28 sm:mx-5 xs:mx-5 mt-20'>
          <HomeLargeCards title='ONLINE CLASSROOMS' description={onlineClassroomDesc} image={onlineClassroom}/>
          <HomeLargeCards title='ONLINE EXAMS' description={onlineClassroomDesc} image={examStudent}/>
          <HomeLargeCards title='CLASSROOM MATERIALS' description={onlineClassroomDesc} image={materialsImage}/>
        </div>
      </div>
      <Footer></Footer>
    </>
    
  )
}

export default Home