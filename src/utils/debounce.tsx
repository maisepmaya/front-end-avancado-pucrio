import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<Args extends any[]>(cb: (...args: Args) => void, delay: number) {
  const timeoutId = useRef<number | null>(null);

  return function (...args: Args) {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }
    timeoutId.current = window.setTimeout(() => cb(...args), delay);
  };
}

export default useDebounce;
