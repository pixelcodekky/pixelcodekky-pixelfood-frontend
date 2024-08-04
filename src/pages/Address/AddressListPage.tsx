import { useGetUserAddress, useRemoveAddress } from '@/api/MyAddressApi';
import { generateuuid } from '@/common/Utilities';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddressListPage = () => {
    const navigate = useNavigate();
    const {getAddress, isLoading: getLoading, refetch: refetchAddress} = useGetUserAddress();
    const [removeId, setRemoveId] = useState("");
    const {removeUserAddress} = useRemoveAddress();

    useEffect(() => {
        const load = async () => {
            if(removeId !== undefined && removeId !== ""){
                await removeUserAddress(removeId);
                refetchAddress();
            }
        }
        
        load();
    },[removeId]);

    const handleRemove = (Id: string) => {
        setRemoveId(Id);
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center space-y-5 px-10'>
                <div>
                    <label className='text-xl font-medium'>Locations</label>
                </div>
                <div className='flex flex-row-reverse m-5'>
                    <Button
                        className='flex flex-row justify-center items-center gap-1 bg-green-600 hover:bg-green-500 hover:text-white'
                        onClick={() => {
                            setRemoveId("");
                            navigate({
                                pathname: '/address',
                            })
                        }}
                    >
                        <Plus/>
                        Add New
                    </Button>
                </div>

                {getLoading ? (
                    <span>Loading...</span> 
                ): (
                    (getAddress?.length ?? 0) > 0 ?  (getAddress?.map((data) => (
                            <div key={generateuuid()} 
                                className='w-full lg:w-1/2 space-y-3 bg-white border p-5 rounded-lg shadow-lg'>
                                <div className={`flex flex-row justify-between`}>
                                    <label>{data.addressName}</label>
                                    <div className='flex flex-row gap-2'>
                                        <span>
                                            <Trash
                                            className='text-red-500 hover:text-red-600 cursor-pointer'
                                            onClick={() => {
                                                //e.stopPropagation();
                                                handleRemove(data._id);
                                            }}
                                            />
                                        </span>
                                        <span>
                                            <Link
                                                to={`/address/${data._id}`}
                                            >
                                            <Edit
                                                className='cursor-pointer hover:text-green-500'
                                            />
                                            </Link>
                                            
                                        </span>
                                    </div>
                                </div>
                                <div className={`flex flex-col text-gray-500`}>
                                    <span className='text-sm'>{data.fullName}</span>
                                    <label className='text-sm'>Note: {data.deliveryInstruction}</label>
                                </div>
                            </div>
                        )))
                    : (
                        <div>
                            <span>No Location. Please add new</span>
                        </div>
                    )
                )}

                
            </div>
        </>
    )
}

export default AddressListPage