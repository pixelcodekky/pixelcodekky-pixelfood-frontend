import { Skeleton } from '@/components/ui/skeleton';
 
function LoadingSkeleton() {
  return (
    <>
        <div className='flex flex-col pag-12 text-center'>
            <div className='bg-white rounded-lg py-8 flex flex-col gap-5 text-center'>
                <div className="flex flex-col space-y-3">
                    <div className='flex flex-col items-center justify-center'>
                        <Skeleton className="h-[125px] w-[80%]  flex-row rounded-xl" />
                    </div>
                    <div className="space-y-5 flex flex-col justify-center items-center">
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                </div>
            </div>
            
        </div>
        
    </>
    
  )
}

export default LoadingSkeleton;