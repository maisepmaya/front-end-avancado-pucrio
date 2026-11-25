import ImgDiv from "../components/ImgDiv";

import Error from "../assets/error404.png";

import { Link } from "react-router-dom";
import ButtonDefault from "../components/ButtonDefault";

const ErrorPage = () => {
  return (
    <div className="size-full min-h-screen items-center justify-center flex flex-col-reverse sm:flex-col tavern-bg p-4">
      <div className="max-w-md w-full p-6 bg-brown-200 shadow-lg rounded-lg text-center">
        <ImgDiv src={Error} alt="404" className="w-full aspect-6/4" />

        <h1 className="text-xl text-brown-700 font-bold">
          Essa trilha não leva a lugar nenhum
        </h1>
        <p className="text-brown-600 mb-6">
          A página que você procura não existe — ou foi devorada por um mímico.
        </p>
        <Link to="/" className="inline-block rounded-lg">
          <ButtonDefault tabIndex={-1} text="Voltar para a mesa" />
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
