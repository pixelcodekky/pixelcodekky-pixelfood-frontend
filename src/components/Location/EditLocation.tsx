import EditLocationMap from './EditLocationMap'

const EditLocation = () => {



    return (
        <>
            <div className='flex flex-col min-h-[550px] s:w-full bg-white border shadow-lg rounded-lg top-25 p-5 z-50'>
                <div className='flex flex-row w-full'>
                    <h1 className='font-medium text-xl'>Change Location</h1>
                </div>
                <div className='flex flex-col animate-model-zoom'>
                    <EditLocationMap customClass='h-[360px] md:w-[670px] ' />
                </div>
            </div>
        </>
    )
}

export default EditLocation