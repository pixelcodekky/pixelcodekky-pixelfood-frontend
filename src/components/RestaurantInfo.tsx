import { Restaurant } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dot } from "lucide-react";

type Props = {
    restaurant: Restaurant;
}

const RestaurantInfo = ({restaurant}: Props) => {

    return (
        <Card className="border-sla">
            <CardHeader>
                <CardTitle className='text-3xl font-bold tracking-tight'>
                    {restaurant.restaurantName}
                </CardTitle>
                <CardDescription>
                    {restaurant.distance !== undefined ? (`${restaurant.distance} km away | `) : null}
                    {`${restaurant.address[0].display_name}`}
                </CardDescription>
            </CardHeader>
            <CardContent className='flex'>
                {restaurant.cuisines.map((d, idx) => (
                    <span className="flex text-xs font-bold" key={idx}>
                        <span>{d}</span>
                        {idx < restaurant.cuisines.length - 1 && <Dot/>}
                    </span>
                ))}
            </CardContent>
        </Card>
    )
}

export default RestaurantInfo

