import { User } from '@/types';
import { CheckoutAddressFormData, CheckoutAddressFormSchema } from '@/common/FormSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import CheckoutDeliveryAddress from './CheckoutDeliveryAddress';
import CheckoutDeliveryUserInfo from './CheckoutDeliveryUserInfo';
import { useAppSelector } from '@/statemgmt/hooks';

type Props = {
    currentUser: User;
    onSave: (userProfileData: CheckoutAddressFormData) => void;
    isLoading: boolean;
    buttonText: string;
}

const CheckoutDelivery = ({currentUser, onSave, isLoading, buttonText}:Props) => {

    const profileState = useAppSelector((x) => x.profile);

    const form = useForm<CheckoutAddressFormData>({
        resolver: zodResolver(CheckoutAddressFormSchema),
        defaultValues: currentUser,
    }) 

    const onSubmit = (formJson: CheckoutAddressFormData) => {
        formJson.fullName = profileState.full_value || "";
        formJson.lat = profileState.lat || 0;
        formJson.lng = profileState.lng || 0;
        //console.log(formJson);
        onSave(formJson);
    }

    const onInvalid = (error :any) => {
        console.log(error);
        toast.error(`Something went wrong, please try again.`);
    }

    return (
        <>
            <div>
                <h1 className='text-xl font-medium'>Delivery Information</h1>
                <div className='space-y-2'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                            className='space-y-4 rounded-lg'
                        >
                            <div>
                                <CheckoutDeliveryUserInfo/>
                            </div>
                            <div className='space-y-2'>
                                <CheckoutDeliveryAddress />
                            </div>
                            <div className='flex flex-row items-center justify-between'>
                                {isLoading ? <LoadingButton /> : 
                                <Button type='submit' className='bg-green-600'>
                                    {buttonText}
                                </Button>}
                            </div>
                        </form>  
                    </Form>
                </div>
            </div>
        </>
        
    )
}

export default CheckoutDelivery