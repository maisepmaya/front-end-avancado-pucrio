import { Link, useLocation } from "react-router-dom";
import {
  PencilSimpleLineIcon,
  ScrollIcon,
  SwordIcon,
  type Icon,
} from "@phosphor-icons/react";

import Logo from "./../assets/logo.png";
import Paper from "./../assets/paper.png";
import BigWood from "./../assets/bigWood.png";

interface ITab {
  to: string;
  match: string;
  label: string;
  icon: Icon;
  /** Inclinação de "papel pregado à mão" — só nas abas inativas. */
  tilt: string;
}

const TABS: ITab[] = [
  { to: "/", match: "/", label: "Mesa", icon: SwordIcon, tilt: "-rotate-2" },
  {
    to: "/criar",
    match: "/criar",
    label: "Criar ficha",
    icon: PencilSimpleLineIcon,
    tilt: "rotate-[1.5deg]",
  },
  { to: "/sobre/introduction", match: "/sobre", label: "Sobre", icon: ScrollIcon, tilt: "-rotate-1" },
];

const useIsActive = () => {
  const { pathname } = useLocation();
  return (tab: ITab) =>
    tab.match === "/" ? pathname === "/" : pathname.startsWith(tab.match);
};

const Brand = ({ className = "" }: { className?: string }) => (
  <Link
    to="/"
    aria-label="HordaMaster — ir para a mesa de combate"
    className={`shrink-0 rounded-lg transition-transform hover:-rotate-2 ${className}`}
  >
    <img
      src={Logo}
      alt="HordaMaster"
      className="h-full w-auto [filter:brightness(1.3)_saturate(1.1)_drop-shadow(0_4px_0_rgb(0_0_0/0.45))]"
    />
  </Link>
);

// ---------------------------------------------------------------------------
// Barra superior
// Desktop: logo à esquerda + uma tábua com três etiquetas de papel pregadas.
// Mobile: só a marca (a navegação fica nas abas de baixo).
// ---------------------------------------------------------------------------

export const TopBar = () => {
  const isActive = useIsActive();

  return (
    <header className="relative z-200 flex h-16 flex-none items-center justify-center bg-gradient-to-b from-brown-950/90 to-transparent px-4 sm:h-20 sm:justify-between sm:px-6">
      <Brand className="h-12 sm:h-14" />

      <nav aria-label="Principal" className="relative hidden px-4 sm:block">
        {/* a tábua onde as etiquetas ficam pregadas */}
        <img
          src={BigWood}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-x-0 top-1/2 h-10 w-full -translate-y-1/2 object-fill drop-shadow-[0_4px_4px_rgb(0_0_0/0.4)] select-none"
        />
        <ul className="relative flex items-center gap-2">
          {TABS.map((tab) => {
            const active = isActive(tab);
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex h-12 w-36 items-center justify-center pr-2 pl-9 font-title text-[15px] font-bold transition-transform duration-200 ${
                    active
                      ? "-translate-y-1 text-brown-900"
                      : `${tab.tilt} translate-y-0.5 text-brown-800 hover:-translate-y-0.5 hover:rotate-0`
                  }`}
                >
                  <img
                    src={Paper}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className={`pointer-events-none absolute inset-0 size-full object-fill transition-[filter] duration-200 select-none ${
                      active
                        ? "drop-shadow-[0_6px_4px_rgb(0_0_0/0.45)]"
                        : "brightness-[0.78] saturate-[0.85] group-hover:brightness-95"
                    }`}
                  />
                  <span className="relative pt-0.5">{tab.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gold-300 shadow-[0_0_8px_var(--color-gold-300)]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

// ---------------------------------------------------------------------------
// Barra de abas inferior (mobile): alcance do polegar, 3 abas iguais
// ---------------------------------------------------------------------------

export const BottomNav = () => {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Principal"
      className="relative z-200 flex-none pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <img
        src={BigWood}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute -inset-x-2 -top-1 h-[calc(100%+4px)] w-[calc(100%+16px)] object-fill select-none"
      />
      <ul className="relative grid h-16 grid-cols-3">
        {TABS.map((tab) => {
          const active = isActive(tab);
          const TabIcon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className="flex size-full flex-col items-center justify-center gap-1 active:scale-95"
              >
                <span className="relative flex h-8 w-[76px] items-center justify-center">
                  {active && (
                    <img
                      src={Paper}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 size-full -rotate-2 object-fill drop-shadow-[0_2px_0_rgb(0_0_0/0.35)]"
                    />
                  )}
                  <TabIcon
                    size={20}
                    weight={active ? "fill" : "bold"}
                    className={`relative ${active ? "ml-5 text-brown-700" : "text-brown-200"}`}
                  />
                </span>
                <span
                  className={`font-title text-xs leading-none font-semibold ${
                    active ? "text-brown-50" : "text-brown-200"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const NavBar = TopBar;
export default NavBar;
