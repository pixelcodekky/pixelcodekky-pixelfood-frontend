import { MenuItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CirclePlus, Plus } from "lucide-react";
import menuItem_bg from '../assets/menuItem_bg.jpg'
import { AspectRatio } from "./ui/aspect-ratio";

type Props = {
    menuItem: MenuItem,
    addToCart: ()=> void;
}

const MeuItem = ({menuItem, addToCart}: Props) => {

    return (
        <>
            <Card className="shadow-lg">
                <CardHeader className="m-0 p-0 mb-2">
                    <AspectRatio ratio={16/2}>
                        <img src={menuItem_bg} className="w-full h-full object-cover" />
                    </AspectRatio>
                </CardHeader>
                <CardContent className="font-bold p-4">
                    <CardTitle className="flex justify-between">
                        <span className="text-white-500">{menuItem.name}</span>  
                        <CirclePlus
                            className="hover:text-green-500"  
                            onClick={addToCart} size={36} />
                    </CardTitle>
                    S${(menuItem.price / 100).toFixed(2)}
                </CardContent>
            </Card>
            
        </>
        
    )
}

export default MeuItem