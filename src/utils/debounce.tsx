import { useRef } from "react";

function useDebounce(cb: Function, delay: any) {
  const timeoutId = useRef<number>(null);

  return function (...args: any) {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => cb(...args), delay);
  };
}

export default useDebounce;
