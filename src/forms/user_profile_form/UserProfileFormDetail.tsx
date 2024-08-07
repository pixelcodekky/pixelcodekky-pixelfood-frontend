import { generateuuid } from '@/common/Utilities';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRY_CODE } from '@/config/country_code_config';
import { useFormContext } from 'react-hook-form';

const UserProfileFormDetail = () => {

    const {control} = useFormContext();

    return (
        <>
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col w-full'>
                    <FormField control={control} name='email' render={({field}) => (
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
                    <FormField control={control} name='name' render={({field}) => (
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
                    <FormField control={control} name='countryCode' render={({field}) => (
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
                    <FormField control={control} name='mobileNumber' render={({field}) => (
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
        </>
    )
}

export default UserProfileFormDetail