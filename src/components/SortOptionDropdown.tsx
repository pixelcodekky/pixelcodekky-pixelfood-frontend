import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

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
    }
]

const SortOptionDropdown = ({onChange, sortOption}: Props) => {

    const selectedSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label || SORT_OPTIONS[0].label;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <Button variant='outline' className="w-full">
                    sort by: {selectedSortLabel}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {SORT_OPTIONS.map((opt, idx) => (
                    <DropdownMenuItem key={idx} className='cursor-pointer' onClick={() => onChange(opt.value)}>
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SortOptionDropdown