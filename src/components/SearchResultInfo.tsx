import { Link } from 'react-router-dom';

type Props = {
    total: number;
    city: string;
}

export const SearchResultInfo = ({total, city}: Props) => {
  return (
    <div className='text-xl font-bold flex flex-col gap-2 mt-3 mb-3 justify-between lg:items-center lg:flex-row'>
        <span>
            {total} Restaurant found. Showing results for "{city}",
            <Link to='/' 
                className='ml-2 text-sm font-semibold underline cursor-pointer text-green-500'>Change Location</Link>
        </span>
    </div>
  )
}
