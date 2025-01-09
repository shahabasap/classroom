
import AdminDashboardCard from './components/AdminDashboardCard'

const AdminDashboard = () => {
  return (
    <div className='text-black p-5 bg-neutral-900 rounded-lg m-2 mt-0  h-full'>
      <div className='flex justify-between mx-10'>
        <AdminDashboardCard title='Classrooms' count='50'/>
        <AdminDashboardCard title='Teachers' count='40'/>
        <AdminDashboardCard title='Students' count='1050'/>
      </div>
    </div>
  )
}

export default AdminDashboard