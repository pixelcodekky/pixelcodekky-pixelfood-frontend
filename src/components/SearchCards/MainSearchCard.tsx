import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import { Clock, Dot, Truck } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

type Props = {
    restaurant: Restaurant;
};

const MainSearchCard = ({restaurant}: Props) => {
  return (
    <Link to={`/detail/${restaurant._id}`} className='gap-4 mb-3' >
            <Card>
                <CardHeader className="p-0 max-h-[90px] border">
                    <div className="">
                    <img src={restaurant.imageUrl} alt={restaurant.restaurantName} className="w-full h-[90ox] object-contain" />
                    </div>
                </CardHeader>
                <CardContent className="p-2 ">
                    <div className="flex flex-col bg-white-500">
                        <div className="flex">
                            <h3 className="text-xl font-bold tracking-tight mb-2 w-full">
                                {restaurant.restaurantName}
                            </h3>
                        </div>
                        <div className="flex mb-2">
                            {restaurant.cuisines.slice(0, 3).map((d, idx) => (
                                // <span className="flex" key={idx}>
                                //     {idx < restaurant.cuisines.slice(0, 2).length - 1 && <Dot/>}
                                // </span>
                                <Badge key={idx} className="bg-green-500 mr-1">{d}</Badge>
                            ))}
                            {/* {restaurant.cuisines.length > 2 && (
                                <span className="flex">
                                    <Dot/>
                                </span>
                            )} */}
                        </div>
                        <div className="flex gap-2 flex-row">
                            <div className="flex items-center gap-1 font-bold">
                                <Clock size={15} className="text-green-500" />
                                {restaurant.estimatedDeliveryTime} mins
                            </div>
                            <div className="flex items-center gap-1 font-bold">
                                <Truck size={15}  className="text-green-500"/>
                                S$ {(restaurant.deliveryPrice / 100).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div>
                
                <div id='card-content' className="grid md:grid-cols-2 gap-2">
                    
                    
                </div>
            </div>
        </Link>
  )
}

export default MainSearchCard