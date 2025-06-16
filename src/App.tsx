import NavBar from "./components/NavBar";
import CardProvider from "./contexts/CardContext/CardContextProvider";
import SheetProvider from "./contexts/SheetContext/SheetContextProvider";
import "./Global.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <CardProvider>
      <SheetProvider>
        <div className="size-full min-h-screen flex flex-col-reverse sm:flex-col bg-linear-to-t from-brown-700 to-brown-900 to-50%">
          <NavBar />
          <div className="flex-1 relative">
            <Outlet />
          </div>
        </div>
      </SheetProvider>
    </CardProvider>
  );
}

export default App;
