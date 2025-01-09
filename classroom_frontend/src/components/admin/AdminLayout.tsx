
import AdminHeader from './components/AdminHeader'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './components/AdminSidebar'
import { Toaster } from 'react-hot-toast'

const AdminLayout = () => {
    return (
        <div className='bg-black flex  flex-col gap-3 min-h-screen   text-white ' >
            <AdminHeader />

            <div className='flex flex-col flex-grow overflow-auto '> {/* flex-grow */}
                <div className='flex flex-row flex-1'> {/* flex-grow*/}
                    <AdminSidebar /> {/* Adjust width as needed */}
                    <div className=' flex-1  flex flex-col '>
                        <div className=' flex-1   overflow-auto'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position='top-center'></Toaster>
        </div>
    )
}

export default AdminLayout