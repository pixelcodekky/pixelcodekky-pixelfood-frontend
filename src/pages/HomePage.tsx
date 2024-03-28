import landingImage from '../assets/landing.png';
import appDownloadImage from '../assets/appDownload.png';

export const HomePage = () => {
  return (
    <div className='flex flex-col pag-12'>
        <div className='bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16'>
            <h1 className="text-5xl font-bold tracking-tight text-orange-600">
                Welcome to the Pixel Food!
            </h1>
            <span className="text-xl">Food is just on click</span>
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
