import React, { type ButtonHTMLAttributes } from "react";

interface IButtonDefault extends ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
  text: string;
}
export const ButtonDefault: React.FC<IButtonDefault> = ({
  className,
  children,
  text,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`font-bold px-6 py-1 shadow-[3px_3px_0] hover:scale-110 active:scale-95 transition-transform ${className}`}
    >
      {text}
    </button>
  );
};

export default ButtonDefault;
