const ImgDiv = ({ children, className, src }) => {
  return (
    <div className={className + " relative"}>
      <img className="size-full inset-0 absolute object-fill z-0" src={src} />
      <div className="z-10 relative size-full">{children}</div>
    </div>
  );
};

export default ImgDiv;
