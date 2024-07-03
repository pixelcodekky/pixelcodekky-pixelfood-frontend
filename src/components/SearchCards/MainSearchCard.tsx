import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { Clock, Dot, MapPin, Truck } from "lucide-react";
import { Badge } from "../ui/badge";
import DefaultImage from '../../assets/800x400.svg';
import { useAppSelector } from "@/statemgmt/hooks";
import { haversineDistance } from '@/common/Utilities';

type Props = {
    restaurant: Restaurant;
};

const MainSearchCard = ({restaurant}: Props) => {

    let profileState = useAppSelector((x) => x.profile);
     
    const RenderDistance = () => {
        let result = '';
        
        if(profileState.full_value != '' && restaurant.address[0] !== undefined){
            let pointA: [number, number] = [profileState.lng, profileState.lat];
            let pointB: [number, number] = [restaurant.address[0].lon, restaurant.address[0].lat ]
            let distance = haversineDistance(pointA, pointB);
            result = `${distance.toFixed(0)}`
        }

        return (
            <>
                {result !== '' ? (
                    <>
                        <MapPin size={13} className="text-green-500"/>
                        <span>{`${result} km`}</span>
                    </>
                ) : null}
            </>
        )
    }

    const RenderCrusines = () => {
        return (
            <>
                <div className="flex flex-start gap-2">
                    {restaurant.cuisines.slice(0, 2).map((d, index) => (
                        <Badge variant={"outline"} key={index} className="border-green-400">{d}</Badge>
                    ))}
                </div>
            </>
        )
    }


    return (
        <>
        <div className="min-w-48 shadow-xl">
            <div className="flex flex-col border rounded-md">
                <div className="h-[90px] border flex">
                    <img src={DefaultImage} alt={restaurant.restaurantName} className="w-full shadow-sm object-cover" />
                </div>
                <div className="p-2 h-[100px]">
                    <div className="mb-2">
                    <Link to={`/detail/${restaurant._id}`}>
                        <h1 className="text-xl hover:underline">{restaurant.restaurantName}</h1>
                    </Link>
                    </div>
                    <div className="flex gap-2 flex-row">
                        <div className="flex items-center gap-1 font-bold text-xs">
                            <Clock size={14} className="text-green-500" />
                            {restaurant.estimatedDeliveryTime} mins
                        </div>
                        <div className="flex items-center gap-1 font-bold text-xs">
                            <Truck size={15}  className="text-green-500"/>
                            S$ {(restaurant.deliveryPrice / 100).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1 font-bold text-xs">
                            {RenderDistance()}
                        </div>
                    </div>
                    <div className="my-2">
                        {RenderCrusines()}
                    </div>
                    
                </div>
            </div>    
        </div>
             
            
        </>
        
    )
}

export default MainSearchCard