import { TopBar, BottomNav } from "./components/NavBar";
import Toaster from "./components/Toaster";
import CardProvider from "./contexts/CardContext/CardContextProvider";
import SheetProvider from "./contexts/SheetContext/SheetContextProvider";
import "./Global.css";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

// "Onde estou?" (Krug): o título da aba do navegador acompanha a página.
const PAGE_TITLES: Array<[string, string]> = [
  ["/criar", "Criar ficha"],
  ["/sobre", "Sobre"],
  ["/", "Mesa de combate"],
];

const usePageTitle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const path = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
    const title = PAGE_TITLES.find(([prefix]) =>
      prefix === "/" ? path === "/" : path.startsWith(prefix)
    )?.[1];
    document.title = title ? `${title} · HordaMaster` : "HordaMaster";
  }, [pathname]);
};

function App() {
  usePageTitle();
  return (
    <CardProvider>
      <SheetProvider>
        <div className="tavern-bg flex h-dvh w-full flex-col">
          <TopBar />
          <main className="relative min-h-0 flex-1">
            <Outlet />
          </main>
          <BottomNav />
          <Toaster />
        </div>
      </SheetProvider>
    </CardProvider>
  );
}

export default App;
