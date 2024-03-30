import { FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { cuisineList } from '@/config/restaurant_options_config';
import { CuisineCheckbox } from './CuisineCheckbox';

export const CuisinesSection = () => {

    const {control} = useFormContext();

    return (
        <>
        <div className='space-y-2'>
            <div>
                <h2 className='text-2xl font-bold'>Cuisines</h2>
                <FormDescription>
                    Select the Cuisine(s)
                </FormDescription>
            </div>
            <FormField 
                control={control} 
                name='cuisines' render={({field}) => (
                <FormItem>
                    <div className='grid md:grid-cols-5 gap-1'>
                        {cuisineList.map((item, index) => (
                            <div key={index.toString()}>
                                <CuisineCheckbox cuisine={item} field={field} />
                            </div>
                            
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        </>
        
    )
}
