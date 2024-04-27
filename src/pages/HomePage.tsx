import landingImage from '../assets/landing.png';
import appDownloadImage from '../assets/appDownload.png';
import { SearchBar, SearchForm } from '@/components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import mainimg1 from '../assets/main_1.png';
import mainimg2 from '../assets/main_2.png';
import { LucideTruck, MapPinned, SquareMousePointer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const HomePage = () => {

    const navigate = useNavigate();

    //const hostedCountry = import.meta.env.VITE_HOSTED_COUNTRY;

    const handleSearchSubmit = (values: SearchForm) => {
        navigate({
            pathname: `/search/${values.searchQuery}`,
        })
    }

    return (
        <>
        <div className='flex flex-col pag-12'>
            <div className='md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16'>
                <h1 className="text-5xl font-bold tracking-tight text-green-600 text-gradient">
                    {/* {hostedCountry ? `Welcome ${hostedCountry}!` : `Welcome!`} */}
                    Explore near you!
                </h1>
                {/* <span className="text-xl">Food is just on click</span> */}
                <SearchBar placeHolder='Your Location, City name etc' onSubmit={handleSearchSubmit} />
            </div>
        </div>
        {/* Start Content */}
        <div className='py-5'>
            <div className='min-h-[280px] grid gap-4 lg:md:grid-cols-3'>
                <div className='gap-5 item-center py-20'>
                    <div className='flex flex-row justify-center'>
                        <MapPinned size={48} strokeWidth={1}/>
                    </div>
                    <div className='text-3xl text-center font-bold flex flex-row justify-center'>
                        <span className='rounded-full'>
                            Select Location
                        </span> 
                    </div>
                </div>
                <div className='gap-5 item-center py-20'>
                    <div className='flex flex-row justify-center'>
                        <SquareMousePointer size={48} strokeWidth={1}/>
                    </div>
                    <div className='text-3xl text-center font-bold'>
                        <span className='rounded-full'>Choose Restaurant & Order</span> 
                    </div>
                </div>
                <div className='gap-5 item-center py-20'>
                    <div className='flex flex-row justify-center'>
                        <LucideTruck  size={48} strokeWidth={1}/>
                    </div>
                    <div className='text-3xl text-center font-bold'>
                        <span className='rounded-full'>Delivered!</span> 
                    </div>
                </div>
            </div>
            <div className='gap-5 py-5 grid md:grid-cols-2'>
                <div className='flex-none w-30'>
                    <h2 className='text-3xl font-bold py-2'>
                        Everything you order, delivered
                    </h2>
                    <p className='text-m gap-2'>
                        Get a nice  meal at your doorstep with foodie. Order now and enjoy the convenience of having your favorite
                        Foodie connects restaurants with customers in real time.

                        Forget the grocery store rush and say goodbye to takeout limitations.  
                        Here, everything you order gets delivered straight to your door.  
                        Craving a specific ingredient for a homemade masterpiece? Need a last-minute dinner party 
                        spread? No problem.  We deliver it all, ensuring convenience and satisfaction with every 
                        order.
                    </p>
                </div>
                <div className='flex-none w-70'>
                    <img src={mainimg1} className='object-cover rounded shadow-md' />
                </div>
            </div>
            <Separator />
            <div className='grid md:grid-cols-2 gap-5 py-5'>
                <div>
                    <img src={mainimg2} className='object-cover rounded shadow-md' />
                </div>
                <div>
                    <h2 className='text-3xl font-bold py-2'>
                        Deliver with less, Eat more
                    </h2>
                    <h3 className='text-xl font-bold'>
                    Feeling overwhelmed? Short on time?
                    </h3>
                    <p className='text-m gap-2 py-3'>
                    Ditch the stress of cooking tonight 
                    and let us deliver more! We've got a wider selection than ever before, 
                    so indulge in the flavors you crave and focus on what truly matters.  
                    Whether it's catching up with loved ones, tackling that project, or simply relaxing, 
                    we'll take care of dinner you deserve a break, and a delicious one at that.  
                    Explore our extensive menu and "Deliver with Less, Eat More" tonight!
                    </p>
                </div>
                
            </div>
        </div>
         {/* End Content */}
         {/*Start Download App */}
        <div className="grid md:grid-cols-2 gap-5 py-5">
                <div className='container'>
                    <AspectRatio ratio={16/10}> 
                        <img src={landingImage} className='object-cover rounded' />
                    </AspectRatio>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 text-center'>
                    <span className='font-bold text-3xl tracking-tighter'>
                        Order takeaway
                    </span>
                    <span>
                        Download PixelFood App (Coming Soon) for more...
                    </span>
                    <img src={appDownloadImage} />
                </div>
        </div>
         {/*End Download App */}
        </>
    )
}
