import { MenuItem } from "@/types"
import menuItem_bg from '../assets/menuItem_bg.jpg'
import { QuantityButton } from "./QuantityButton";

type Props = {
    menuItem: MenuItem,
    addquantity: ()=> void;
    minusquantity: () => void;
    currentQty:number;
}

const MeuItem = ({menuItem, addquantity, minusquantity,currentQty}: Props) => {

    return (
        <>
            {/* <Card className="shadow-lg">
                <CardHeader className="m-0 p-0 mb-2">
                    <AspectRatio ratio={16/2}>
                        <img src={menuItem_bg} className="w-full h-full object-cover" />
                    </AspectRatio>
                </CardHeader>
                <CardContent className="font-bold p-4">
                    <CardTitle className="flex justify-between">
                        <span className="text-white-500">{menuItem.name}</span>  
                        
                        <QuantityButton addquantity={addquantity} minusquantity={minusquantity} qty={currentQty} />
                    </CardTitle>
                    S${(menuItem.price / 100).toFixed(2)}
                </CardContent>
            </Card> */}
            <div className="mb-4 border rounded-md shadow-sm hover:bg-green-50 pointer">
                <div className="flex justify-between min-h-[130px] min-w-[200px]">
                    <div className="relative px-4 py-2 flex-col">
                        <h2 className="text-xl font-bold">{menuItem.name}</h2>
                        <p className="text-sm text-grey-200">This is description</p>
                        <div className="absolute bottom-0 left-0 px-4 py-2">
                            <span className="text-gray-600 font-bold">S${(menuItem.price / 100).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex-col  relative sm:basis-1/3 md:basis-1/2 p-2">
                        <img src={menuItem_bg} className="w-full size-32 object-cover rounded-md shadow-sm" />
                        <div className="absolute bottom-0 right-0 p-3">
                            <QuantityButton addquantity={addquantity} minusquantity={minusquantity} qty={currentQty} />
                        </div>
                    </div>
                </div>
                
            </div>
        </>
        
    )
}

export default MeuItem