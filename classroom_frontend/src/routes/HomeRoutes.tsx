import { Outlet, Navigate } from 'react-router-dom'

import useRole from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';

interface HomeRoutesProps {

}


const HomeRoutes: React.FC<HomeRoutesProps> = () => {
    
    const role = useRole();
    const { loading, activeUser, error } = useAuth(role);

    if (loading) return ;
    if (error) return <Outlet />;
   
    return activeUser ? <Navigate to={`/${role}/dashboard`} /> : <Outlet />
}

export default HomeRoutes   