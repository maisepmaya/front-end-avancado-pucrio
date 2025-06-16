import { ReactNode } from "react";

interface IImgDiv {
  children?: ReactNode;
  className?: string;
  src: string;
}

const ImgDiv = ({ children, className, src }: IImgDiv) => {
  return (
    <div className={className + " relative"}>
      <img
        className="transition-all size-full inset-0 absolute object-fill z-0"
        src={src}
      />

      <div className="z-10 relative size-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ImgDiv;
