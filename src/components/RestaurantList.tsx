import { RestaurantSearchResponse } from '@/types'
import SearchResultCard from './SearchResultCard';
import PaginationSelector from './PaginationSelector';

type Props = {
    data: RestaurantSearchResponse;
    setPage: (page:number) => void;
}

const RestaurantList = ({data, setPage}: Props) => {
    return (
        <>
          <div className="flex flex-col">
            <ul className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
              {data?.data.map((d, index) => (
                <li key={index}>
                  <SearchResultCard restaurant={d} key={index} />
                </li>
              ))}
            </ul>
          </div>
          <PaginationSelector 
            page={data?.pagination.page || 0} 
            pages={data?.pagination.pages || 0} 
            onPageChange={setPage}/>
        </>
    )
}

export default RestaurantList