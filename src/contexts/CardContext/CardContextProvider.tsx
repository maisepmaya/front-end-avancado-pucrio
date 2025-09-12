import { type ReactNode, useState, useEffect } from "react";
import type { Sheet } from "../../types/Sheet";
import type { Card, Cards } from "../../types/Card";
import CardContext from "./CardContext";
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
      })
      .catch((error) => {
        console.error("Failed to create card:", error);
        alert("Erro ao criar o card. Tente novamente.");
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
        alert("Erro ao deletar o card. Tente novamente.");
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
    // salvar depois (ex: ao sair do input ou com debounce)
    await updateCard(card).catch((error) => {
      console.error("Failed to update card:", error);
      alert("Erro ao atualizar o card. Tente novamente.");
    });

    setData((prev) => ({
      ...prev,
      cardList: {
        ...prev.cardList,
        [id]: card, // atualização otimista
      },
    }));
  };

  const resetCardList = () => {
    deleteAllCards()
      .then(() => {
        setData({ cardList: {} });
      })
      .catch((error) => {
        console.error("Failed to delete all cards:", error);
        alert("Erro ao limpar os cards. Tente novamente.");
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
