import { useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  HandHeartIcon,
  SkullIcon,
  SwordIcon,
  HeartIcon,
  BroomIcon,
  FlagIcon,
  PlusIcon,
} from "@phosphor-icons/react";

import FullHeart from "../assets/full-heart.png";
import Heart from "./../assets/heart.png";
import BrokeHeart from "./../assets/broke-heart.png";
import CardBase from "./../assets/card-base.png";
import CardTitle from "./../assets/card-title.png";
import CardTag from "./../assets/card-tag.png";
import CardBtn from "./../assets/card-btn.png";
import Shield from "./../assets/shield.png";
import D20 from "./../assets/icon.png";

import SheetBar from "../components/SheetBar";
import ImgDiv from "../components/ImgDiv";
import SquareButton from "../components/SquareButton";
import ButtonDefault from "../components/ButtonDefault";
import type { Card as CardType } from "../types/Card";
import useCard from "../contexts/CardContext/useCard";
import useSheet from "../contexts/SheetContext/useSheet";
import ConfirmModal from "../components/ConfirmModal";
import useDebounce from "../utils/debounce";
import { resolveIcon } from "../data/icons";

type ModalKind = "reset" | "defeated" | null;

const Home = () => {
  const { handleAdd, resetCardList, cardList, handleRemove } = useCard();
  const [modal, setModal] = useState<ModalKind>(null);

  const cards = useMemo(() => Object.values(cardList || {}), [cardList]);
  const defeated = cards.filter((card) => card.currLife <= 0);

  const handleRemoveDefeated = useCallback(() => {
    defeated.forEach((card) => handleRemove(card.id));
  }, [defeated, handleRemove]);

  return (
    <div className="relative flex size-full flex-row">
      {modal &&
        createPortal(
          modal === "reset" ? (
            <ConfirmModal
              onClose={() => setModal(null)}
              onConfirm={resetCardList}
              title="Encerrar combate?"
              text="Todos os inimigos saem da mesa. Suas fichas continuam salvas para a próxima batalha."
              confirmText="Encerrar"
              tone="danger"
            />
          ) : (
            <ConfirmModal
              onClose={() => setModal(null)}
              onConfirm={handleRemoveDefeated}
              title="Remover derrotados?"
              text={`${defeated.length} ${
                defeated.length === 1 ? "inimigo derrotado sai" : "inimigos derrotados saem"
              } da mesa.`}
              confirmText="Remover"
              tone="danger"
            />
          ),
          document.body
        )}

      <SheetBar handleSelectSheet={handleAdd} />

      <section
        className="relative flex min-w-0 flex-1 flex-col"
        aria-labelledby="combat-title"
      >
        <CombatHeader
          cards={cards}
          onReset={() => setModal("reset")}
          onRemoveDefeated={() => setModal("defeated")}
        />
        <Grid cards={cards} />
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Cabeçalho do combate: resumo da horda + ações em lote
// ---------------------------------------------------------------------------

const CombatHeader = ({
  cards,
  onReset,
  onRemoveDefeated,
}: {
  cards: CardType[];
  onReset: () => void;
  onRemoveDefeated: () => void;
}) => {
  const total = cards.length;
  const down = cards.filter((card) => card.currLife <= 0).length;
  const standing = total - down;

  const maxLife = cards.reduce((sum, card) => sum + Number(card.life || 0), 0);
  const currLife = cards.reduce(
    (sum, card) => sum + Math.max(0, Number(card.currLife || 0)),
    0
  );
  const percent = maxLife ? Math.round((currLife / maxLife) * 100) : 0;

  return (
    <header className="flex flex-none flex-col gap-3 px-3 pt-3 pb-2 pl-14 sm:px-6 sm:pt-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="text-left">
        <h1
          id="combat-title"
          className="text-2xl font-bold text-brown-100 drop-shadow-[0_2px_0_var(--color-brown-950)]"
        >
          Mesa de combate
        </h1>
        <p className="hidden text-sm text-brown-300 sm:block">
          {total
            ? "Clique numa ficha da barra lateral para invocar mais inimigos."
            : "Invoque inimigos a partir das suas fichas para começar."}
        </p>
      </div>

      {total > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <dl className="flex flex-wrap items-center gap-2 text-sm">
            <Stat icon={<SwordIcon weight="fill" />} label="na mesa" value={total} />
            <Stat
              icon={<HeartIcon weight="fill" />}
              label="de pé"
              value={standing}
              className="text-green-300"
            />
            <Stat
              icon={<SkullIcon weight="fill" />}
              label={down === 1 ? "derrotado" : "derrotados"}
              value={down}
              className="text-blood-400"
            />
          </dl>

          <div className="min-w-40 flex-1 text-left lg:w-48 lg:flex-none">
            <div className="mb-1 flex justify-between text-xs font-bold text-brown-300">
              <span>Vida da horda</span>
              <span>{percent}%</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-brown-950/70 ring-1 ring-brown-600"
              role="progressbar"
              aria-label="Vida total da horda"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blood-500 to-blood-400 transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="flex w-full gap-2 sm:w-auto [&>button]:flex-1 sm:[&>button]:flex-none">
            <ButtonDefault
              variant="ghost"
              size="sm"
              icon={<BroomIcon size={16} weight="bold" />}
              onClick={onRemoveDefeated}
              aria-label="Tirar derrotados da mesa"
              title="Tirar derrotados da mesa"
              disabled={down === 0}
            >
              <span className="pt-0.5">
                Tirar <span className="hidden sm:inline">derrotados</span>
              </span>
            </ButtonDefault>
            <ButtonDefault
              variant="danger"
              size="sm"
              icon={<FlagIcon size={16} weight="fill" />}
              onClick={onReset}
              aria-label="Encerrar combate"
            >
              <span className="pt-0.5">
                Encerrar <span className="hidden sm:inline">combate</span>
              </span>
            </ButtonDefault>
          </div>
        </div>
      )}
    </header>
  );
};

const Stat = ({
  icon,
  label,
  value,
  className = "text-brown-200",
}: {
  icon: ReactNode;
  label: string;
  value: number;
  className?: string;
}) => (
  <div
    className={`flex items-center gap-1.5 rounded-full bg-brown-950/50 px-3 py-1 whitespace-nowrap ring-1 ring-brown-700 ${className}`}
  >
    {icon}
    <dd className="font-bold">{value}</dd>
    <dt className="text-brown-300">{label}</dt>
  </div>
);

// ---------------------------------------------------------------------------
// Grid + estado vazio
// ---------------------------------------------------------------------------

const Grid = ({ cards }: { cards: CardType[] }) => {
  const { handleRemove, handleChange } = useCard();

  if (cards.length === 0) return <EmptyState />;

  return (
    <div className="relative flex-1">
      <ul
        className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(min(358px,100%),1fr))] content-start justify-items-center gap-x-4 gap-y-8 overflow-x-hidden overflow-y-auto px-4 pt-6 pb-10 sm:px-6"
        aria-label="Inimigos na mesa"
      >
        {cards.map((card, index) => (
          <Card
            index={index}
            key={card.id}
            item={card}
            handleRemove={handleRemove}
            handleChange={handleChange}
          />
        ))}
      </ul>
    </div>
  );
};

const EmptyState = () => {
  const { sheetList } = useSheet();
  const hasSheets = Object.keys(sheetList).length > 0;

  const steps = [
    { n: 1, title: "Crie uma ficha", text: "Nome, nível, vida, CA e um ícone." },
    { n: 2, title: "Invoque cópias", text: "Cada clique na ficha põe um inimigo numerado na mesa." },
    { n: 3, title: "Controle o combate", text: "Dano, cura e derrotas em tempo real." },
  ];

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
      <div className="flex max-w-xl flex-col items-center animate-fade-in">
        <img
          src={D20}
          alt=""
          className="mb-4 w-24 -rotate-12 drop-shadow-[0_6px_0_rgb(0_0_0/0.35)] transition-transform hover:rotate-12"
        />
        <h2 className="text-2xl font-bold text-brown-100">A mesa está vazia</h2>
        <p className="mt-1 text-brown-300">
          {hasSheets
            ? "Escolha uma ficha na barra lateral para invocar o primeiro inimigo."
            : "Que tal criar o primeiro inimigo da sua horda?"}
        </p>

        <ol className="mt-6 grid w-full gap-3 text-left sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="rounded-lg bg-brown-950/40 p-3 ring-1 ring-brown-700"
            >
              <span className="mb-1 inline-flex size-6 items-center justify-center rounded-full bg-gold-500 font-title text-sm font-bold text-brown-900">
                {step.n}
              </span>
              <p className="font-bold text-brown-100">{step.title}</p>
              <p className="text-sm text-brown-300">{step.text}</p>
            </li>
          ))}
        </ol>

        <Link to="/criar" className="mt-6 rounded-lg">
          <ButtonDefault
            tabIndex={-1}
            icon={<PlusIcon size={18} weight="bold" />}
            text="Criar ficha"
          />
        </Link>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Cartão de inimigo

/** Nomes longos diminuem um pouco em vez de serem cortados logo de cara. */
const titleSize = (name: string) =>
  name.length > 22 ? "text-[11px]" : name.length > 16 ? "text-[12.5px]" : "text-[15px]";
// ---------------------------------------------------------------------------

interface CardProps {
  handleRemove: (id: string) => void;
  handleChange: (id: string, card: CardType) => void;
  item: CardType;
  index: number;
}

const Card = ({ handleRemove, handleChange, item, index }: CardProps) => {
  const { sheetList } = useSheet();
  const [card, setCard] = useState<CardType>(item);
  const [lifeControl, setLifeControl] = useState(1);
  const [hit, setHit] = useState<{ kind: "damage" | "heal"; n: number }>();

  const maxLife = Number(card.life);
  const icon = resolveIcon(card.icon ?? sheetList[card.sheetId]?.icon);

  const currentHeartImage = useMemo(() => {
    if (card.currLife <= 0) return BrokeHeart;
    if (card.currLife < maxLife) return Heart;
    return FullHeart;
  }, [card.currLife, maxLife]);

  const heartRotation = useMemo(() => {
    if (card.currLife <= 0) return "-rotate-3";
    if (card.currLife < maxLife) return "-rotate-15 translate-x-1";
    return "rotate-0";
  }, [card.currLife, maxLife]);

  const handleLifeChange = (newLife: number) =>
    setCard((prev) => ({ ...prev, currLife: Math.max(0, newLife) }));

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
          newLife = maxLife;
          break;
      }

      setHit((prev) => ({
        kind: operation === "minus" ? "damage" : "heal",
        n: (prev?.n ?? 0) + 1,
      }));
      handleLifeChange(newLife);
      setLifeControl(1);
    },
    [card.currLife, lifeControl, maxLife]
  );

  const handleCardChange = useDebounce((id: string, updatedCard: CardType) => {
    handleChange(id, updatedCard);
  }, 500);

  useEffect(() => {
    if (card !== item) handleCardChange(card.id, card);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card]);

  useEffect(() => {
    setCard(item);
  }, [item]);

  const isDefeated = card.currLife <= 0;

  return (
    // Em telas estreitas (< 390px) o cartão inteiro encolhe na mesma proporção,
    // sem cortar a ilustração nem criar rolagem horizontal.
    <li
      className="h-[calc(244px*var(--s))] w-[calc(358px*var(--s))] [--s:1] max-[389px]:[--s:0.86] max-[359px]:[--s:0.78]"
      aria-label={`${card.name}, nível ${card.level}, ${card.currLife} de ${card.life} pontos de vida${
        isDefeated ? ", derrotado" : ""
      }`}
    >
     <div className="relative ml-7 w-[330px] origin-top-left scale-(--s) animate-pop-in">
      <div
        className={`transition-[filter,opacity] duration-300 ${
          isDefeated ? "opacity-70 grayscale" : ""
        }`}
      >
        <ImgDiv src={CardBase} className="z-5 aspect-[12/8] w-[330px]">
          <div className="relative flex size-full flex-col items-center">
            {/* Close Button */}
            <SquareButton
              btnType="exit"
              title={`Remover ${card.name} da mesa`}
              className="absolute right-0 z-10 w-7"
              onClick={() => handleRemove(card.id)}
              aria-label={`Remover ${card.name} da mesa`}
            />

            {/* Avatar */}
            <div className="absolute -top-3 -left-3 z-20 size-12 rounded-xl border-[3px] border-brown-200 bg-brown-900 p-1 shadow-[2px_2px_0_#9b8356]">
              <img src={icon} alt="" className="size-full object-contain" />
            </div>

            {/* Header */}
            <header className="absolute -top-2 right-0 left-0 flex h-[18%] items-center justify-center">
              <ImgDiv src={CardTitle} className="h-full w-[68%]">
                <div className="relative flex size-full rotate-[3deg] items-center justify-center gap-1.5 px-4">
                  <h3
                    className={`mt-1 truncate font-bold text-brown-800 ${titleSize(card.name)}`}
                    title={card.name}
                  >
                    {card.name}
                  </h3>
                  <span
                    className="flex h-[20px] shrink-0 items-center justify-center rounded bg-brown-800 px-1.5 text-xs font-bold text-brown-200"
                    title={`Nível ${card.level}`}
                  >
                    Nv {card.level}
                  </span>
                </div>
              </ImgDiv>
            </header>

            {/* Middle Section */}
            <div className="mt-6 flex h-[60%] w-[75%] items-center justify-evenly gap-1">
              {/* Life Controls */}
              <div className="flex h-[78%] flex-col items-center justify-center gap-1">
                <SquareButton
                  btnType="plus"
                  title={`Curar ${lifeControl} PV`}
                  className="aspect-square h-[32%]"
                  hitSlop="x"
                  onClick={() => handleChangeLife("plus")}
                  aria-label={`Curar ${lifeControl} pontos de vida de ${card.name}`}
                />

                <input
                  id={`lifeControlCard-${card.id}`}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="999"
                  className="h-[30%] w-13 rounded bg-brown-500 text-center text-xl font-bold text-brown-100 focus:ring-2 focus:ring-gold-300"
                  value={lifeControl}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setLifeControl(Math.max(1, Number(e.target.value)))
                  }
                  title="Quanto de dano ou cura aplicar"
                  aria-label={`Quantidade de dano ou cura para ${card.name}`}
                />

                <SquareButton
                  btnType="minus"
                  className="aspect-square h-[32%]"
                  hitSlop="x"
                  title={`Causar ${lifeControl} de dano`}
                  onClick={() => handleChangeLife("minus")}
                  aria-label={`Causar ${lifeControl} de dano em ${card.name}`}
                />
              </div>

              {/* Life Display */}
              <div className="relative aspect-square h-[72%]">
                <div
                  key={hit?.n}
                  className={`size-full ${
                    hit
                      ? hit.kind === "damage"
                        ? "animate-[hit_320ms_ease-out]"
                        : "animate-[heal_320ms_ease-out]"
                      : ""
                  }`}
                >
                  <ImgDiv
                    src={currentHeartImage}
                    className={`size-full transition-all ${heartRotation}`}
                  >
                    <div className="flex size-full flex-col items-center justify-center pb-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        id={`lifeCard-${card.id}`}
                        min="0"
                        max="9999"
                        className="h-8 w-[70%] bg-transparent text-center text-[26px] font-extrabold text-brown-50 [text-shadow:0_2px_0_rgb(0_0_0/0.35)]"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleLifeChange(Number(e.target.value))}
                        value={card.currLife}
                        title="Vida atual (clique para editar)"
                        aria-label={`Vida atual de ${card.name}`}
                      />
                      <span className="text-[11px] leading-none font-bold text-brown-50/85">
                        de {card.life}
                      </span>
                    </div>
                  </ImgDiv>
                </div>

                {/* Recover Life Button */}
                <button
                  type="button"
                  title="Recuperar toda a vida"
                  className="absolute -top-2 -right-2 rounded-full bg-parchment p-0.5 transition-all before:absolute before:-inset-2.5 before:content-[''] hover:scale-110 active:scale-95"
                  onClick={() => handleChangeLife("max")}
                  aria-label={`Recuperar toda a vida de ${card.name}`}
                >
                  <HandHeartIcon
                    size={22}
                    weight="fill"
                    className="fill-brown-500"
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* AC Display */}
              <div className="mt-6 aspect-square h-[42%]" title="Classe de Armadura">
                <ImgDiv src={Shield} className="size-full">
                  <div
                    className="flex size-full flex-col items-center justify-center pt-1 leading-none text-brown-50"
                    aria-label={`Classe de Armadura ${card.ac}`}
                  >
                    <span className="text-[9px] font-bold tracking-wide opacity-80">
                      CA
                    </span>
                    <span className="font-bold">{card.ac}</span>
                  </div>
                </ImgDiv>
              </div>
            </div>

            {/* Info Container */}
            <div className="absolute -right-4 -bottom-5 left-0 flex h-[45%] justify-end">
              <ImgDiv src={CardTag} className="h-full w-[85%]">
                <div className="mr-20 flex size-full w-[70%] rotate-[-2deg] flex-col px-1 text-left">
                  <label
                    htmlFor={`textAreaCard-${card.id}`}
                    className="px-1 pt-1 text-xs font-bold text-brown-600"
                  >
                    Anotações
                  </label>
                  <textarea
                    id={`textAreaCard-${card.id}`}
                    className="size-full rotate-[1deg] cursor-text resize-none overflow-auto bg-transparent p-1 text-[11px] leading-snug font-medium text-brown-700 placeholder-brown-700/50"
                    spellCheck="false"
                    onChange={(e) =>
                      setCard((prev) => ({ ...prev, info: e.target.value }))
                    }
                    placeholder="Condições, efeitos, lembretes..."
                    value={card.info ?? ""}
                  />
                </div>
              </ImgDiv>
            </div>
          </div>
        </ImgDiv>
      </div>

      {/* Carimbo de derrota */}
      {isDefeated && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <span className="rounded-md border-4 border-blood-500 bg-parchment/80 px-3 pt-1.5 pb-0.5 font-title text-xl font-bold tracking-widest text-blood-500 uppercase animate-stamp">
            Derrotado
          </span>
        </div>
      )}

      {/* Index Display */}
      <div className="absolute top-1/2 right-full -mr-1 -translate-y-1/2" aria-hidden>
        <ImgDiv src={CardBtn} className="p-2 font-bold text-brown-100">
          <span>{index + 1}</span>
        </ImgDiv>
      </div>
     </div>
    </li>
  );
};

export default Home;
