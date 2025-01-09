
import Person3Icon from '@mui/icons-material/Person3';
import Face3Icon from '@mui/icons-material/Face3';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {

    const {pathname} = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => pathname === path;


    return (
        <div className='h-full rounded-lg  bg-neutral-900 w-1/6  m-2 mt-0'>
            <div className='flex flex-col gap-2 h-full   rounded-md  p-3'>
                <div className='space-y-6 mt-4 text-white font-semibold text-opacity-60 pl-3'>
                    {/* <div
                        onClick={() => navigate('/admin/dashboard')}
                        className={` ${isActive('/admin/dashboard') && 'text-white'} text-lg cursor-pointer items-center flex space-x-3 hover:text-white transition-colors duration-300`}>
                        <DashboardIcon fontSize='large' />
                        <p>Dashboard</p>
                    </div> */}
                    <div
                        onClick={() => navigate('/admin/teachers')}
                        className={` ${isActive('/admin/teachers') && 'text-white'} text-lg cursor-pointer items-center flex space-x-3 hover:text-white transition-colors duration-300`}>
                        <Person3Icon fontSize='large' />
                        <p>Teachers</p>
                    </div>
                    <div
                        onClick={() => navigate('/admin/students')}
                        className={` ${isActive('/admin/students') && 'text-white'} text-lg cursor-pointer items-center flex space-x-3 hover:text-white transition-colors duration-300`}>
                        <Face3Icon fontSize='large' />
                        <p>Students</p>
                    </div>
                    <div
                        onClick={() => navigate('/admin/classrooms')}
                        className={` ${isActive('/admin/classrooms') && 'text-white'} text-lg cursor-pointer items-center flex space-x-3 hover:text-white transition-colors duration-300`}>
                        <SchoolIcon fontSize='large' />
                        <p>Classrooms</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar