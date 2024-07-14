import { Restaurant } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CircleChevronDown, CircleChevronUp, Clock, Dot, MapPin, MapPinned, Truck } from "lucide-react";
import { useAppSelector } from "@/statemgmt/hooks";
import { getGeocodingStaticMapAPI } from "@/api/GeocodingApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { AccordionAnimation } from "@/animotion/AnimatedPage";

type Props = {
    restaurant: Restaurant;
}

const RestaurantInfo = ({restaurant}: Props) => {
    const navigate = useNavigate();
    const [isMoreInfoOpen, setIsMoreInfoOpen] = useState<boolean>(false);
    const profileState = useAppSelector((x) => x.profile);
    const [staticMap,setStaticMap] = useState("");
    const [showinMap, setShowInMap] = useState("");
    
    useEffect(() => {
        if(profileState.full_value === ''){
            navigate({
                pathname: `/`,
            })
        }
    },[]);

    useEffect(() => {
        const load = async () => {
            if(restaurant.address[0] !== undefined){
                const address = restaurant.address[0];
                let resStaticMap = await getGeocodingStaticMapAPI(address.lon.toString(),address.lat.toString());
                if(resStaticMap !== ""){
                    setStaticMap(resStaticMap);
                    //build show in map
                    setShowInMap(buildLinkString());
                }
            }
        }
        load();
    },[restaurant])

    const buildLinkString = () => {
        const address = restaurant.address[0];
        const provider = 'https://www.google.com/maps?q=';
        const coordination = `${address.lat},${address.lon}`;
        return `${provider}${coordination}`;
    }

    return (
        <Card className="border-sla">
            <CardHeader>
                <CardTitle className='text-3xl font-bold tracking-tight'>
                    <div className="flex flex-row gap-5 items-center">
                        {restaurant.restaurantName}
                        {staticMap === "" ? (
                            null
                        ): isMoreInfoOpen ? (
                            <CircleChevronUp 
                                className="text-green-400 cursor-pointer hover:text-green-500" 
                                onClick={() => {setIsMoreInfoOpen(!!!isMoreInfoOpen)}}
                                />
                        ) : (
                            <CircleChevronDown 
                                className="text-green-400 cursor-pointer hover:text-green-500" 
                                onClick={() => {setIsMoreInfoOpen(!!!isMoreInfoOpen)}}
                                />
                        )}
                        
                    </div>
                </CardTitle>
                <CardDescription>
                    <Collapsible
                        open={isMoreInfoOpen}
                        onOpenChange={setIsMoreInfoOpen}
                    >
                        <div className="flex">
                            <CollapsibleContent className="space-y-2 border-1 p-2 rounded-md shadow-md">
                                <AccordionAnimation>
                                    <div className="flex flex-col py-1 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs">Address</span>
                                            <span className="md:text-xl">
                                                {`${
                                                    restaurant.address[0] !== undefined ?
                                                    restaurant.address[0].display_name : ""
                                                }`}</span> 
                                        </div>
                                        <div className="flex flex-row gap-1 items-center py-2">
                                            <MapPinned size={15} />
                                            <a 
                                                href={`${showinMap}`} 
                                                target="_blank" 
                                                className="hover:underline hover:text-green-500 font-bold">
                                                    <span>Show in Map</span>
                                            </a> 
                                        </div>
                                        <div className="flex flex-col w-full items-center">
                                            {staticMap !== "" ? (
                                                <img src={staticMap} className="rounded-md shadow-md" />
                                            ):null}
                                        </div>
                                    </div>
                                </AccordionAnimation>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>
                </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col'>
                <div className="flex flex-col py-2 gap-1">
                    <div className="flex flex-row gap-2 text-xs">
                        <div className="flex flex-row items-center gap-1">
                            <MapPin size={14} className="text-green-500"/>
                            {restaurant.distance !== undefined ? (`${restaurant.distance.toFixed(1)}km away | `) : null}
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
                <div className="flex flex-row">
                    {restaurant.cuisines.map((d, idx) => (
                        <div className="flex text-xs font-bold text-gray-500" key={idx}>
                            <span>{d}</span>
                            {idx < restaurant.cuisines.length - 1 && <Dot size={18}/>}
                        </div>
                    ))}
                </div>
                
            </CardContent>
        </Card>
    )
}

export default RestaurantInfo

