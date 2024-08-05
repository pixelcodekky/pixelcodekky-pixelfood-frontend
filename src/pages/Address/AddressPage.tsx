import { useCreateAddress, useGetUserAddress, useUpdateAddress } from "@/api/MyAddressApi"
import AddressMap from "@/components/Address/AddressMap";
import AddressDetails from "@/forms/address_form/AddressDetails";
import { useAppSelector } from "@/statemgmt/hooks";
import { MapViewSelector } from "@/statemgmt/map/MapViewSlice";
import { UserAddress } from "@/types";
import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    fullName: '',
}



interface Coordinate {
    lat: number,
    lng: number 
}

interface IAddressContext {
    coords: Coordinate;
    setCoords: (newState: Coordinate) => void;
    setNextPage: (value: boolean) => void;
    setFeatureName: (value: string) => void;
    featureName: string;
    selectedUserAddress: UserAddress;
}

export const AddressContext = createContext<IAddressContext | undefined>({
    coords: { lat: 0, lng: 0 },
    setCoords: (_newstate: Coordinate) => {},
    setNextPage: (_value: boolean) => {},
    setFeatureName: (_value: string) => {},
    featureName: "",
    selectedUserAddress: {
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
        fullName: '',
    }
});

const AddressPage = () => {

    const navigate = useNavigate();
    const mapState = useAppSelector(MapViewSelector);
    const {Id} = useParams();
    let initialCoords = {
        lat: mapState.viewState.latitude, 
        lng: mapState.viewState.longitude
    }
    const [coords, setCoords] = useState<Coordinate>(initialCoords);
    const [featureName,setFeatureName] = useState("");
    const {isLoading: addLoading, isSuccess: addSuccess, createAddress} = useCreateAddress();
    const {getAddress, isLoading: getLoading } = useGetUserAddress(Id);
    const [selectedUserAddress, setSelectedUserAddress] = useState<UserAddress>(initialUserAddress);
    const {isLoading: updateLoading, isSuccess: updateSuccess, updateAddress} = useUpdateAddress();
    const [nextpage, setNextPage] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            if(Id !== undefined && Id !== ""){
                if(!getLoading && getAddress !== undefined && getAddress.length > 0){
                    setSelectedUserAddress(getAddress[0]);
                    setCoords({lat: getAddress[0].lat, lng: getAddress[0].lon});
                    setFeatureName(getAddress[0].fullName);
                    setNextPage(true);
                }
            }else{
                setSelectedUserAddress(initialUserAddress);
                setCoords(initialCoords);
                setFeatureName("");
                setNextPage(false);
            }
        }
        load();
    },[Id, getAddress]);

    useEffect(() => {
        const load = async () => {
            if(addSuccess || updateSuccess){
                await new Promise(d => setTimeout(d, 600));
                navigate({
                    pathname: '/address_list',
                    
                }, {
                    state: {reFetch: true}
                });
            }
        }

        load();
    },[addSuccess, updateSuccess])

    const RenderAddressMap = () => {
        if(!nextpage){
            return (
                <AddressMap customClass={"animate-fadeIn"}/>
            )
        }
            
    }

    const RenderAddressDetails = () => {
        if(nextpage){
            return (
                <AddressDetails
                    isLoading={addLoading || getLoading || updateLoading}
                    customClass={"animate-fadeIn"}
                    onSave={(Id !== undefined && Id !== "") ? updateAddress : createAddress}

                />
            )
        }
    }

    const RenderLoading = () => {
        return (
            <div className="flex flex row items-center justify-center w-full bg-opacity-70 bg-white animate-pulse animate-fadeIn h-10">
                <span>Loading...</span>
            </div>
        )
    }

    return (
        <>
            <AddressContext.Provider value={{
                    coords, setCoords, setNextPage, setFeatureName, featureName,selectedUserAddress
            }} >
                <div className="space-y-5">
                    <>
                        {getLoading ? RenderLoading() : null}
                        {RenderAddressMap()}
                        {RenderAddressDetails()}
                    </>
                </div>
            </AddressContext.Provider>
            
        </>
        
    )
}

export default AddressPage