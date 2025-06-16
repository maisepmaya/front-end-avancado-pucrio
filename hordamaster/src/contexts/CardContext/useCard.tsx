import { useContext } from "react";
import CardContext from "./CardContext";

export const useCard = () => {
  const context = useContext(CardContext);

  return context;
};

export default useCard;
