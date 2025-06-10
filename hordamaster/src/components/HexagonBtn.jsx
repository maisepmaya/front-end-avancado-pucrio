import ImgDiv from "./ImgDiv";

const HexagonBtn = ({ icon, ...rest }) => {
  return (
    <button
      className={
        "cursor-pointer pointer active:scale-95 transition-transform hover:scale-105 aspect-square "
      }
      {...rest}
    >
      <ImgDiv src={"./src/assets/frame.png"} className={"size-full"}>
        <div className="size-full flex items-center justify-center p-3">
          {icon}
        </div>
      </ImgDiv>
    </button>
  );
};

export default HexagonBtn;
