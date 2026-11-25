export type ToastTone = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener(toasts));

export const dismissToast = (id: number) => {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
};

/** Mostra um aviso temático no canto da tela (substitui os `alert()` nativos). */
export const toast = (message: string, tone: ToastTone = "info") => {
  const id = nextId++;
  toasts = [...toasts.slice(-2), { id, tone, message }];
  emit();
  window.setTimeout(() => dismissToast(id), tone === "error" ? 5000 : 3000);
};

export const subscribeToasts = (listener: Listener) => {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
};
