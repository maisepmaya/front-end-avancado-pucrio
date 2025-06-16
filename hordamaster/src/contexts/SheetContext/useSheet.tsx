import { useContext } from "react";
import SheetContext from "./SheetContext";

export const useSheet = () => {
  const context = useContext(SheetContext);

  return context;
};

export default useSheet;
