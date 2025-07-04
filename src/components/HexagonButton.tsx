import type { ButtonHTMLAttributes, ReactNode } from "react";
import ImgDiv from "./ImgDiv";

import Frame from "./../assets/frame.png";

interface IHexagonButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}
const HexagonButton = ({ icon, ...rest }: IHexagonButton) => {
  return (
    <button
      className={
        "cursor-pointer pointer active:scale-95 transition-transform hover:scale-105 aspect-square "
      }
      {...rest}
    >
      <ImgDiv src={Frame} className={"size-full"}>
        <div className="size-full flex items-center justify-center p-3">
          {icon}
        </div>
      </ImgDiv>
    </button>
  );
};

export default HexagonButton;
