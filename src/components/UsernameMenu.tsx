import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { CircleUserRound, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth0 } from '@auth0/auth0-react';

export const UsernameMenu = () => {

    const { user, logout } = useAuth0();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center px-2 font-bold hover:text-green-500 gap-2'>
                <CircleUserRound className='text-green-500'/>
                {user?.given_name}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className='p-1 py-2'>
                    <DropdownMenuItem>
                        <Link 
                            to='/manage_restaurant' 
                            className='font-bold hover:text-green-500'>
                                Manage Restaurant
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link 
                            to='/user_profile' 
                            className='font-bold hover:text-green-500'>
                                User Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button onClick={async () => await logout()} className='flex flex-1 font-bold text-red-400 bg-white-200 hover:bg-red-400 hover:text-white gap-2'>
                            <LogOut size={15} /> Log Out
                        </Button>
                    </DropdownMenuItem>
                </div>
                
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
