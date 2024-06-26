import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { CircleUserRound } from 'lucide-react'
import { Link } from 'react-router-dom';
import { Separator } from '@radix-ui/react-separator';
import { Button } from './ui/button';
import { useAuth0 } from '@auth0/auth0-react';

export const UsernameMenu = () => {

    const { user, logout } = useAuth0();

    return (
    <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center px-3 font-bold hover:text-green-500 gap-2'>
            <CircleUserRound className='text-green-500'/>
            {user?.given_name}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
                <Link 
                    to='/manage_restaurant' 
                    className='font-bold hover:text-orange-500'>
                        Manage Restaurant
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Link 
                    to='/user_profile' 
                    className='font-bold hover:text-orange-500'>
                        User Profile
                </Link>
            </DropdownMenuItem>

            <Separator/>
            <DropdownMenuItem>
                <Button onClick={async () => await logout()} className='flex flex-1 font-bold bg-orange-500'>
                    Log Out
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    )
}
