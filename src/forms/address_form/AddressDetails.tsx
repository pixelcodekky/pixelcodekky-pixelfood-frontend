import { AddressDetailsFormData, AddressDetailsFormSchema } from '@/common/FormSchemas'
import AddressDetailsSection from '@/components/Address/AddressDetailsSection'
import { LoadingButton } from '@/components/LoadingButton'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AddressContext } from '@/pages/Address/AddressPage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {
    onSave: (addressDetails: FormData) => void; 
    isLoading?: boolean;
    isSuccess?: boolean;
    customClass: string;
}

// let reqdata: UserAddress = {
//     _id: '',
//     user:'',
//     buildingName:'',
//     floor:'',
//     unitNumber:'',
//     deliveryInstruction:'',
//     postalcode:'',
//     lon:0,
//     lat:0,
//     isDefault:false,
//     addressName:'',
//     fullName: '',
// }

const AddressDetails = ({onSave, isLoading, customClass}:Props) => {

    const ctx = useContext(AddressContext);

    const form = useForm<AddressDetailsFormData>({
        resolver: zodResolver(AddressDetailsFormSchema),
        defaultValues: {
            addressName: ctx?.selectedUserAddress.addressName,
            fullName: ctx?.selectedUserAddress.fullName || ctx?.featureName,
            buildingName: ctx?.selectedUserAddress.buildingName,
            floor: ctx?.selectedUserAddress.floor,
            unitNumber: ctx?.selectedUserAddress.unitNumber,
            deliveryInstruction: ctx?.selectedUserAddress.deliveryInstruction,
        }
    });

    const onSubmit = async (formDataJson: AddressDetailsFormData) => {
        const formData = new FormData();
        
        if(ctx?.selectedUserAddress.fullName !== ""){
            formData.append("_id", ctx?.selectedUserAddress._id ?? "");
        }

        formData.append("fullName", (ctx?.featureName !== "" ? ctx?.featureName ?? "" : (formDataJson.fullName ?? "")));
        formData.append("addressName", formDataJson.addressName);
        formData.append("buildingName", (formDataJson.buildingName || ""));
        formData.append("floor", (formDataJson.floor || ""));
        formData.append("unitNumber", (formDataJson.unitNumber || ""));
        formData.append("deliveryInstruction", (formDataJson.deliveryInstruction || ""));
        formData.append("postalcode", "0");
        formData.append("lon", (ctx?.coords.lng.toString() || ""));
        formData.append("lat", (ctx?.coords.lat.toString() || ""));
        formData.append("isDefault", "false");

        await onSave(formData);
       
    }

    const onInvalid = (error :any) => {
        console.log(error);
        toast.error(`Something went wrong, please try again.`);
    }

    return (
        <>
        <div className={`${customClass} flex flex-col items-center justify-center`}>
            <div className='w-full lg:w-1/2 space-y-2 p-2'>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                        className='space-y-4 rounded-lg'>
                        <AddressDetailsSection />
                        <div className='flex flex-row items-center justify-between'>
                            <Button type='button' 
                                className='bg-green-600'
                                disabled={isLoading ? true : false}
                                onClick={() => {
                                    form.reset();
                                    //stepoption(false);
                                    ctx?.setNextPage(false);
                                }}
                                >Back to Map</Button>
                            {isLoading ? <LoadingButton /> : 
                            <Button type='submit' className='bg-green-600'>
                                {ctx?.selectedUserAddress.fullName !== "" ? "Update " : "Add "} 
                                Address
                            </Button>}
                        </div>
                    </form>
                </Form>
            </div>
            
        </div>
            
        </>
    )
}

export default AddressDetails