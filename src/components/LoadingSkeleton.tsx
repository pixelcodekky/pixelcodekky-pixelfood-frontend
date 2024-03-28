import { Skeleton } from '@/components/ui/skeleton';
 
function LoadingSkeleton() {
  return (
    <>
        <div className='flex flex-col pag-12 text-center'>
            <div className='bg-white rounded-lg py-8 flex flex-col gap-5 text-center'>
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[100%] item-center flex-row rounded-xl" />
                    <div className="space-y-5">
                        <Skeleton className="h-4 w-[100%]" />
                        <Skeleton className="h-4 w-[100%]" />
                    </div>
                </div>
            </div>
            
        </div>
        
    </>
    
  )
}

export default LoadingSkeleton;