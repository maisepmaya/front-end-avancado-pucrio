import type { ButtonHTMLAttributes, ReactNode } from "react";
import ImgDiv from "./ImgDiv";

type ISquareBtnType = "default" | "plus" | "minus" | "exit";

import ButtonImage from "./../assets/button.png";
import Plus from "./../assets/plus.png";
import Minus from "./../assets/minus.png";
import Exit from "./../assets/exit.png";

interface IFormSquareButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  className?: string;
  btnType?: ISquareBtnType;
}

const SquareButton = ({
  icon,
  btnType = "default",
  className,
  ...rest
}: IFormSquareButton) => {
  const types: Record<ISquareBtnType, string> = {
    default: ButtonImage,
    plus: Plus,
    minus: Minus,
    exit: Exit,
  };

  return (
    <button
      className={
        "cursor-pointer active:scale-95 active:brightness-95 transition-transform hover:scale-105 aspect-square " +
        className
      }
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
