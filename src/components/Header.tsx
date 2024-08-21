import { useLocation, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";
import pixelfootphoto from '../assets/pixel_food_logo.png';
import { MapPin, Pencil, X } from "lucide-react";
import { useAppSelector } from "@/statemgmt/hooks";
import { HoverItem } from "@/animotion/AnimatedPage";
import { useDispatch } from "react-redux";
//import { resetProfile } from "@/statemgmt/profile/ProfileReducer";
import { EditLocationSelector, setIsEdit } from "@/statemgmt/location/EditLocationSlice";

const Header = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const dispatch = useDispatch();
    const profileState = useAppSelector((x) => x.profile);
    const isEditLocation = useAppSelector(EditLocationSelector);
    const navigation = useNavigate();

    const handleLocation = () => {
      //dispatch(resetProfile());
      //clear profile
      //navigation('/');
      dispatch(setIsEdit()); // to show model to edit location.
    } 

    const RenderSelectedAddress = () => {
      return (
        <>
          {(profileState.full_value !== '' && pathname.split('/')[1] === 'search') ? (
            <HoverItem>
              <div 
                className="flex flex-col items-center p-1 rounded-md bg-gray-50 lg:text-xl md:text-md sm:text-sm hover:cursor-pointer hover:bg-green-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocation();
                }}
                >
                <div className="flex items-center gap-2 justify-center ">
                  <MapPin className="text-green-500"/>
                  <label className="xs:text-xs text-sm font-bold cursor-pointer">{profileState.full_value}</label>
                  {isEditLocation.isEdit ? (
                    <X size={15} strokeWidth={2.5} />
                  ): (
                    <Pencil size={15} />
                  )}
                  
                </div>
              </div>
            </HoverItem>
          ) : null}
        </>
      )
    }

    const RenderLogo = () => {
      const handleLogo = () => {
        if(profileState.full_value === ''){
          navigation('/');
        }else{
          navigation(`/search/${profileState.lng}/${profileState.lat}`);
        }
      }

      return (
        <>
          <img 
              src={pixelfootphoto} 
              alt="Pixel Food Delivery" 
              className="font-bold w-[60px] h-[60px] object-cover cursor-pointer" 
              onClick={() => {
                handleLogo();
              }}
          />
        </>
      )
    }

    return (
      <>
      <div className="p-4 border-b-2 border-b-white-800 py-3 shadow-md">
        <div className="hidden md:block">
          <div className="flex md:justify-between items-center">
              <div className='flex items-center'>
                  {RenderLogo()}
              </div>
              <div className="flex item-center hidden md:block">
                <div>
                  {RenderSelectedAddress()}
                </div>
              </div>
              <div className="flex item-center">
                <MainNav/>
              </div>
          </div>
        </div>
        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <div className='flex items-center'>
                {RenderLogo()}
            </div>
            <div className="">
              <MobileNav />
            </div>
          </div>
        </div>
        <div className="md:hidden flex justify-center items-center">
          {RenderSelectedAddress()}
        </div>
      </div>
      </>
    )
}

export default Header;


