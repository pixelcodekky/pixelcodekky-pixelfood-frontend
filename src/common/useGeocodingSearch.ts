import { useCallback, useEffect, useState } from "react";
import { useGeocodingForward } from "@/api/GeocodingApi";
import { Feature, SearchResultType } from "@/types";
import { useDebounce } from "./Utilities";

const initialState: SearchResultType = {
    value: '',
    key: '',
    full_value: '',
    lat: 0,
    lng: 0,
};

export const useGeocodingSearch = () => {
    const [inputValue, setInputValue] = useState("");
    const [debounceInput, setDebounceInput] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const [hideSuggestion, setHideSuggestion] = useState(true);
    const [geocodingCollection, setGeocodingCollection] = useState<Feature[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
    const [selectedResult, setSelectedResult] = useState<SearchResultType>(initialState);

    const { data: geocodeForward } = useGeocodingForward(debounceInput);

    // Defined before useDebounce so it can be passed as the callback.
    // clearDebounce is only accessed at event-call time, after full initialisation.
    const handleOnChange = async (value: string) => {
        if (value.length === 0) {
            setHideSuggestion(true);
            setInputValue("");
            setIsSelected(false);
            clearDebounce();
        } else if (!isSelected) {
            setHideSuggestion(false);
            setDebounceInput(value);
        }
    };

    const { debounceFunction, clearDebounce, isLoading: isDebounceLoading } = useDebounce(handleOnChange);

    // Pass this as SetInputValue to SearchBarGeolocation so the input update
    // and debounce trigger happen together on every keystroke.
    const onChange = useCallback((value: string) => {
        setInputValue(value);
        debounceFunction(value);
    }, [debounceFunction]);

    useEffect(() => {
        if (geocodeForward?.payload?.length > 0) {
            setGeocodingCollection(geocodeForward.payload);
        }
    }, [geocodeForward]);

    useEffect(() => {
        const res: SearchResultType[] = geocodingCollection.map((data) => ({
            value: data.properties.name,
            key: data.properties.mapbox_id,
            full_value: data.properties.full_address,
            lat: data.properties.coordinates.latitude,
            lng: data.properties.coordinates.longitude,
        }));
        setHideSuggestion(res.length === 0);
        setSearchResults(res);
    }, [geocodingCollection]);

    const clearSearch = useCallback(() => {
        setGeocodingCollection([]);
        setHideSuggestion(true);
        setInputValue("");
        setIsSelected(false);
        clearDebounce();
    }, [clearDebounce]);

    const onSelect = useCallback((result: SearchResultType) => {
        setInputValue(result.full_value);
        setSelectedResult(result);
        setIsSelected(true);
        setHideSuggestion(false);
    }, []);

    return {
        inputValue,
        isSelected,
        hideSuggestion,
        searchResults,
        selectedResult,
        setSelectedResult,
        isDebounceLoading,
        clearSearch,
        onSelect,
        onChange,
    };
};
