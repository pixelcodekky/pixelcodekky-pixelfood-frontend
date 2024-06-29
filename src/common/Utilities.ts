import { useState } from "react";


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








