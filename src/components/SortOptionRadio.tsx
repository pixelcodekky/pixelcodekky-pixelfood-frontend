import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label';
import { ArrowDownUp } from 'lucide-react';

type Props = {
    onChange: (value: string) => void;
    sortOption: string;
}

const SORT_OPTIONS = [
    {
        label: "Best match",
        value: "bestmatch"
    },
    {
        label: "Delivery price",
        value: "deliveryPrice"
    },
    {
        label: "Estimated delivery time",
        value: "estimatedDeliveryTime"
    },
    {
        label: "Distance",
        value: "distance"
    },
]

const SortOptionRadio = ({onChange, sortOption}: Props) => {
    
    //const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label || SORT_OPTIONS[0].label;
    const selectedSort = SORT_OPTIONS.find((opt) => opt.value === sortOption) || SORT_OPTIONS[0];

    return (
        <>
            <div>
                <div className="flex items-center text-md font-semibold text-sm py-2 gap-1">
                        <ArrowDownUp size={18} strokeWidth={1} /> 
                        Sort By
                </div>
                <RadioGroup 
                    orientation='horizontal'
                    className='flex space-y-1'
                    defaultValue={selectedSort.value}
                    onValueChange={onChange}>
                    <div>
                        {SORT_OPTIONS.map((opt, idx) => {
                            const isSelected = selectedSort.value === opt.value ? true : false;
                            return (
                                <div key={idx} className="flex py-1 items-center space-x-2 hover:text-green-500">
                                    <RadioGroupItem className={`${isSelected ? "border-green-500 border-2" : ""}`} value={opt.value} id={`${idx}_${opt.value}`} />
                                    <Label className={` ${isSelected ? "text-green-500 font-bold" : ""}`} htmlFor={`${idx}_${opt.value}`}>{opt.label}</Label>
                                </div>
                            )
                            
                        })}
                        
                    </div>
                    
                </RadioGroup>
            </div>
            
        </>
    )
}

export default SortOptionRadio