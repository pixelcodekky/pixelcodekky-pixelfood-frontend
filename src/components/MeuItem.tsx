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
            <div className="mb-4 border rounded-md shadow-sm hover:bg-green-50 pointer">
                <div className="min-h-[110px] min-w-[200px] grid grid-cols-2">
                    <div className="relative px-4 py-2 flex-col">
                        <h2 className="text-l font-bold">{menuItem.name}</h2>
                        <p className="text-sm text-grey-200">This is description</p>
                        <div className="absolute bottom-0 left-0 px-4 py-2">
                            <span className="text-gray-600 font-bold">S${(menuItem.price / 100).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse relative p-2 w-full">
                        <img src={menuItem_bg} className="max-w-[160px] size-32 object-cover rounded-md shadow-sm" />
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