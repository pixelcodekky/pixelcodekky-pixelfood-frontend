import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './ui/button'
import { UsernameMenu } from './UsernameMenu';
import { Link } from 'react-router-dom';
import { FileSpreadsheet } from 'lucide-react';

const MainNav = () => {
    const {loginWithRedirect, isAuthenticated} = useAuth0();
  return (
    <>
      <span className='flex space-x-2 items-center'>
        {isAuthenticated ? (
          <>
            <Link to='/order_status' className='font-bold hover:text-green-500'>
              {/* Order Status */}
              <FileSpreadsheet className='text-white-500 hover:text-green-500' />
            </Link>
            <UsernameMenu />
          </>
          
          
          ) : 
        <Button 
            variant='ghost'
            className='font-bold hover:text-green-500 hover:bg-white'
            onClick={async () => await loginWithRedirect()}
            >
            Log In
        </Button>
      }
      </span>
    </>
    
  )
};

export default MainNav;
