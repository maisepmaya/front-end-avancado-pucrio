import { createContext } from "react";
import { Sheet } from "../../types/Sheet";
import { Card, Cards } from "../../types/Card";

interface ICardContextData {
  cardList: Cards;
  handleAdd: (sheet: Sheet) => void;
  handleRemove: (id: string) => void;
  handleChange: (id: string, card: Card) => void;
  resetCardList: () => void;
  handleRemoveBySheetId: (sheetId: string) => void;
}

const CardContext = createContext({} as ICardContextData);

export default CardContext;
