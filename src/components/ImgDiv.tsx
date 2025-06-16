import type { ReactNode } from "react";

interface ImgDivProps {
  children?: ReactNode;
  className?: string;
  src: string;
  alt?: string;
  loading?: "lazy" | "eager";
}

const ImgDiv = ({
  children,
  className = "",
  src,
  alt = "",
  loading = "lazy",
}: ImgDivProps) => {
  return (
    <div className={`${className} relative`} role="img" aria-label={alt}>
      <img
        className="transition-all size-full inset-0 absolute object-fill z-0"
        src={src || "/placeholder.svg"}
        alt={alt}
        loading={loading}
        onError={(e) => {
          console.warn(`Failed to load image: ${src}`);
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="z-10 relative size-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ImgDiv;
