import { useRef } from "react";

function useDebounce(cb, delay) {
  const timeoutId = useRef<number>(null);

  return function (...args) {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => cb(...args), delay);
  };
}

export default useDebounce;
