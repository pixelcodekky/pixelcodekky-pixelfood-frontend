import { RestaurantSearchResponse } from '@/types'
import SearchResultCard from './SearchResultCard';
import PaginationSelector from './PaginationSelector';
import {motion} from 'framer-motion';

type Props = {
    data: RestaurantSearchResponse;
    setPage: (page:number) => void;
}

const gridSectionVariants = {
  hidden: { opacity: 0},
  show:{
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
}

const SearchResultGrid = {
  hidden: {opacity: 0},
  show: {opacity: 1}
}

const RestaurantList = ({data, setPage}: Props) => {
    return (
        <>
        <motion.section
          variants={gridSectionVariants}
          initial='hidden'
          animate='show'>
          <div className="flex flex-col min-h-[400px]">
            <ul className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
              {data?.data.map((d, index) => (
                <li key={index}>
                  <motion.div variants={SearchResultGrid}>
                    <SearchResultCard restaurant={d} key={index} />
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
          
          <PaginationSelector 
            page={data?.pagination.page || 0} 
            pages={data?.pagination.pages || 0} 
            onPageChange={setPage}/>
        </>
    )
}

export default RestaurantList