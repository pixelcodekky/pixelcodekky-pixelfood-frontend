import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { LoadingButton } from "./LoadingButton";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useGetUser } from "@/api/MyUserApi";
import CheckoutDelivery from "@/forms/checkout_delivery_form/CheckoutDelivery";
import { CheckoutAddressFormData } from "@/common/FormSchemas";

type Props = {
    onCheckout: (userFormData: CheckoutAddressFormData) => void;
    disabled: boolean;
    isLoading: boolean;
};

const CheckoutButton = ({onCheckout, disabled, isLoading}: Props) => {
    const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0(); 
    const { pathname } = useLocation();

    const { currentUser, isLoading: isGetUserLoading} = useGetUser();

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
                {/* <UserProfileForm 
                    currentUser={currentUser} 
                    onSave={onCheckout} 
                    isLoading={isGetUserLoading} 
                    title="Confirm Delivery Details"
                    buttonText="Continue to payment"
                    /> */}
                <CheckoutDelivery 
                    currentUser={currentUser}
                    onSave={onCheckout}
                    isLoading={isGetUserLoading}
                    buttonText="Continue to Payment"
                />
            </DialogContent>
        </Dialog>
    )

}

export default CheckoutButton