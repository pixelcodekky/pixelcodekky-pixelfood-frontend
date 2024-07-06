import { Input } from './ui/input'
import { CircleMinus, CirclePlus, TrashIcon } from 'lucide-react'

type Props = {
    addquantity: ()=> void;
    minusquantity: () => void;
    qty: number;
}


export const QuantityButton = ({addquantity, minusquantity, qty = 0}: Props) => {

    return (
        <div className={`flex items-center ${qty === 0 ? "" : "bg-white"} rounded-lg h-7`}>
            <button
                    className={`font-bold hover:text-red-500 hover:pointer
                    ${qty === 0 ? 'hidden' : 'block'}
                    `}
                    disabled={(qty === 0)}
                    onClick={minusquantity}
                >
                    {qty === 1 ? <TrashIcon className='text-red-500' /> : <CircleMinus />}
            </button>
            {qty > 0 ? (
                <Input 
                    value={qty}
                    className='w-10 text-center border-none border-gray-300 rounded-md px-3 py-1 disabled transition duration-5500 ease-in-out transform'
                />
            ) : (
                null
            )}
            
            <button>
                <CirclePlus
                    className={`font-bold hover:text-green-500 ${qty === 0 ? "rounded-full text-black-400 bg-white" : ""} `} 
                    onClick={addquantity}
                />
            </button>
            
        </div>
    )
}
