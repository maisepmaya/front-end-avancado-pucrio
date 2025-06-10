import { useState } from "react";
import ImgDiv from "./ImgDiv";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const tabs = [
    { src: "/", name: "Início" },
    { src: "/criar", name: "Criar Fichas" },
    { src: "/sobre", name: "Sobre" },
  ];

  return (
    <>
      <div className="flex-none group justify-end sm:justify-center flex">
        <label className="transition-transform duration-100 ease-in-out active:scale-95 z-20 fixed  sm:relative right-0 inline-flex cursor-pointer p-2 m-2 text-sm rounded-lg sm:hidden">
          <input
            type="checkbox"
            className="hidden"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
          />
          <span className="sr-only">Open sidebar</span>
          <img src="./src/assets/logo.png" className="h-9" />
        </label>

        <nav className="fixed z-45 absolute invisible group-has-checked:visible sm:visible sm:relative p-1 rounded-xs sm:mt-2 mt-12">
          <ul className="flex flex-col sm:flex-row sm:gap-2  items-center justify-center">
            <img src="./src/assets/logo.png" className="h-12 hidden sm:flex" />
            {tabs.map((i, index) => (
              <li
                key={index}
                className={`transition-all duration-100 ease-in active:brightness-80 active:scale-95 z-${index}0 -mb-13 group-has-checked:mb-0 sm:mb-0 cursor-pointer transition-all w-28 hover:w-30 hover:scale-105`}
              >
                <Link to={i.src} onClick={() => setOpen(false)}>
                  <ImgDiv
                    src={"./src/assets/wood.png"}
                    className={"size-full p-2 px-6"}
                  >
                    <p
                      className={"text-sm/4 p-1 pt-2 font-bold text-brown-900"}
                    >
                      {i.name}
                    </p>
                  </ImgDiv>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {open && (
        <section
          className="transition-all absolute inset-0 bg-black opacity-25 cursor-pointer z-40"
          onClick={() => setOpen((prev) => !prev)}
        ></section>
      )}
    </>
  );
};

export default NavBar;
