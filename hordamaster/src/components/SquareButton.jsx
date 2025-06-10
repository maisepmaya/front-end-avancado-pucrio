import React from "react";
import ImgDiv from "./ImgDiv";

const SquareButton = ({ icon, type = "default", className, ...rest }) => {
  const types = {
    default: "./src/assets/button.png",
    plus: "./src/assets/plus.png",
    minus: "./src/assets/minus.png",
    exit: "./src/assets/exit.png",
  };
  return (
    <button
      className={
        "cursor-pointer active:scale-95 active:brightness-95 transition-transform hover:scale-105 aspect-square " +
        className
      }
      {...rest}
    >
      <ImgDiv src={types[type]} className={"size-full"}>
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
