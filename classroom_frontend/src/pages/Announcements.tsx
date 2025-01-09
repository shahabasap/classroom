

import useGetAnnouncements from '../hooks/useGetAnnouncements';
import { useAppSelector } from '../store/store';
import useRole from '../hooks/useRole';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CampaignIcon from '@mui/icons-material/Campaign';
import { NotificationTypeEnum } from '../schema/announcements.schema';
import { convertToIST } from '../utils/indian.std.time';


const Announcements = () => {
    const role = useRole()
    useGetAnnouncements();

    const announcements = useAppSelector(state => role == 'teacher' ?
        state.teacherClassroom.announcements :
        state.studentClassroom.announcements);

    const getIcon = (type: string) => {
        switch (type) {
            case NotificationTypeEnum.EXAM:
                return <div className='text-red-500'><NoteAltIcon fontSize='medium' /></div>;
            case NotificationTypeEnum.WORK:
                return <div className='text-green-500'><MapsHomeWorkIcon fontSize='medium' /></div>
            case NotificationTypeEnum.MATERIAL:
                return <div className='text-blue-500'><MenuBookIcon fontSize='medium' /></div>
            default:
                return <div className='text-yellow-600'><CampaignIcon fontSize='medium' /></div>
        }
    }

    return (
        <div className='h-screen rounded-lg flex flex-col items-center border-2 shadow-md border-gray-200 w-full'>
            <div className='w-full flex flex-col items-center justify-center p-3'>
                <h1 className='font-bold text-lg '>ANNOUNCEMENTS</h1>
                <hr className='border w-full mt-3' />
            </div>
            <div className='w-full md:w-3/4 border-2 rounded-md overflow-auto  h-full p-5 flex flex-col flex-grow-1 gap-3 items-center'>
                {announcements.length > 0 && announcements.map(announcement =>
                    <div
                        key={announcement._id}
                        className='w-full  gap-3 bg-slate-50  rounded-md p-3 flex '>
                        {getIcon(announcement.type)}
                        <div className=''>
                            <h1 className='font-semibold'>{announcement.content}</h1>
                            <h4 className='text-gray-400 text-sm'>{convertToIST(announcement.createdAt)}</h4>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Announcements