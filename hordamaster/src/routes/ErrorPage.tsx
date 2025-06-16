import NavBar from "../components/NavBar";
import ImgDiv from "../components/ImgDiv";

import Error from "../assets/error404.png";
import Icon from "../assets/icon.png";

import { Link } from "react-router-dom";
import ButtonDefault from "../components/ButtonDefault";

const ErrorPage = () => {
  return (
    <div className="size-full min-h-screen items-center justify-center flex flex-col-reverse sm:flex-col bg-linear-to-t from-brown-700 to-brown-900 to-50% p-4">
      <div className="max-w-md w-full p-6 bg-brown-200 shadow-lg rounded-lg text-center">
        <ImgDiv src={Error} className="w-full aspect-6/4" />

        <p className="text-lg text-brown-600 font-bold">
          Página não encontrada!
        </p>
        <p className="text-brown-600 mb-6">
          Opa! Parece que a página que você está procurando não existe...
        </p>
        <Link to="/">
          <ButtonDefault
            text="Ir pra tela inicial..."
            className="bg-brown-500 hover:bg-brown-600 text-brown-200 shadow-brown-400 font-semibold py-2 px-4 rounded transition duration-300 flex items-center justify-center mx-auto"
          />
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
