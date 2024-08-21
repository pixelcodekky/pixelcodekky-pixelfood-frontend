import { zodResolver } from '@hookform/resolvers/zod';
import { Search, SearchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormField, FormItem, Form } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEffect } from 'react';

const formSchema = z.object({
    searchQuery: z.string({
        required_error: `Restaurant name is  required`,
    }),
});

export type SearchForm = z.infer<typeof formSchema>;

type Props = {
    searchQuery?: string;
    onSubmit: (formData: SearchForm) => void;
    placeHolder: string;
    onReset?: () => void;
    className?: string;
    onChange?: (value:string) => void;
}

export const SearchBar = ({onSubmit, placeHolder, onReset, searchQuery, className}: Props) => {

    const form = useForm<SearchForm>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            searchQuery: searchQuery || "",
        }
    });

    useEffect(() => {
        form.reset({searchQuery});
    },[form, searchQuery]);

    const handleReset = () => {
        form.reset({
            searchQuery: "",
        });

        if(onReset){
            onReset(); 
        }
    }

    return (
        
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className={`flex items-center m-2 gap-3 justify-between flex-row border-2 rounded-full p-1 ${className} ${form.formState.errors.searchQuery && "border-red-500"}`}
            >
                <Search strokeWidth={2.5} size={30} className='ml-1 text-green-500 hidden md:block' />
                <FormField 
                    control={form.control} 
                    name='searchQuery' 
                    render={({field}) => (
                        <FormItem className='flex-1'>
                            <FormControl>
                                <Input {...field} 
                                className='border-none shadow-none lg:text-xl md:text-md sm:text-sm focus-visible:ring-0'
                                placeholder={placeHolder}
                                />
                            </FormControl>
                        </FormItem>)} />
                {searchQuery !== "" ? (
                    <Button 
                    onClick={handleReset}
                    type='button' 
                    variant='outline' 
                    className='rounded-full'>Reset</Button>
                
                ) : null}
                
                <Button type='submit' className='rounded-full bg-green-500'>
                    <span className='hidden md:block'>Search</span>
                    <SearchIcon 
                    className='md:hidden'
                    size={18} />
                </Button>
            </form>
        </Form>
    )
}
