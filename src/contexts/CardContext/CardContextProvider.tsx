import { ReactNode, useState, useEffect } from "react";
import { Sheet } from "../../types/Sheet";
import { v4 as uuidv4 } from "uuid";
import { Card, Cards } from "../../types/Card";
import CardContext from "./CardContext";

interface ICardProvider {
  children: ReactNode;
}

interface ICardData {
  cardList: Cards | null;
}

const CardProvider = ({ children }: ICardProvider) => {
  const [{ cardList }, setData] = useState<ICardData>({
    cardList: null,
  });

  const handleAdd = (sheet: Sheet) => {
    const newCard: Card = {
      ...sheet,
      id: uuidv4(),
      currLife: Number(sheet.life),
      sheetId: sheet.id,
    };

    setData((prev) => ({
      ...prev,
      cardList: {
        ...prev.cardList,
        [newCard.id]: newCard,
      },
    }));
  };

  const handleRemove = (id: string) => {
    setData((prev) => {
      const cardList = { ...prev.cardList };
      delete cardList[id];

      return {
        ...prev,
        cardList,
      };
    });

    return true;
  };

  const handleRemoveBySheetId = (sheetId: string) => {
    setData((prev) => {
      const cardList = prev.cardList;

      if (cardList) {
        const removeList = Object.values(cardList ?? {}).filter(
          (card) => card.sheetId == sheetId
        );

        removeList.map((card) => delete cardList[card.id]);

        console.log(removeList);
        return {
          ...prev,
          cardList,
        };
      } else return prev;
    });

    return true;
  };

  const handleChange = (id: string, card: Card) => {
    setData((prev) => {
      const cardList = { ...prev.cardList };
      cardList[id] = card;

      return {
        ...prev,
        cardList,
      };
    });
  };

  const resetCardList = () => {
    setData((prev) => {
      return {
        ...prev,
        cardList: {},
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const json = localStorage.getItem("cardList");
      if (json)
        setData({
          cardList: JSON.parse(json),
        });
    };

    if (!cardList) fetchData();
  }, []);

  useEffect(() => {
    if (cardList) localStorage.setItem("cardList", JSON.stringify(cardList));
  }, [cardList]);

  return (
    <CardContext.Provider
      value={{
        cardList: cardList ?? {},
        handleAdd,
        handleRemove,
        handleChange,
        resetCardList,
        handleRemoveBySheetId,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export default CardProvider;
