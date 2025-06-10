import NavBar from "./components/NavBar";
import "./Global.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="h-full w-full flex flex-col relative bg-brown-900">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
