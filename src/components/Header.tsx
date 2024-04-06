import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import pixelfootphoto from '../../public/pixel_food_logo.png';

const Header = () => {
  return (
    <div className="border-b-2 border-b-white-800 py-3">
        <div className='container mx-auto flex justify-between items-center'>
            {/* <Link to="/" className="text-3xl font-bold tracking-tight text-green-500">
                Pixel Food
            </Link> */}
            <Link to="/">
                <img src={pixelfootphoto} alt="Pixel Food Delivery" className="font-bold w-[60px] h-[60px] object-cover" />
            </Link>
            <div className="md:hidden">
              <MobileNav />
            </div>
            <div className="hidden md:block">
              <MainNav/>
            </div>
        </div>
    </div>
  )
}

export default Header;


