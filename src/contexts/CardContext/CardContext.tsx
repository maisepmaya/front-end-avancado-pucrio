import { createContext } from "react";
import type { Sheet } from "../../types/Sheet";
import type { Cards, Card } from "../../types/Card";

interface ICardContextData {
  cardList: Cards;
  handleAdd: (sheet: Sheet, type: "user" | "api") => void;
  handleRemove: (id: string) => void;
  handleChange: (id: string, card: Card) => void;
  resetCardList: () => void;
  handleRemoveBySheetId: (sheetId: string) => void;
}

const CardContext = createContext({} as ICardContextData);

export default CardContext;
