import { Restaurant } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CircleChevronDown, Clock, Dot, MapPin, Truck } from "lucide-react";
import { useAppSelector } from "@/statemgmt/hooks";
import { useGetGeocodingStaticMap } from "@/api/GeocodingApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { AnimatedPage } from "@/animotion/AnimatedPage";

type Props = {
    restaurant: Restaurant;
}

const RestaurantInfo = ({restaurant}: Props) => {
    const navigate = useNavigate();
    const [isMoreInfoOpen, setIsMoreInfoOpen] = useState<boolean>(false);
    const profileState = useAppSelector((x) => x.profile);
    const {isLoading, results} =  useGetGeocodingStaticMap(
                                    restaurant?.address[0] !== undefined ? restaurant?.address[0].lon.toString() : "",
                                    restaurant?.address[0] !== undefined ? restaurant?.address[0].lat.toString() : "");
        console.log(results);
    useEffect(() => {
        if(profileState.full_value === ''){
            navigate({
                pathname: `/`,
            })
        }
    },[]);

    return (
        <Card className="border-sla">
            <CardHeader>
                <CardTitle className='text-3xl font-bold tracking-tight'>
                    <div className="flex flex-row gap-5 items-center">
                        {restaurant.restaurantName}
                        {results === null ? (
                            null
                        ): (
                            <CircleChevronDown 
                            className="text-green-400 cursor-pointer hover:text-green-500" 
                            onClick={() => {setIsMoreInfoOpen(!!!isMoreInfoOpen)}}
                            />
                        )}
                        
                    </div>
                </CardTitle>
                <CardDescription className="">
                        <Collapsible
                            open={isMoreInfoOpen}
                            onOpenChange={setIsMoreInfoOpen}
                        >
                                <CollapsibleContent className="space-y-2 border-1 p-2 rounded-md shadow-md">
                                <AnimatedPage>
                                    <div className="flex flex-col py-1 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs">Address</span>
                                            <span className="text-xl">
                                                {`${
                                                    restaurant.address[0] !== undefined ?
                                                    restaurant.address[0].display_name : ""
                                                }`}</span> 
                                        </div>
                                        <div>
                                            {!isLoading && results !== null ? (
                                                <img src={`${results}`} className="rounded-md shadow-md" />
                                            )
                                            :!isLoading && results === null ? (
                                                <>

                                                </>
                                            ) : (
                                                <span>Loading...</span>
                                            )}
                                            
                                        </div>
                                    </div>
                                </AnimatedPage>
                                </CollapsibleContent>
                        </Collapsible>
                </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col'>
                <div className="flex flex-col py-2 gap-1">
                    <div className="flex flex-row gap-2 text-xs">
                        <div className="flex flex-row items-center gap-2">
                            <MapPin size={15} className="text-green-500"/>
                            {restaurant.distance !== undefined ? (`${restaurant.distance.toFixed(1)} km away | `) : null}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Truck size={14} strokeWidth="2" className="text-green-500"/>
                            {`S$ ${(restaurant.deliveryPrice/100).toFixed(2)} |`}</div>
                        <div className="flex flex-row items-center gap-2">
                            <Clock size={14} className="text-green-500" />
                            {` ${restaurant.estimatedDeliveryTime} min(s)`}
                        </div>
                    </div>
                </div>
                <div className="flex">
                    {restaurant.cuisines.map((d, idx) => (
                        <span className="flex text-xs font-bold text-gray-500" key={idx}>
                            <span>{d}</span>
                            {idx < restaurant.cuisines.length - 1 && <Dot/>}
                        </span>
                    ))}
                </div>
                
            </CardContent>
        </Card>
    )
}

export default RestaurantInfo

