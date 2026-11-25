import NavBar from "./components/NavBar";
import Toaster from "./components/Toaster";
import CardProvider from "./contexts/CardContext/CardContextProvider";
import SheetProvider from "./contexts/SheetContext/SheetContextProvider";
import "./Global.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <CardProvider>
      <SheetProvider>
        <div className="tavern-bg flex size-full min-h-screen flex-col-reverse sm:flex-col">
          <NavBar />
          <div className="flex-1 relative">
            <Outlet />
          </div>
          <Toaster />
        </div>
      </SheetProvider>
    </CardProvider>
  );
}

export default App;
