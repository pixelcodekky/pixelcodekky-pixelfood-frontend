import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { CircleUserRound, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import { useGetUser } from '@/api/MyUserApi';
import { Separator } from './ui/separator';
import { useEffect, useState } from 'react';

export const UsernameMenu = () => {

    const { user, logout, isLoading: isAuth0Loading } = useAuth0();
    const {isLoading, currentUser} = useGetUser();

    const [authLoading, setAuthLoading] = useState(false);

    useEffect(() => {
        setAuthLoading(isAuth0Loading || isLoading ? true : false);
    },[isAuth0Loading, isLoading]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger 
                className='flex items-center px-2 font-bold hover:text-green-500 gap-2'
                disabled={authLoading}
                >
                {authLoading ? (
                    <span className='bounce'>Loading...</span>
                ) : (
                    <>
                        <CircleUserRound className='text-green-500'/>
                        <span>
                            {currentUser?.name || currentUser?.email || user?.name}
                        </span>
                    </>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className='shadow-lg'>
                <div className='py-2'>
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
                        <Link 
                            to='/address_list' 
                            className='font-bold hover:text-green-500'>
                                Address
                        </Link>
                    </DropdownMenuItem>
                    <Separator className='my-3' />
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
