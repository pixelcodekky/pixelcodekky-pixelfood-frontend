import { useEffect, useState } from "react";


type Timer = ReturnType<typeof setTimeout>;
type handler = (...args: any[]) => void;

export const useDebounce = <Func extends handler> (
    func: Func,
    delay = 1000,
) => {
    const [timer, setTimer] = useState<Timer>();

    const debounceFunction = ((...args) => {
        const newTimer = setTimeout(() => {
            func(...args);
        }, delay);
        clearTimeout(timer);
        setTimer(newTimer);
    }) as Func;

    return debounceFunction;
}

// export const useDebounce = <T>(value: T, delay = 500) => {
//     const [debouncedValue, setDebouncedValue] = useState<T>(value);

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);
//         return () => clearTimeout(timeout);
//     }, [value, delay]);

//     return debouncedValue;
// }

//
export const haversineDistance = (pointAlonlat:[number, number], pointBlonlat:[number, number]):number => {
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const [lon1, lat1] = pointAlonlat;
    const [lon2, lat2] = pointBlonlat;

    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c =   2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometer
}










