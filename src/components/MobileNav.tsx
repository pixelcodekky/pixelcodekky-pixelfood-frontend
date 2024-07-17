import { CircleUserRound, LogIn, Menu } from 'lucide-react';
import { Sheet, SheetTrigger,SheetContent, SheetTitle, SheetDescription } from './ui/sheet'
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import { MobileNavLinks } from './MobileNavLinks';

const MobileNav = () => {
    const {isAuthenticated, loginWithRedirect, user} = useAuth0();

    const handleLogin = async () => {
        let returnTo = window.location.pathname;
        await loginWithRedirect({
            appState: { returnTo }
        });
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Menu className='text-green-500'/>
            </SheetTrigger>
            <SheetContent>
                <SheetTitle>
                { isAuthenticated ? 
                    <span className='flex items-center font-bold gap-2'>
                        <CircleUserRound className='text-green-500' />
                        {user?.given_name}
                    </span> 
                    : 
                    <span>Welcome to Pixel Food</span>
                }
                </SheetTitle>
                <Separator />
                <SheetDescription className='flex flex-col gap-6 my-5'>
                    {isAuthenticated ? 
                        <MobileNavLinks/> 
                        : 
                        <Button onClick={handleLogin} className='flex-1 font-bold bg-orange-500'>
                            <LogIn size={15}/> Log In
                        </Button>
                    }
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav;
