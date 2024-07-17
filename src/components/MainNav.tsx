import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './ui/button'
import { UsernameMenu } from './UsernameMenu';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, LogIn } from 'lucide-react';

const MainNav = () => {
    const {loginWithRedirect, isAuthenticated} = useAuth0();  

    const handleLogin = async () => {
        let returnTo = window.location.pathname;
        await loginWithRedirect({
            appState: { returnTo }
        });
    }

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
            ) : (
            <Button 
                variant='ghost'
                className='font-bold hover:text-green-500 hover:bg-white gap-2 items-center'
                onClick={handleLogin}
                >
                <LogIn size={15} /> Log In
            </Button>
            )
        }
        </span>
      </>
      
    )
};

export default MainNav;
