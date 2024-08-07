import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

const CheckoutDeliveryAddress = () => {
    
    const {control} = useFormContext();
    
    return (
        <>
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
        </>
    )
}

export default CheckoutDeliveryAddress