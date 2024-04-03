import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

type Props = {
    index: number;
    removeMenuItem: () => void;
}

const MenuItemInput = ({index, removeMenuItem}: Props) => {
    
    const {control} = useFormContext();
    
    
    return (
        <div className='flex flex-row items-end gap-2'>
            <FormField control={control} name={`menuItems.${index}.name`} render={({field}) =>(
                <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                        Name <FormMessage />
                    </FormLabel>
                    <FormControl>
                        <Input {...field} placeholder='Fried Rice' className='bg-white' />
                    </FormControl>
                </FormItem>
            )}/>
            <FormField control={control} name={`menuItems.${index}.price`} render={({field}) =>(
                <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                        Price (SGD) <FormMessage />
                    </FormLabel>
                    <FormControl>
                        <Input {...field} placeholder='5.5' className='bg-white' />
                    </FormControl>
                </FormItem>
            )}/>
            {/* <Button type='button' onClick={removeMenuItem} className='bg-red-500 mx-h-fit'>Remove</Button> */}
            <Button type='button' className='bg-white hover:bg-white'><Trash onClick={removeMenuItem} className='text-red-500 hover:text-red-600 h-fit' /></Button> 
        </div>
    )
}



export default MenuItemInput