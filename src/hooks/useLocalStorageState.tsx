import { useState } from 'react'

type UseLocalStorageStateParams<T> = {
  key: string;
  initialValue: T;
}

type SetStateValue<T> = (value: T | ((value: T) => T)) => void
type UseLocalStorageStateResult<T> = [T, SetStateValue<T>]

export function useLocalStorageState<T>({
  key, initialValue
}: UseLocalStorageStateParams<T>): UseLocalStorageStateResult<T> {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    const savedState = window.localStorage.getItem(key);

    return savedState ? JSON.parse(savedState) : initialValue
  })

  const setStateValue = (value: T | ((value: T) => T)) => {
    const valueToStore = value instanceof Function ? value(state) : value;

    setState(valueToStore)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    }
  }

  return [state, setStateValue]
}