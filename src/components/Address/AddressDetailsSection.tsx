import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { AddressContext } from '@/pages/Address/AddressPage';
import { MapPin } from 'lucide-react';

const AddressDetailsSection = () => {
    const {control} = useFormContext();
    const ctx = useContext(AddressContext);

    return (
        <>
            <div className='space-y-2'>
                <div className='flex flex-row items-center justify-center'>
                    <h2 className='font-medium text-2xl'>Address Details</h2>
                </div>
                <div className='flex flex-row items-center justify-center gap-2 sm:text-sm'>
                    <span><MapPin className='text-green-500' /></span>
                    <label className='font-medium text-sm'>{ctx?.featureName}</label>
                </div>
                <div>
                    <FormField
                        control={control}
                        name='addressName'
                        render={({field}) => (
                            <FormItem className=''>
                                <div className='flex flex-row items-center gap-2'>
                                    <FormLabel>
                                        Address Name
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                                
                                <FormControl>
                                    <Input {...field} className='bg-white' placeholder='Home or Work' />
                                </FormControl>
                                
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={control}
                        name='buildingName'
                        render={({field}) => (
                            <FormItem className=''>
                                <div className='flex flex-row items-center gap-2'>
                                    <FormLabel>
                                        Building Name
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <Input {...field} className='bg-white' placeholder='HDB, Condo, Landed' />
                                </FormControl>
                                </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-cols gap-2'>
                    <FormField
                        control={control}
                        name='floor'
                        render={({field}) => (
                            <FormItem className=''>
                                <div className='flex flex-row items-center gap-2'>
                                    <FormLabel>
                                        Floor
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <Input {...field} className='bg-white' placeholder='Floor Number' />
                                </FormControl>
                                </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name='unitNumber'
                        render={({field}) => (
                            <FormItem className=''>
                                <div className='flex flex-row items-center gap-2'>
                                    <FormLabel>
                                        Unit
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <Input {...field} className='bg-white' placeholder='Unit Number' />
                                </FormControl>
                                </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={control}
                        name='deliveryInstruction'
                        render={({field}) => (
                            <FormItem className=''>
                                <div className='flex flex-row items-center gap-2'>
                                    <FormLabel>
                                        Delivery Instruction
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <Input {...field} className='bg-white' placeholder='Note to delivery, Meet me at Lobby' />
                                </FormControl>
                                </FormItem>
                        )}
                    />
                </div>

            </div>
        </>        
    )
}

export default AddressDetailsSection