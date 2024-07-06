import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { Clock, MapPin, Truck } from "lucide-react";
import { Badge } from "../ui/badge";
import DefaultImage from '../../assets/800x400.svg';


type Props = {
    restaurant: Restaurant;
};

const MainSearchCard = ({restaurant}: Props) => {
     
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
                            {/* {RenderDistance()} */}
                            {restaurant.distance !== undefined ? (
                                <>
                                <MapPin size={15} className="text-green-500"/>
                                <span>{`${restaurant.distance?.toFixed(1)}km`}</span>
                                </>
                                
                            ): null}
                            
                            
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