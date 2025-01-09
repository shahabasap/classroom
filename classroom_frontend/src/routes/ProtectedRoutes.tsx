import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';

import useRole from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';

interface DashboardProps {

}
const ProtectedRoutes: React.FC<DashboardProps> = () => {
    const role = useRole();
    const navigate = useNavigate()
    const { loading, activeUser, error } = useAuth(role);


    if (loading) return ;
    if (error) navigate('/');

    return activeUser ? <Outlet /> : <Navigate to='/' />
}

export default ProtectedRoutes