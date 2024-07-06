import { cuisineList } from '@/config/restaurant_options_config';
import { Label } from './ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Button } from './ui/button';

type Props = {
    onChange: (cuisines: string[]) => void;
    selectedCuisines: string[];
    isExpanded: boolean;
    onExpandedClick: () => void;
    className?: string;
}

const CuisineFilter = ({onChange, selectedCuisines, isExpanded, onExpandedClick, className}: Props) => {
    
    const handleCuisinesReset = () => {
        onChange([]);
    }

    const handleCuisinesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const clickedCuisine = event.target.value;
        const isChecked = event.target.checked;
        const newCuisinesList = isChecked ? [...selectedCuisines, clickedCuisine] : selectedCuisines.filter((cuisine) => cuisine !== clickedCuisine);
        onChange(newCuisinesList);
    }
    
    return (
        <>
            <div className="space-y-2 flex flex-col">
                <div className='flex justify-between'>
                    <div className="text-md font-semibold text-2xl">Cuisines</div>
                    <div 
                        onClick={handleCuisinesReset} 
                        className="text-sm font-semibold mb-2 underline cursor-pointer">
                            Reset
                    </div>
                </div>
                <div className='item-center flex flex-row justify-center'>
                    <Button onClick={onExpandedClick} className='bg-white-500 text-black hover:bg-green-600 hover:text-white max-w-[200px] mb-5'>
                        {isExpanded ? (
                            <span className='flex flex-row items-center'>
                                View Less <ChevronUp />
                            </span>
                        ) : (
                            <span className='flex flex-row items-center'>
                                View More <ChevronDown />
                            </span>
                        )}
                    </Button>
                </div>
                <div className={`${className} `}>
                    {cuisineList.slice(0, isExpanded ? cuisineList.length : 7).map((cuisine, index) => {
                        const isSelected = selectedCuisines.includes(cuisine);
                        return (
                            <div key={index} className='flex mb-2'>
                                <input id={`cuisine_${cuisine}`} 
                                type='checkbox' 
                                className='hidden'
                                value={cuisine}
                                checked={isSelected}
                                onChange={handleCuisinesChange} />
                                <Label htmlFor={`cuisine_${cuisine}`} 
                                className={`flex flex-1 items-center cursor-pointer rounded-full px-4 py-2 font-semibold ${isSelected ? "border border-green-600 text-green-600" : "border border-slate-400"}`}>
                                    {cuisine}
                                    {/* {isSelected && <Check size={13} strokeWidth={5} />} */}
                                </Label>
                            </div>
                        )
                    })}
                </div>
                
                
            </div>
        </>
    )
}

export default CuisineFilter