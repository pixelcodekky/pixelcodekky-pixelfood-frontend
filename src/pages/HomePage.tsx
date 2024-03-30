import landingImage from '../assets/landing.png';
import appDownloadImage from '../assets/appDownload.png';
import { SearchBar, SearchForm } from '@/components/SearchBar';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {

    const navigate = useNavigate();

    const handleSearchSubmit = (values: SearchForm) => {
        navigate({
            pathname: `/search/${values.searchQuery}`,
        })
    }

    return (
        <div className='flex flex-col pag-12'>
            <div className='md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16'>
                <h1 className="text-5xl font-bold tracking-tight text-green-600 text-gradient">
                    Welcome!
                </h1>
                {/* <span className="text-xl">Food is just on click</span> */}
                <SearchBar placeHolder='Find your location' onSubmit={handleSearchSubmit} />
            </div>
            <div className="grid md:grid-cols-2 gap-5 py-2">
                <div>
                    <img src={landingImage} />
                </div>
                <div className='flex flex-col items-center justify-center gap-4 text-center'>
                    <span className='font-bold text-3xl tracking-tighter'>
                        Order takeaway
                    </span>
                    <span>
                        Download PixelFood App for more...
                    </span>
                    <img src={appDownloadImage} />
                </div>
            </div>
        </div>
    )
}
