import FullHeart from "../assets/full-heart.png";
import Heart from "./../assets/heart.png";
import BrokeHeart from "./../assets/broke-heart.png";
import CardBase from "./../assets/card-base.png";
import CardTitle from "./../assets/card-title.png";
import CardTag from "./../assets/card-tag.png";
import CardBtn from "./../assets/card-btn.png";
import Shield from "./../assets/shield.png";

import SheetBar from "../components/SheetBar";
import ImgDiv from "../components/ImgDiv";
import SquareButton from "../components/SquareButton";
import ButtonDefault from "../components/ButtonDefault";
import { useEffect, useState } from "react";
import type { Card as CardType } from "../types/Card";
import useCard from "../contexts/CardContext/useCard";
import { HandHeartIcon } from "@phosphor-icons/react";
import ConfirmModal from "../components/ConfirmModal";
import useDebounce from "../utils/debounce";
import { createPortal } from "react-dom";

const Home = () => {
  const { handleAdd, resetCardList } = useCard();
  const [modal, openModal] = useState(false);

  return (
    <>
      <div className="flex relative flex-row size-full">
        {modal &&
          createPortal(
            <ConfirmModal
              onClose={() => openModal(false)}
              onConfirm={resetCardList}
              title="Resetar Cartões"
              text={"Todas os cartões serão removidos. Deseja continuar?"}
            />,
            document.body
          )}
        <SheetBar handleClickItem={handleAdd} />
        <div className="w-full relative">
          <Grid />
          <ButtonDefault
            className="bg-green-500 text-brown-200 shadow-teal-500 absolute sm:bottom-5 right-4 top-4 sm:top-auto sm:right-1/2 sm:-translate-x-1/2 z-40"
            text="Resetar"
            onClick={() => openModal(true)}
          />
        </div>
      </div>
    </>
  );
};

const Grid = () => {
  const { handleRemove, cardList, handleChange } = useCard();

  return (
    <div className="absolute p-4 sm:mt-0 mt-18 justify-items-center content-start gap-5 items-center inset-0 overflow-y-auto overflow-x-hidden mx-0 my-auto grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4">
      {cardList && Object.values(cardList).length > 0 ? (
        Object.values(cardList).map((card, index) => (
          <Card
            index={index}
            key={index}
            item={card}
            handleRemove={handleRemove}
            handleChange={handleChange}
          />
        ))
      ) : (
        <div className="absolute p-4 inset-0 text-brown-200 opacity-50 flex items-center justify-center">
          Nada pra ser mostrado por enquanto. Selecione uma ficha para insirir
          um cartão!
        </div>
      )}
    </div>
  );
};

const Card = ({
  handleRemove,
  handleChange,
  item,
  index,
}: {
  handleRemove: (id: string) => void;
  handleChange: (id: string, card: CardType) => void;
  item: CardType;
  index: number;
}) => {
  const [card, setCard] = useState<CardType>(item);

  const [lifeControl, setLifeControl] = useState(1);

  const heart = {
    full: FullHeart,
    medium: Heart,
    low: BrokeHeart,
  };

  const handleCardChange = useDebounce(async (id: string, card: CardType) => {
    handleChange(id, card);
  }, 500);

  useEffect(() => {
    handleCardChange(card.id, card);
  }, [card]);

  useEffect(() => {
    setCard(item);
  }, [item]);

  return (
    <div
      className={`relative m-2 ${
        card.currLife <= 0 ? "opacity-50 grayscale-50" : ""
      }`}
    >
      <ImgDiv src={CardBase} className="z-5 w-xs aspect-[12/8]">
        <div className="relative size-full flex flex-col items-center">
          {/* Close Button */}
          <SquareButton
            btnType="exit"
            title="Remover cartão"
            className="absolute w-7 right-0 aspect-square transition-transform hover:scale-110 active:scale-100 z-10"
            onClick={() => handleRemove(card.id)}
          />

          {/* Header */}
          <div className="absolute -top-2 left-0 right-0 h-[18%] flex items-center justify-center">
            <ImgDiv src={CardTitle} className={"w-[55%] h-full"}>
              <div className="size-full relative gap-1 px-4 flex items-center justify-evenly rotate-[3deg]">
                <p className="font-bold text-[15px] text-brown-800 mt-1 truncate ">
                  {card.name}
                </p>
                <p className="bg-brown-800 text-brown-200 font-bold text-sm px-2 py-1 rounded h-[20px] flex items-center justify-center">
                  {card.level}
                </p>
              </div>
            </ImgDiv>
          </div>

          {/* Middle Section */}
          <div className="mt-6 w-[75 %] h-[60%] gap-1 flex justify-evenly items-center ">
            {/* Life Controls*/}
            <div className="flex flex-col items-center justify-center  items-center gap-1 h-[70%]">
              <SquareButton
                btnType="plus"
                title="Adicionar vida"
                className="h-[35%] aspect-square  transition-transform hover:scale-110 active:scale-95"
                onClick={() => {
                  setCard((prev) => ({
                    ...prev,
                    currLife: prev.currLife + lifeControl,
                  }));
                  setLifeControl(1);
                }}
              />
              <input
                id={`lifeControlCard-${index}`}
                type="number"
                className="w-13 h-[30%] text-center bg-brown-500 rounded  text-xl font-bold text-brown-200 appearance-none"
                value={lifeControl}
                onChange={(e) => setLifeControl(Number(e.target.value))}
              />
              <SquareButton
                btnType="minus"
                className="h-[35%] aspect-square   transition-transform hover:scale-110 active:scale-95"
                title="Remover vida"
                onClick={() => {
                  setCard((prev) => ({
                    ...prev,
                    currLife: prev.currLife - lifeControl,
                  }));
                  setLifeControl(1);
                }}
              />
            </div>

            {/* Life */}
            <div className="relative aspect-square h-[70%] ">
              <ImgDiv
                src={
                  card.currLife < Number(card.life)
                    ? card.currLife <= 0
                      ? heart.low
                      : heart.medium
                    : heart.full
                }
                className={`transition-all size-full ${
                  card.currLife < Number(card.life)
                    ? card.currLife <= 0
                      ? "-rotate-3"
                      : "-rotate-15 translate-x-1"
                    : "rotate-0"
                } `}
              >
                <div className="size-full flex items-center justify-center">
                  <input
                    type="number"
                    id={`lifeCard-${index}`}
                    className="text-[25px] size-full font-bold text-center text-brown-200"
                    onChange={(e) =>
                      setCard((prev) => ({
                        ...prev,
                        currLife: Number(e.target.value),
                      }))
                    }
                    value={card.currLife}
                  />
                </div>
              </ImgDiv>

              {/* Recuperar vida */}
              <button
                title={"Recuperar vida"}
                className="transition-all absolute hover:scale-105 active:scale-95 -top-2 -right-2"
                onClick={() =>
                  setCard((prev) => ({
                    ...prev,
                    currLife: Number(prev.life),
                  }))
                }
              >
                <HandHeartIcon
                  size={24}
                  weight="fill"
                  className="fill-brown-500"
                />
              </button>
            </div>

            {/* AC Display */}
            <div className="aspect-square h-[40%] mt-6">
              <ImgDiv src={Shield} className={"size-full"}>
                <div className="size-full pt-3 flex items-center justify-center text-brown-100">
                  {card.ac}
                </div>
              </ImgDiv>
            </div>
          </div>

          {/* Info Container */}
          <div className="absolute h-[45%] justify-end -bottom-5 left-0 -right-4 flex  ">
            <ImgDiv src={CardTag} className={"w-[85%] h-full"}>
              {/* Info Container */}
              <div className="flex size-full w-[70%] mr-20 flex-col px-1 rotate-[-2deg]">
                <p className="text-brown-500 text-sm font-bold p-1 ">
                  Informações:
                </p>
                <textarea
                  id={`textAreaCard-${index}`}
                  className="cursor-text text-[10px] size-full font-normal font-[Marhey,sans-serif] text-brown-600 resize-none p-1 rotate-[1deg] cursor-default placeholder-brown-700/50 overflow-auto"
                  spellCheck="false"
                  onChange={(e) =>
                    setCard((prev) => ({
                      ...prev,
                      info: e.target.value,
                    }))
                  }
                  placeholder="Nada para mostrar..."
                  value={card.info ?? ""}
                ></textarea>
              </div>
            </ImgDiv>
          </div>
        </div>
      </ImgDiv>

      {/* index */}
      <div className="absolute right-full  -mr-1 -translate-y-1/2 top-1/2">
        <ImgDiv src={CardBtn} className={"p-2 text-brown-200 text-bold"}>
          {index}
        </ImgDiv>
      </div>
    </div>
  );
};

export default Home;
