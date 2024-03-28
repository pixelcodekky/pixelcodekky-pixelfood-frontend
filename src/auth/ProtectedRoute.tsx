import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return <LoadingSkeleton/>;

    if(isAuthenticated)
        return  <Outlet/>

    return <Navigate to='/' replace/>
}
