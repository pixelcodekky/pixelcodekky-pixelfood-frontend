import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth0 } from '@auth0/auth0-react';

export const MobileNavLinks = () => {
    const { logout } = useAuth0();
  return (
    <>
        <Link to='/order_status' className='flex bg-white items-center font-bold hover:text-green-500'>
          Order Status
        </Link>
        <Link to='/manage_restaurant' className='flex bg-white items-center font-bold hover:text-green-500'>
        Manage Restaurant
        </Link>
        <Link to='/user_profile' className='flex bg-white items-center font-bold hover:text-green-500'>
            User Profile
        </Link>
        <Button onClick={async () => await logout} className='flex items-center px-3 font-bold bg-red-400 hover:bg-red-500'>
            Log Out
        </Button>
    </>
  )
}
