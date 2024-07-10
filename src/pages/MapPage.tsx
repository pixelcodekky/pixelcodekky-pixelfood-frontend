import ShowOnMapDefault from '@/components/MapSideBar'
import { MapGLDefault}  from '../components/MapGL/MapGLDefault';
import { AnimatedPage } from '@/animotion/AnimatedPage';
import SearchFooter from '@/components/Search/SearchFooter';

export const MapPage = () => {
    return (
        <>
          <AnimatedPage>
          <ShowOnMapDefault> 
            <MapGLDefault  />
          </ShowOnMapDefault>
          <div className='flex flex-row p-5'>
            <SearchFooter />
          </div>
          </AnimatedPage>
        </>
      )
}
