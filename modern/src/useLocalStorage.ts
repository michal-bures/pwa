import {useState} from 'react'

export function useNumberInLocalStorage(key: string, defaultValue: number) {
    const [getStr, setStr] = useLocalStorage(key, defaultValue.toString())

    const getter = () => {
        const val = Number(getStr())
        return isNaN(val) ? defaultValue : val
    }

    const setter = (newValue: number) => {
        setStr(newValue.toString())
    }

    return [ getter, setter ]
}

export function useLocalStorage(key: string, defaultValue: string) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return defaultValue;
        }
    });

    const setValue = (value: string) => {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValue, setValue];
}
