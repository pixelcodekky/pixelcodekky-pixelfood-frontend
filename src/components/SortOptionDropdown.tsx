import { Badge, Link } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Label } from "./ui/label";

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

const SortOptionDropdown = ({onChange, sortOption}: Props) => {

    const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label || SORT_OPTIONS[0].label;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                {/* <label  className="w-full">
                    sort by: {selectedSortLabel}
                </label> */}
                <div>
                    <Label className={buttonVariants({variant: "outline"})}>Sort By: {selectedSortLabel}</Label>
                </div>
                
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div>
                    {SORT_OPTIONS.map((opt, idx) => (
                        <DropdownMenuItem key={idx} className='cursor-pointer' onClick={() => onChange(opt.value)}>
                            {opt.label}
                        </DropdownMenuItem>
                    ))}
                </div>
                
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SortOptionDropdown