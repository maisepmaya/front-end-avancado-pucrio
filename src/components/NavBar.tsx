import type { AnchorHTMLAttributes } from "react";
import ImgDiv from "./ImgDiv";
import { Link, useLocation } from "react-router-dom";

import Logo from "./../assets/logo.png";
import BigWood from "./../assets/bigWood.png";
import Paper from "./../assets/paper.png";

interface ITab {
  src: string;
  name: string;
}

const NavBar = () => {
  const { pathname } = useLocation();
  const isActive = (src: string) =>
    src === "/" ? pathname === "/" : pathname.startsWith(src.split("/").slice(0, 2).join("/"));
  const tabs: Record<string, ITab> = {
    home: { src: "/", name: "Mesa" },
    create: { src: "/criar", name: "Criar ficha" },
    about: { src: "/sobre/introduction", name: "Sobre" },
  };

  return (
    <>
      <div className="flex-none group z-200 justify-end sm:justify-center flex">
        <nav aria-label="Principal" className="hidden w-110 sm:flex z-45 relative p-1 rounded-xs mt-2 ">
          <div className="absolute -left-5 -right-5 top-1/2 -translate-y-1/2 h-11">
            <ImgDiv src={BigWood} className={"size-full p-2 px-6"} />
          </div>

          <ul className="flex flex-row gap-2 items-center justify-center">
            <Link to="/" aria-label="HordaMaster — início" className="z-5 hidden sm:flex rounded transition-transform hover:-rotate-2">
              <img src={Logo} alt="HordaMaster" className="h-12" />
            </Link>
            {Object.values(tabs).map((tab, index) => (
              <ItemNav key={index} tab={tab} active={isActive(tab.src)} />
            ))}
          </ul>
        </nav>

        <nav aria-label="Principal" className="sm:hidden flex z-45 w-full justify-center rounded-t-lg relative -bottom-1 left-1/2 -translate-x-1/2 rounded-xs">
          <div className="absolute z-0 -left-3 -right-3 -top-4 -bottom-4 h-25">
            <ImgDiv src={BigWood} className={"size-full p-2 px-6"} />
          </div>
          <ul className="flex flex-row gap-2 items-center justify-center px-4">
            <ItemNav tab={tabs["create"]} active={isActive(tabs["create"].src)} />
            <Link
              to={"/"}
              aria-label="HordaMaster — mesa de combate"
              className="z-5 transition-all duration-100 ease-in active:brightness-80 active:scale-95"
            >
              <ImgDiv src={Logo} className={"w-32 h-18"} />
            </Link>
            <ItemNav tab={tabs["about"]} active={isActive(tabs["about"].src)} />
          </ul>
        </nav>
      </div>
    </>
  );
};

interface IItemNav extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tab: ITab;
  active?: boolean;
}

const ItemNav = ({ tab, active = false, ...rest }: IItemNav) => {
  return (
    <li
      className={`group/item transition-all duration-100 ease-in active:brightness-80  active:scale-95 z-20 sm:mb-0 cursor-pointer`}
    >
      <Link to={tab.src} aria-current={active ? "page" : undefined} className="block rounded" {...rest}>
        <ImgDiv
          src={Paper}
          className={`transition-all  size-full p-2 px-6 group-hover/item:rotate-8 group-hover/item:translate-y-5 ${
            active
              ? " scale-95 -translate-y-2"
              : "sm:-rotate-2 sm:translate-y-3"
          }  `}
        >
          <p className="font-title sm:text-sm/4 p-1 pb-2 font-bold text-brown-900 whitespace-nowrap">
            {tab.name}
          </p>
        </ImgDiv>
      </Link>
    </li>
  );
};
export default NavBar;
