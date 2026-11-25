import type { ButtonHTMLAttributes, ReactNode } from "react";
import ImgDiv from "./ImgDiv";

type ISquareBtnType = "default" | "plus" | "minus" | "exit";

import ButtonImage from "./../assets/button.png";
import Plus from "./../assets/plus.png";
import Minus from "./../assets/minus.png";
import Exit from "./../assets/exit.png";

interface ISquareButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  /** Amplia a área clicável sem mudar o desenho. "x" só nas laterais (botões empilhados). */
  hitSlop?: "all" | "x";
  className?: string;
  btnType?: ISquareBtnType;
}

const SquareButton = ({
  icon,
  btnType = "default",
  className,
  hitSlop = "all",
  ...rest
}: ISquareButton) => {
  const types: Record<ISquareBtnType, string> = {
    default: ButtonImage,
    plus: Plus,
    minus: Minus,
    exit: Exit,
  };

  return (
    <button
      type="button"
      className={`${
        /\b(absolute|fixed)\b/.test(className ?? "") ? "" : "relative"
      } aspect-square cursor-pointer before:absolute before:content-[''] ${
        hitSlop === "all" ? "before:-inset-2" : "before:-inset-x-2 before:-inset-y-1"
      } transition-transform hover:scale-110 active:scale-95 active:brightness-95 ${
        className ?? ""
      }`}
      {...rest}
    >
      <ImgDiv src={types[btnType]} className={"size-full"}>
        {icon && (
          <div className="size-full flex items-center justify-center p-2">
            {icon}
          </div>
        )}
      </ImgDiv>
    </button>
  );
};

export default SquareButton;
