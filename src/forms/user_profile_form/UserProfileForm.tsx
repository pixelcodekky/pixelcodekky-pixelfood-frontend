import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRY_CODE } from '@/config/country_code_config';
import { generateuuid } from '@/common/Utilities';
import { toast } from 'sonner';

const phoneValidation = /^[89][0-9]{7}$/ //new RegExp();

const formSchema = z.object({
    email: z.string().optional(),
    name: z.string({required_error: "Name required"})
            .refine((value) => value !== "", {message: "Name required"}),
    addressLine1: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    mobileNumber: z.number({required_error: "Mobile number required."})
                    .refine((value) => phoneValidation.test(value.toString()), {message: "Invalid Phone Number"})
                    .refine((value) => value.toString().length === 8, "Phone Number must be 8 digit long."),
    countryCode: z.string({required_error: "Country Code required."})
                .refine((value) => value !== "NA", {message: "Please select Country Code"} ),
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    currentUser: User;
    onSave: (userProfileData: UserFormData) => void;
    isLoading: boolean;
    title?:string;
    buttonText?:string;
}

export const UserProfileForm = ({ onSave, isLoading, currentUser,title = "Profile", buttonText = "Submit" }: Props) => {
    const form = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: currentUser,
    });
    useEffect(() => {
        form.reset(currentUser);
    },[currentUser, form]);

    const onInvalid = (errors: any) => {
        console.log(errors);
        toast.error(`Something went wrong, please try again.`);
    }

  return (
    <>
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSave, onInvalid)} 
                className='space-y-2 rounded-lg'>
            <div>
                <h2 className='text-2xl font-bold'>{title}</h2>
                {/* <FormDescription>
                    View | Change
                </FormDescription> */}
            </div>
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col w-full'>
                    <FormField control={form.control} name='email' render={({field}) => (
                        <FormItem className='flex-1'>
                            <FormLabel>Emal</FormLabel>
                            <FormControl>
                                <Input {...field} disabled className='bg-white' />
                            </FormControl>
                        </FormItem>
                    )}/>
                </div>
            </div>
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col w-full'>
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
            </div>
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col w-full'>
                    <FormField control={form.control} name='countryCode' render={({field}) => (
                        <FormItem>
                            <FormLabel>Country Code</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || 'SG'}>
                                <FormControl>
                                    <SelectTrigger id="countrycode">
                                        <SelectValue placeholder= "Country Code" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent position="popper">
                                    <SelectItem key={`${generateuuid()}`} value='NA'>Select Country Code</SelectItem>
                                    {(COUNTRY_CODE).map((code, index) => (
                                        <SelectItem key={index} value={code.code}>{code.dialcode} {code.country}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col w-full'>
                    <FormField control={form.control} name='mobileNumber' render={({field}) => (
                        <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                                <Input {...field} 
                                        type='number' 
                                        className='bg-white' 
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>

            <div className='hidden flex flex-col md:flex-row gap-4'>
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
            <div  className='hidden flex flex-col md:flex-row md:w-2/4 gap-4'>
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
            
            <div className='pt-10'>
                {isLoading ? <LoadingButton /> : <Button type='submit' className='bg-green-500 hover:bg-white hover:text-black'>{buttonText}</Button>}
            </div>
           
            </form>

        </Form>
    </>
    
  )
}
