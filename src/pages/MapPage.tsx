import ShowOnMapDefault from '@/components/MapSideBar'
import { MapGLDefault}  from '../components/MapGL/MapGLDefault';
import { AnimatedPage } from '@/animotion/AnimatedPage';

export const MapPage = () => {
    return (
        <>
        <AnimatedPage>
        <ShowOnMapDefault> 
          <MapGLDefault  />
        </ShowOnMapDefault>
        </AnimatedPage>
        
        
        </>
         
      )
}
