import { XIcon } from "@phosphor-icons/react";
import ButtonDefault from "./ButtonDefault";

interface IConfirmModal {
  onClose: () => void;
  onConfirm?: () => void;
  text: string;
  title: string;
}

const ConfirmModal = ({ onClose, onConfirm, text, title }: IConfirmModal) => {
  return (
    <section
      onClick={onClose}
      className="cursor-pointer absolute inset-0 bg-brown-900/50 p-4 z-400 flex items-center justify-center"
    >
      <div className="bg-brown-200 rounded-t-xl rounded-b-lg shadow-lg shadow-brown-800 flex flex-col ">
        <div className="flex w-full text-brown-200 justify-between items-center font-bold text-lg bg-brown-800 p-2 rounded-t-md">
          {title}{" "}
          <XIcon
            size={24}
            weight="fill"
            className="fill-brown-200 hover:scale-105 active:scale-95"
          />
        </div>
        <div className="flex flex-col p-4 gap-4">
          <p className="p-4">{text}</p>
          <div className="flex flex-row gap-4 w-full justify-center">
            <ButtonDefault
              text="Confirmar"
              onClick={onConfirm ?? onClose}
              className="bg-teal-800 text-brown-200 shadow-teal-600"
            />

            {onConfirm && (
              <ButtonDefault
                text="Cancelar"
                onClick={onClose}
                className="bg-red-900 text-brown-200 shadow-red-700"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmModal;
