import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home.jsx";
import About from "./routes/About.jsx";

import App from "./App.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import CreateSheet from "./routes/CreateSheet.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "sobre",
        element: <About />,
      },
      {
        path: "criar",
        element: <CreateSheet />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
