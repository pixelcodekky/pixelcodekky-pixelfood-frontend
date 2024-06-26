import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRY_CODE } from '@/config/country_code_config';

const phoneValidation = new RegExp(
    /^[89][0-9]{7}$/
);

const formSchema = z.object({
    email: z.string().optional(),
    name: z.string().min(1, 'Name must be at least 1 character long'),
    addressLine1: z.string().min(1, 'Address Line must be at least 1 character long'),
    city: z.string().min(1, 'City must be at least 1 character long'),
    country: z.string().min(1, 'Country must be at least 1 character long'),
    mobileNumber: z.string({required_error: "Mobile number required."})
                    .min(1, 'Phone number must be 8 character long.')
                    .max(8,"Phone number must be 8 character long.")
                    .regex(phoneValidation,{message:'invalid phone number'}),
    countryCode: z.string({required_error: "Country Code required."}).min(1, 'Country Code is required'),
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    currentUser: User;
    onSave: (userProfileData: UserFormData) => void;
    isLoading: boolean;
    title?:string;
    buttonText?:string;
}

export const UserProfileForm = ({ onSave, isLoading, currentUser,title = "User Profile", buttonText = "Submit" }: Props) => {

    const form = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: currentUser,
    });

    useEffect(() => {
        form.reset(currentUser);
    },[currentUser, form]);

  return (
    <>
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSave)} 
                className='space-y-4 bg-gray-50 rounded-lg md:p-8'>
            <div>
                <h2 className='text-2xl font-bold'>{title}</h2>
                {/* <FormDescription>
                    View | Change
                </FormDescription> */}
            </div>
            <div className='flex flex-col md:flex-row gap-4'>
                <FormField control={form.control} name='email' render={({field}) => (
                    <FormItem className='flex-1'>
                        <FormLabel>Emal</FormLabel>
                        <FormControl>
                            <Input {...field} disabled className='bg-white' />
                        </FormControl>
                    </FormItem>
                )}/>

                <FormField control={form.control} name='name' render={({field}) => (
                    <FormItem className='flex-1'>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
                <FormField control={form.control} name='country' render={({field}) => (
                    <FormItem >
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name='city' render={({field}) => (
                    <FormItem >
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div  className='flex flex-col md:flex-row gap-4'>
                <FormField control={form.control} name='addressLine1' render={({field}) => (
                    <FormItem className='flex-1'>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className='flex flex-col md:flex-row gap-4'>
                <FormField control={form.control} name='countryCode' render={({field}) => (
                    <FormItem className='w-2/6 md:w-auto'>
                        <FormLabel>Country Code</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || 'SG'}>
                            <FormControl>
                                <SelectTrigger id="countrycode">
                                    <SelectValue placeholder= "Country Code" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent position="popper">
                                {(COUNTRY_CODE).map((code, index) => (
                                    <SelectItem key={index} value={code.code}>{code.dialcode} {code.country}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={form.control} name='mobileNumber' render={({field}) => (
                    <FormItem className='w-2/5 md:w-auto'>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div className='pt-10'>
                {isLoading ? <LoadingButton /> : <Button type='submit' className='bg-orange-500'>{buttonText}</Button>}
            </div>
           
            </form>

        </Form>
    </>
    
  )
}
