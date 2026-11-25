import { useEffect, useId, useRef } from "react";
import { XIcon } from "@phosphor-icons/react";
import ButtonDefault from "./ButtonDefault";

interface IConfirmModal {
  onClose: () => void;
  onConfirm?: () => void;
  text: string;
  title: string;
  confirmText?: string;
  tone?: "danger" | "default";
}

const ConfirmModal = ({
  onClose,
  onConfirm,
  text,
  title,
  confirmText = "Confirmar",
  tone = "default",
}: IConfirmModal) => {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Em ações destrutivas o foco começa em "Cancelar" (o caminho seguro).
    (onConfirm && tone === "danger" ? cancelRef : confirmRef).current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onConfirm, tone]);

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-400 flex items-center justify-center bg-brown-950/60 p-4 backdrop-blur-[2px] animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-xl bg-parchment text-left shadow-[0_8px_0_var(--color-brown-800),0_20px_40px_rgb(0_0_0/0.5)] ring-4 ring-brown-300 animate-pop-in"
      >
        <div className="flex items-center justify-between bg-brown-800 px-4 py-2.5">
          <h2 id={titleId} className="pt-1 text-lg font-bold text-brown-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1 text-brown-200 transition-colors hover:bg-brown-700"
          >
            <XIcon size={20} weight="bold" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <p className="text-brown-700">{text}</p>
          <div className="flex flex-row-reverse gap-3">
            <ButtonDefault
              ref={confirmRef}
              text={onConfirm ? confirmText : "Ok"}
              onClick={handleConfirm}
              variant={tone === "danger" ? "danger" : "primary"}
              className="flex-1"
            />
            {onConfirm && (
              <ButtonDefault
                ref={cancelRef}
                text="Cancelar"
                onClick={onClose}
                variant="neutral"
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
