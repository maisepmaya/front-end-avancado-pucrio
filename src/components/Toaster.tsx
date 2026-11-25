import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  dismissToast,
  subscribeToasts,
  type ToastItem,
} from "../utils/toast";

const tones = {
  success: {
    icon: CheckCircleIcon,
    className: "border-green-500 [&_svg.tone]:fill-green-500",
  },
  error: {
    icon: WarningCircleIcon,
    className: "border-blood-500 [&_svg.tone]:fill-blood-500",
  },
  info: {
    icon: InfoIcon,
    className: "border-brown-500 [&_svg.tone]:fill-brown-500",
  },
};

const Toaster = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setItems), []);

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 top-3 z-500 flex flex-col items-center gap-2 px-3 sm:top-auto sm:bottom-5 sm:items-end sm:pr-5"
    >
      {items.map((item) => {
        const { icon: Icon, className } = tones[item.tone];
        return (
          <div
            key={item.id}
            className={`pointer-events-auto flex max-w-sm items-center gap-3 rounded-lg border-l-[6px] bg-parchment py-2.5 pr-2 pl-3 text-left text-sm font-semibold text-brown-800 shadow-[0_4px_0_var(--color-brown-800),0_10px_24px_rgb(0_0_0/0.45)] animate-slide-up ${className}`}
          >
            <Icon size={22} weight="fill" className="tone shrink-0" />
            <span className="flex-1">{item.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              aria-label="Fechar aviso"
              className="flex size-8 items-center justify-center rounded text-brown-500 hover:bg-brown-200"
            >
              <XIcon size={14} weight="bold" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
