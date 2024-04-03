import { Button } from '@/components/ui/button';
import { FormDescription, FormField, FormItem } from '@/components/ui/form';
import { useFieldArray, useFormContext } from 'react-hook-form'
import MenuItemInput from './MenuItemInput';
import { Plus } from 'lucide-react';

const MenuSection = () => {
    const {control} = useFormContext();

    const {fields, append, remove} = useFieldArray({
        control,
        name: 'menuItems',

    })

    return (
        <div className='space-y-2'>
            <div>
                <h2 className='text-2xl font-bold'>Menu</h2>
                <FormDescription>Create your own menu</FormDescription>
            </div>
            <Button type='button' className='bg-white-500 hover:bg-green-100'
                onClick={() => append({name:'', price:''})}><Plus className='text-green-600'></Plus></Button>
            <FormField control={control} 
                name='menuItems' 
                render={() => (
                    <FormItem className='flex flex-col gap-2'>
                        {fields.map((_, idx) => (
                            <MenuItemInput
                                key={idx}
                                index={idx}
                                removeMenuItem={() => remove(idx)}
                            />
                        ))}
                    </FormItem>
            )} />
            
        </div>
    )
}

export default MenuSection;
