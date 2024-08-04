import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';
import { Separator } from './ui/separator';

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
        <Link to='/address_list' className='flex bg-white items-center font-bold hover:text-green-500'>
            Address
        </Link>
        <Separator className='my-3' />
        <Button onClick={async () => await logout} className='flex flex-1 font-bold text-red-400 bg-white-200 hover:bg-red-400 hover:text-white gap-2'>
            <LogOut/> Log Out
        </Button>
    </>
  )
}
