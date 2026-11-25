import { type ReactNode, useState, useEffect } from "react";
import type { Sheet } from "../../types/Sheet";
import type { Card, Cards } from "../../types/Card";
import CardContext from "./CardContext";
import { toast } from "../../utils/toast";
import {
  getAllCards,
  createCard,
  deleteCard,
  updateCard,
  deleteAllCards,
} from "../../services/api";

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

  const handleAdd = (sheet: Sheet, type: "user" | "api") => {
    const newCard = {
      sheet: type == "user" ? sheet.id : sheet,
      index: Object.keys(cardList ?? {}).length + 1,
    };

    createCard(newCard)
      .then((createdCard) => {
        setData((prev) => ({
          ...prev,
          cardList: {
            ...prev.cardList,
            [createdCard.id]: createdCard,
          },
        }));
        toast(`${createdCard.name} entrou na mesa!`, "success");
      })
      .catch((error) => {
        console.error("Failed to create card:", error);
        toast("Não foi possível invocar esse inimigo. Tente novamente.", "error");
      });
  };

  const handleRemove = (id: string) => {
    deleteCard(id)
      .then(() => {
        setData((prev) => {
          const newCardList = { ...prev.cardList };
          delete newCardList[id];
          return {
            ...prev,
            cardList: newCardList,
          };
        });
      })
      .catch((error) => {
        console.error("Failed to delete card:", error);
        toast("Não foi possível remover o cartão. Tente novamente.", "error");
      });

    return true;
  };

  const handleRemoveBySheetId = (sheetId: string) => {
    if (!cardList) return;

    const cardsToRemove = Object.values(cardList).filter(
      (card) => card.sheetId === sheetId
    );

    cardsToRemove.forEach((card) => {
      handleRemove(card.id);
    });

    return true;
  };

  const handleChange = async (id: string, card: Card) => {
    await updateCard(card).catch((error) => {
      console.error("Failed to update card:", error);
      toast("Não foi possível salvar a alteração do cartão.", "error");
    });

    setData((prev) => ({
      ...prev,
      cardList: {
        ...prev.cardList,
        [id]: card,
      },
    }));
  };

  const resetCardList = () => {
    deleteAllCards()
      .then(() => {
        setData({ cardList: {} });
        toast("Combate encerrado. A mesa está limpa!", "success");
      })
      .catch((error) => {
        console.error("Failed to delete all cards:", error);
        toast("Não foi possível limpar a mesa. Tente novamente.", "error");
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cards = await getAllCards();

        setData({ cardList: cards ?? {} });
      } catch (error) {
        console.error("Failed to fetch cards:", error);
        setData({ cardList: {} });
      }
    };

    if (cardList === null) {
      fetchData();
    }
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
