
import PersonalDetails from './PersonalDetails'
import { useParams } from 'react-router-dom'

const ClassroomProfile = () => {
    const{student_id} = useParams();
    console.log('studentid: ',student_id)
  return (
    <div>
        <PersonalDetails/>
    </div>
  )
}

export default ClassroomProfile