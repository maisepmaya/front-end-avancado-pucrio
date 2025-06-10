import { useState } from "react";
import {
  GlobeIcon,
  UserIcon,
  CaretDownIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import ImgDiv from "./ImgDiv";
import { FormInput } from "./Form";
import HexagonBtn from "./HexagonBtn";
import SquareButton from "./SquareButton";

const SheetBar = ({ listType }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(listType ?? "internet");

  return (
    <>
      <div className="group flex relative">
        <label className="transition-transform duration-100 ease-in-out active:scale-95 z-10 absolute inline-flex z-20 cursor-pointer p-2 m-2 text-sm rounded-lg sm:hidden">
          <input
            type="checkbox"
            className="hidden"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
          />
          <span className="sr-only">Open sidebar</span>
          <ImgDiv src="./src/assets/icon.png" className="size-9" />
        </label>

        <aside className="z-50 absolute top-0 bottom-0 left-0 z-40 p-2 w-64 transition-transform -translate-x-full group-has-checked:translate-none sm:translate-none sm:relative">
          <ImgDiv src="./src/assets/banner.png" className="h-full">
            <div className="size-full px-3 py-4 overflow-hidden flex flex-col">
              <ImgDiv src="./src/assets/wood.png" className={"h-15 flex-none"}>
                <div className="size-full text-brown-100 font-title pt-2 text-lg font-bold flex items-center justify-center">
                  Fichas
                </div>
              </ImgDiv>

              <div className="px-4 flex-1 flex flex-col">
                <div className="flex-none">
                  {!listType && (
                    <div className="flex flex-row gap-4 items-center justify-center">
                      <HexagonBtn
                        onClick={() => setType("user")}
                        title={"Procurar por fichas"}
                        icon={
                          <GlobeIcon
                            size={28}
                            weight="bold"
                            className="fill-brown-100"
                          />
                        }
                      />
                      <HexagonBtn
                        onClick={() => setType("internet")}
                        title={"Minhas fichas"}
                        icon={
                          <UserIcon
                            size={28}
                            weight="bold"
                            className="fill-brown-100"
                          />
                        }
                      />
                    </div>
                  )}

                  <div className="p-2 flex justify-center gap-1 items-center">
                    <FormInput type="search" id="searchSheet" />
                    <SquareButton
                      icon={
                        <MagnifyingGlassIcon
                          weight="bold"
                          size={20}
                          className="fill-brown-200"
                        />
                      }
                    />
                  </div>

                  <hr className="py-1 border-brown-100 opacity-50 " />
                </div>

                <div className="relative flex-1 mb-15">
                  <ul className="absolute  px-2 inset-0 space-y-4 overflow-y-auto max-h-[100%]">
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                    <SheetItem />
                  </ul>
                </div>
              </div>
            </div>
          </ImgDiv>
        </aside>
      </div>
      {open && (
        <section
          className="absolute inset-0 bg-black opacity-25 cursor-pointer z-40"
          onClick={() => setOpen((prev) => !prev)}
        ></section>
      )}
    </>
  );
};

const SheetItem = ({}) => {
  const icon = "./src/assets/wood.png";
  const name = "teste";
  const level = 3;
  const description =
    " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus acligula non dignissim. Aliquam eu scele risque dui. Quisque ut sodaleslectus, eget consectetur velit. Ut vitae venenatis libero, acfermentum augue. Maecenas nec porta ipsum. Curabitur nec commodo nibh.Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc eulorem eleifend, pellentesque tortor vel, dictum lectus.";

  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    console.log("click");
  };

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="group pointer active:scale-98 cursor-pointer w-full flex relative items-center justify-between text-brown-200 font-bold transition-transform hover:scale-105"
      >
        <div className="w-[45px] h-[45px] flex items-center justify-center bg-brown-900 border-[4px] border-brown-200 rounded-[10px] shadow-[2px_2px_0px_#9b8356,inset_2px_2px_0px_#9b8356]">
          <img
            src={icon}
            alt="icon"
            className="h-[80%] w-[80%] pointer-events-none select-none"
          />
        </div>

        <p className="max-w-[90px] truncate overflow-hidden text-ellipsis">
          {name}
        </p>

        <div className="z-10  flex items-center gap-1">
          <p className="bg-brown-200 text-[#0d2c15] font-bold text-sm px-2 py-1 rounded h-[20px] flex items-center justify-center">
            {level}
          </p>
        </div>

        <div className="sm:hidden relative">
          <button
            onClick={(e) => {
              e.stopPropagation();

              setOpen((prev) => !prev);
            }}
            className="peer z-10 absolute size-[48px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
          />

          <CaretDownIcon
            size={24}
            weight="bold"
            className={
              "transition-all peer-active:scale-90 fill-brown-200 " +
              `${open ? "rotate-180" : "rotate-0"}`
            }
          />
        </div>
      </div>

      <div
        className={
          "z-30 bg-brown-500 text-brown-100 rounded transition-all ease-in-out duration-200 overflow-hidden absolute mt-2 left-0 right-0 top-full " +
          `${
            open
              ? "pointer-events-auto opacity-100 max-h-44"
              : "pointer-events-none opacity-0  max-h-0"
          }`
        }
      >
        <p className="m-1">Informações</p>
        <p className="m-1  font-normal text-xs line-clamp-9 text-justify">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SheetBar;
