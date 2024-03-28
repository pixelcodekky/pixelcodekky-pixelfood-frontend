import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useFormContext } from 'react-hook-form'

const ImageSection = () => {
    
    const { control, watch } = useFormContext();

    const existingImgUrl = watch('imageUrl');

    return (
        <div className='space-y-2'>
            <div>
                <h2 className='text-2xl font-bold'>Image</h2>
                <FormDescription>
                    Restaurant Image
                </FormDescription>
            </div>

            <div className='flex flex-col gap-8 md:w-[50%]'>
                {existingImgUrl && (
                    <AspectRatio ratio={16/9}>
                        <img src={existingImgUrl} className='rounded-md object-cover h-full' />
                    </AspectRatio>
                )}
                <FormField control={control} name='imageFile' render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input 
                                className='bg-white' 
                                type='file' 
                                accept='.jpg, .jpeg, .png'
                                onChange={(e) => field.onChange(e.target.files ? e.target.files[0]: null
                            )}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </div>
    )
}

export default ImageSection;
