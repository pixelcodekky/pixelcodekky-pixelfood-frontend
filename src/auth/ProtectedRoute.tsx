import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Header from '@/components/Header';

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    
    if (isLoading){
        return(
            <>
                <Header />
                <div className='container mx-auto flex-1 py-3'>
                    <LoadingSkeleton/>
                </div>
            </>
            
        ) 
    };

    if(isAuthenticated)
        return <Outlet/>

    return <Navigate to='/' replace/>
}
