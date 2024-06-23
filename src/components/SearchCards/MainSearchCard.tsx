import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { Clock, Dot, Truck } from "lucide-react";
import { Badge } from "../ui/badge";
import DefaultImage from '../../assets/800x400.svg';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

type Props = {
    restaurant: Restaurant;
};

const MainSearchCard = ({restaurant}: Props) => {

    const RenderCarousal = () => {
        return (
            <Carousel orientation="horizontal" 
              className="md:w-full sm:w-full my-1">
                <div className="">
                    <CarouselContent className="mt-1 w-full">
                        {restaurant.cuisines.map((d, idx) => (
                            <>
                                <CarouselItem key={idx} className="lg:basis-1/4 md:basis-1/3 sm:basis-1/4">
                                    <div className="flex cursor:pointer">
                                        <div className="p-1 text-white flex item-center justify-center">
                                            {/* <span className="texdt-xs">{d}</span> */}
                                            <Badge className="bg-green-500">{d}</Badge>
                                        </div>
                                    </div>
                                </CarouselItem>
                            </>
                        ))}
                    </CarouselContent>
                </div>
                <CarouselPrevious className="-left-8" />
                <CarouselNext className="-right-8" />
            </Carousel>
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