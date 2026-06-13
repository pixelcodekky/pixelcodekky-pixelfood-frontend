import { Restaurant } from "@/types";
import PopupSearchCard from "./SearchCards/PopupSearchCard";
import MainSearchCard from "./SearchCards/MainSearchCard";

type Props = {
    restaurant: Restaurant;
    isPopup?:boolean;
};

const SearchResultCard = ({restaurant, isPopup = false}: Props) => {

   if(isPopup) return <PopupSearchCard />

   return <MainSearchCard restaurant={restaurant} />


   
}

export default SearchResultCard 