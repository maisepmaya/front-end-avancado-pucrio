"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

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
import type { Card as CardType } from "../types/Card";
import useCard from "../contexts/CardContext/useCard";
import { HandHeartIcon } from "@phosphor-icons/react";
import ConfirmModal from "../components/ConfirmModal";
import useDebounce from "../utils/debounce";

const Home = () => {
  const { handleAdd, resetCardList } = useCard();
  const [modal, openModal] = useState(false);

  const handleResetConfirm = useCallback(() => {
    resetCardList();
    openModal(false);
  }, [resetCardList]);

  return (
    <main className="flex relative flex-row size-full">
      {modal &&
        createPortal(
          <ConfirmModal
            onClose={() => openModal(false)}
            onConfirm={handleResetConfirm}
            title="Resetar Cartões"
            text="Todos os cartões serão removidos. Deseja continuar?"
          />,
          document.body
        )}

      <SheetBar handleClickItem={handleAdd} />

      <section className="w-full relative" aria-label="Grid de combate">
        <Grid />
        <ButtonDefault
          className="bg-green-500 text-brown-200 shadow-teal-500 absolute sm:bottom-5 right-4 top-4 sm:top-auto sm:right-1/2 sm:-translate-x-1/2 z-40 focus:outline-none focus:ring-2 focus:ring-green-300"
          text="Resetar"
          onClick={() => openModal(true)}
          aria-label="Resetar todos os cartões do grid de combate"
        />
      </section>
    </main>
  );
};

const Grid = () => {
  const { handleRemove, cardList, handleChange } = useCard();

  const cardArray = useMemo(() => Object.values(cardList || {}), [cardList]);

  const hasCards = cardArray.length > 0;

  if (!hasCards) {
    return (
      <div
        className="absolute p-4 inset-0 text-brown-200 opacity-50 flex items-center justify-center text-center"
        role="status"
        aria-live="polite"
      >
        <p>
          Nada para ser mostrado por enquanto. Selecione uma ficha para inserir
          um cartão!
        </p>
      </div>
    );
  }

  return (
    <div
      className="absolute p-4 sm:mt-0 mt-18 justify-items-center content-start gap-5 items-center inset-0 overflow-y-auto overflow-x-hidden mx-0 my-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      role="grid"
      aria-label="Grid de cartões de combate"
    >
      {cardArray.map((card, index) => (
        <Card
          index={index}
          key={card.id}
          item={card}
          handleRemove={handleRemove}
          handleChange={handleChange}
        />
      ))}
    </div>
  );
};

interface CardProps {
  handleRemove: (id: string) => void;
  handleChange: (id: string, card: CardType) => void;
  item: CardType;
  index: number;
}

const Card = ({ handleRemove, handleChange, item, index }: CardProps) => {
  const [card, setCard] = useState<CardType>(item);
  const [lifeControl, setLifeControl] = useState(1);

  const currentHeartImage = useMemo(() => {
    if (card.currLife <= 0) return BrokeHeart;
    if (card.currLife < Number(card.life)) return Heart;
    return FullHeart;
  }, [card.currLife, card.life]);

  const heartRotation = useMemo(() => {
    if (card.currLife <= 0) return "-rotate-3";
    if (card.currLife < Number(card.life)) return "-rotate-15 translate-x-1";
    return "rotate-0";
  }, [card.currLife, card.life]);

  const handleLifeChange = (newLife: number) =>
    setCard((prev) => ({ ...prev, currLife: newLife }));

  const handleChangeLife = useCallback(
    (operation: "plus" | "minus" | "max") => {
      let newLife = card.currLife;

      switch (operation) {
        case "plus":
          newLife += lifeControl;
          break;
        case "minus":
          newLife -= lifeControl;
          break;
        case "max":
          newLife = Number(card.life);
          break;
      }

      handleLifeChange(newLife);
      setLifeControl(1);
    },
    [card.currLife, lifeControl]
  );

  const handleCardChange = useDebounce((id: string, updatedCard: CardType) => {
    handleChange(id, updatedCard);
  }, 500);

  useEffect(() => {
    handleCardChange(card.id, card);
  }, [card]);

  useEffect(() => {
    setCard(item);
  }, [item]);

  const isDefeated = card.currLife <= 0;

  return (
    <article
      className={`relative m-2 transition-all ${
        isDefeated ? "opacity-50 grayscale-50" : ""
      }`}
      role="gridcell"
      aria-label={`Cartão de ${card.name}, nível ${card.level}`}
    >
      <ImgDiv
        src={CardBase}
        className="z-5 w-xs aspect-[12/8]"
        alt={`Cartão base para ${card.name}`}
      >
        <div className="relative size-full flex flex-col items-center">
          {/* Close Button */}
          <SquareButton
            btnType="exit"
            title={`Remover cartão de ${card.name}`}
            className="absolute w-7 right-0 aspect-square transition-transform hover:scale-110 active:scale-100 z-10"
            onClick={() => handleRemove(card.id)}
            aria-label={`Remover cartão de ${card.name}`}
          />

          {/* Header */}
          <header className="absolute -top-2 left-0 right-0 h-[18%] flex items-center justify-center">
            <ImgDiv
              src={CardTitle}
              className="w-[55%] h-full"
              alt="Fundo do título do cartão"
            >
              <div className="size-full relative gap-1 px-4 flex items-center justify-evenly rotate-[3deg]">
                <h3 className="font-bold text-[15px] text-brown-800 mt-1 truncate">
                  {card.name}
                </h3>
                <span
                  className="bg-brown-800 text-brown-200 font-bold text-sm px-2 py-1 rounded h-[20px] flex items-center justify-center"
                  aria-label={`Nível ${card.level}`}
                >
                  {card.level}
                </span>
              </div>
            </ImgDiv>
          </header>

          {/* Middle Section */}
          <div className="mt-6 w-[75%] h-[60%] gap-1 flex justify-evenly items-center">
            {/* Life Controls */}
            <div className="flex flex-col items-center justify-center gap-1 h-[70%]">
              <SquareButton
                btnType="plus"
                title={`Adicionar ${lifeControl} ponto(s) de vida`}
                className="h-[35%] aspect-square transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => handleChangeLife("plus")}
                aria-label={`Adicionar ${lifeControl} ponto(s) de vida`}
              />

              <label htmlFor={`lifeControlCard-${index}`} className="sr-only">
                Controle de vida para {card.name}
              </label>
              <input
                id={`lifeControlCard-${index}`}
                type="number"
                min="1"
                max="999"
                className="w-13 h-[30%] text-center bg-brown-500 rounded text-xl font-bold text-brown-200 appearance-none focus:outline-none focus:ring-2 focus:ring-brown-300"
                value={lifeControl}
                onChange={(e) =>
                  setLifeControl(Math.max(1, Number(e.target.value)))
                }
                aria-label={`Quantidade de vida para adicionar ou remover de ${card.name}`}
              />

              <SquareButton
                btnType="minus"
                className="h-[35%] aspect-square transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300"
                title={`Remover ${lifeControl} ponto(s) de vida`}
                onClick={() => handleChangeLife("minus")}
                aria-label={`Remover ${lifeControl} ponto(s) de vida`}
              />
            </div>

            {/* Life Display */}
            <div className="relative aspect-square h-[70%]">
              <ImgDiv
                src={currentHeartImage}
                className={`transition-all size-full ${heartRotation}`}
                alt={`Coração representando vida atual: ${card.currLife}/${card.life}`}
              >
                <div className="size-full flex items-center justify-center">
                  <label htmlFor={`lifeCard-${index}`} className="sr-only">
                    Vida atual de {card.name}
                  </label>
                  <input
                    type="number"
                    id={`lifeCard-${index}`}
                    min="0"
                    max="9999"
                    className="text-[25px] size-full font-bold text-center text-brown-200 bg-transparent"
                    onChange={(e) => handleLifeChange(Number(e.target.value))}
                    value={card.currLife}
                    aria-label={`Vida atual de ${card.name}: ${card.currLife} de ${card.life}`}
                  />
                </div>
              </ImgDiv>

              {/* Recover Life Button */}
              <button
                title={`Recuperar vida completa para ${card.name}`}
                className="transition-all absolute hover:scale-105 active:scale-95 -top-2 -right-2 focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
                onClick={() => handleChangeLife("max")}
                aria-label={`Recuperar vida completa para ${card.name}`}
              >
                <HandHeartIcon
                  size={24}
                  weight="fill"
                  className="fill-brown-500"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* AC Display */}
            <div className="aspect-square h-[40%] mt-6">
              <ImgDiv
                src={Shield}
                className="size-full"
                alt={`Escudo mostrando CA ${card.ac}`}
              >
                <div
                  className="size-full pt-3 flex items-center justify-center text-brown-100"
                  aria-label={`Classe de Armadura: ${card.ac}`}
                >
                  {card.ac}
                </div>
              </ImgDiv>
            </div>
          </div>

          {/* Info Container */}
          <div className="absolute h-[45%] justify-end -bottom-5 left-0 -right-4 flex">
            <ImgDiv
              src={CardTag}
              className="w-[85%] h-full"
              alt="Pergaminho de informações"
            >
              <div className="flex size-full w-[70%] mr-20 flex-col px-1 rotate-[-2deg]">
                <label
                  htmlFor={`textAreaCard-${index}`}
                  className="text-brown-500 text-sm font-bold p-1"
                >
                  Informações:
                </label>
                <textarea
                  id={`textAreaCard-${index}`}
                  className="cursor-text text-[10px] size-full font-normal  text-brown-600 resize-none p-1 rotate-[1deg] placeholder-brown-700/50 overflow-auto"
                  spellCheck="false"
                  onChange={(e) =>
                    setCard((prev) => ({ ...prev, info: e.target.value }))
                  }
                  placeholder="Nada para mostrar..."
                  value={card.info ?? ""}
                  aria-label={`Informações adicionais para ${card.name}`}
                />
              </div>
            </ImgDiv>
          </div>
        </div>
      </ImgDiv>

      {/* Index Display */}
      <div className="absolute right-full -mr-1 -translate-y-1/2 top-1/2">
        <ImgDiv
          src={CardBtn}
          className="p-2 text-brown-200 text-bold"
          alt={`Índice do cartão: ${index + 1}`}
        >
          <span aria-label={`Cartão número ${index + 1}`}>{index + 1}</span>
        </ImgDiv>
      </div>
    </article>
  );
};

export default Home;
