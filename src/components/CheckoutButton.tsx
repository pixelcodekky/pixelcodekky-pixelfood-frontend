import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { LoadingButton } from "./LoadingButton";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useGetUser } from "@/api/MyUserApi";
import CheckoutDelivery from "@/forms/checkout_delivery_form/CheckoutDelivery";
import { CheckoutAddressFormData } from "@/common/FormSchemas";
import { useGetUserAddress } from "@/api/MyAddressApi";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/statemgmt/hooks";
import { UserAddress } from "@/types";

type Props = {
    onCheckout: (userFormData: CheckoutAddressFormData) => void;
    disabled: boolean;
    isLoading: boolean;
};

let initialUserAddress = {
    _id: '',
    user:'',
    buildingName:'',
    floor:'',
    unitNumber:'',
    deliveryInstruction:'',
    postalcode:'',
    lon:0,
    lat:0,
    isDefault:false,
    addressName:'',
    fullName:'',
  }

const CheckoutButton = ({onCheckout, disabled, isLoading}: Props) => {
    const profileState = useAppSelector((x) => x.profile);
    const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0(); 
    const { pathname } = useLocation();

    const { currentUser, isLoading: isGetUserLoading} = useGetUser();
    const {getAddress } = useGetUserAddress("");
    const [selectedAddress, setSelectedAddress] = useState<UserAddress>(initialUserAddress);

    useEffect(() => {
        const load = async () => {
            const address = await getAddress;
            const objaddress = address?.find(x => x.fullName === profileState.full_value);
            if(objaddress !== undefined)
                setSelectedAddress(objaddress);
        };

        load();
    }, []);

    const onLogin = async () => {
        await loginWithRedirect({
            appState: { returnTo: pathname },
        });
    }

    if (!isAuthenticated){
        return <Button onClick={onLogin} className='bg-green-500 flex-1'>Log in to Check out</Button>
    }

    if(isAuthLoading || !currentUser || isLoading){
        return <LoadingButton />;
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={disabled} className="bg-green-500 flex-1">Review address and Checkout</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[625px] md:min-w-[700px] bg-gray-50">
                <CheckoutDelivery 
                    currentUser={currentUser}
                    selectedAddress={selectedAddress}
                    onSave={onCheckout}
                    isLoading={isGetUserLoading}
                    buttonText="Continue to Payment"
                />
            </DialogContent>
        </Dialog>
    )

}

export default CheckoutButton