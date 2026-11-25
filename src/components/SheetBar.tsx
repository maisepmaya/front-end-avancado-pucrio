import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  GlobeIcon,
  UserIcon,
  CaretDownIcon,
  ArrowFatLineRightIcon,
  TrashIcon,
  SpinnerGapIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  HeartIcon,
  ShieldIcon,
} from "@phosphor-icons/react";
import ImgDiv from "./ImgDiv";
import { FormInput } from "./Form";
import HexagonButton from "./HexagonButton";
import SquareButton from "./SquareButton";

import Banner from "./../assets/banner.png";
import Wood from "./../assets/wood.png";

import useSheet from "../contexts/SheetContext/useSheet";
import type { Sheet } from "../types/Sheet";
import useDebounce from "../utils/debounce";
import { resolveIcon } from "../data/icons";

type SheetSource = "user" | "api";

const SheetBar = ({
  handleDeleteSheet,
  handleSelectSheet,
}: {
  handleDeleteSheet?: (id: string) => void;
  handleSelectSheet?: (sheet: Sheet, type: SheetSource) => void;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sheetType, setType] = useState<SheetSource>("user");

  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [currPage, setPage] = useState<"list" | "loading" | "error">("list");

  const [search, setSearch] = useState("");
  const [endOfList, setEndOfList] = useState<boolean | "load">("load");

  const { sheetList, getSheetApi } = useSheet();
  const isPicker = Boolean(handleSelectSheet);

  // Bestiário em páginas de PAGE_SIZE, carregadas sozinhas conforme a lista
  // rola (sem botão de "+"). requestId descarta respostas antigas quando a
  // busca muda no meio de um carregamento.
  const PAGE_SIZE = 20;
  const requestId = useRef(0);

  const handleApiList = async (reset: boolean, input?: string) => {
    const id = ++requestId.current;
    setEndOfList("load");

    const newSheet = await getSheetApi({
      start: reset ? 0 : sheets.length,
      count: PAGE_SIZE + 1,
      search: input ?? search,
    });

    if (id !== requestId.current) return;

    if (newSheet) {
      setEndOfList(newSheet.length <= PAGE_SIZE);
      const page = newSheet.slice(0, PAGE_SIZE);
      if (reset) setSheets(page);
      else setSheets((prev) => [...prev, ...page]);

      setPage("list");
      return;
    }

    setPage("error");
  };

  // Sentinela no fim da lista: quando chega perto da área visível, carrega mais.
  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const loadMoreRef = useRef(() => {});
  loadMoreRef.current = () => {
    if (sheetType === "api" && endOfList === false && currPage === "list") {
      handleApiList(false);
    }
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMoreRef.current();
      },
      { root: listRef.current, rootMargin: "0px 0px 240px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sheets.length, sheetType, endOfList, currPage]);

  const filterUserSheets = (term: string) =>
    Object.values(sheetList).filter((sheet) =>
      sheet.name.toLowerCase().includes(term.toLowerCase())
    );

  const handleSearch = useDebounce(async (inputValue: string) => {
    if (sheetType === "api") await handleApiList(true, inputValue);
    else {
      setSheets(filterUserSheets(inputValue));
      setPage("list");
    }
  }, 400);

  useEffect(() => {
    if (sheetType === "api") {
      setPage("loading");
      handleApiList(true);
    } else {
      setSheets(filterUserSheets(search));
      setPage("list");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetType, sheetList]);

  const changeType = (type: SheetSource) => {
    if (type === sheetType) return;
    setSearch("");
    setType(type);
  };

  const userHasNoSheets =
    sheetType === "user" && Object.keys(sheetList).length === 0;

  const emptyList = userHasNoSheets ? (
    <div className="flex flex-col items-center gap-3 px-2 pt-4 text-sm text-brown-100">
      <p>Você ainda não criou nenhuma ficha.</p>
      {isPicker && (
        <Link
          to="/criar"
          className="inline-flex items-center gap-1 rounded-lg bg-brown-900/70 px-3 py-1.5 font-bold text-brown-100 ring-1 ring-brown-200/40 hover:bg-brown-900"
        >
          <PlusIcon weight="bold" /> Criar ficha
        </Link>
      )}
    </div>
  ) : (
    <p className="px-2 pt-4 text-sm text-brown-100">
      {search
        ? `Nenhuma ficha encontrada para “${search}”.`
        : "Nenhuma ficha encontrada."}
    </p>
  );

  const screens = {
    loading: (
      <li className="flex h-full w-full items-center justify-center" role="status">
        <SpinnerGapIcon
          size={35}
          weight="bold"
          className="animate-spin fill-brown-100"
        />
        <span className="sr-only">Carregando fichas...</span>
      </li>
    ),
    list: (
      <>
        {sheets.length > 0 ? (
          <>
            {sheets.map((sheet) => (
              <SheetLi
                key={sheet.id}
                sheet={sheet}
                handleDelete={handleDeleteSheet}
                handleSelect={
                  handleSelectSheet
                    ? (selected) => handleSelectSheet(selected, sheetType)
                    : undefined
                }
              />
            ))}

            {sheetType === "api" && endOfList !== true && (
              <li
                ref={sentinelRef}
                className="flex w-full items-center justify-center py-3"
                role="status"
                aria-live="polite"
              >
                <SpinnerGapIcon
                  size={28}
                  weight="bold"
                  className={`animate-spin fill-brown-100 transition-opacity ${
                    endOfList === "load" ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {endOfList === "load" ? "Carregando mais fichas..." : ""}
                </span>
              </li>
            )}
          </>
        ) : (
          <li>{emptyList}</li>
        )}
      </>
    ),
    error: (
      <li className="px-2 pt-4 text-sm text-brown-100">
        Não conseguimos falar com o bestiário agora. Tente de novo em instantes.
      </li>
    ),
  };

  return (
    <>
      <div
        id="sheet-sidebar"
        className={
          "absolute top-0 bottom-0 left-0 z-110 flex h-full flex-row p-2 transition-transform sm:relative sm:translate-none sm:py-4 sm:pr-0 sm:pl-6 " +
          `${isSidebarOpen ? "translate-none" : "-translate-x-[86%]"}`
        }
      >
        <aside className="h-full w-64" aria-label="Fichas">
          <ImgDiv src={Banner} className="h-full">
            <div className="flex size-full flex-col overflow-hidden px-3 py-4">
              {/* Header */}
              <ImgDiv src={Wood} className="h-15 flex-none">
                <h2 className="flex size-full items-center justify-center pt-2 text-lg font-bold text-brown-100">
                  Fichas
                </h2>
              </ImgDiv>

              {/* Corpo entre as duas listras brancas do estandarte
                  (13% e 88% da largura do desenho → 36px e 222px numa barra de 256px) */}
              <div className="flex flex-1 flex-col pr-[22px] pl-6">
                <div className="flex-none">
                  {/* Fonte das fichas */}
                  {isPicker && (
                    <div
                      className="flex flex-row items-start justify-center gap-5"
                      role="tablist"
                      aria-label="Origem das fichas"
                    >
                      <SourceTab
                        active={sheetType === "user"}
                        onClick={() => changeType("user")}
                        label="Minhas"
                        title="Fichas que você criou"
                        icon={<UserIcon size={26} weight="bold" className="fill-brown-100" />}
                      />
                      <SourceTab
                        active={sheetType === "api"}
                        onClick={() => changeType("api")}
                        label="D&D 5e"
                        title="Bestiário oficial (5e SRD API)"
                        icon={<GlobeIcon size={26} weight="bold" className="fill-brown-100" />}
                      />
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="flex items-center justify-center gap-1 py-2">
                    <FormInput
                      type="search"
                      id="search-sheet"
                      placeholder="Pesquisar ficha..."
                      value={search}
                      onChange={(e) => {
                        setPage("loading");
                        setSearch(e.target.value);
                        handleSearch(e.target.value);
                      }}
                      icon={<MagnifyingGlassIcon weight="bold" aria-hidden="true" />}
                      className="bg-brown-100 text-brown-900 placeholder-brown-800/50"
                      aria-label="Buscar fichas por nome"
                    />
                  </div>

                  {isPicker && (
                    <p className="-mt-1 mb-2 text-xs font-semibold text-brown-100/80">
                      Clique numa ficha para invocar
                    </p>
                  )}

                  <hr className="border-brown-100 py-1 opacity-50" />
                </div>

                {/* Sheet List */}
                <div className="relative mb-15 flex-1">
                  <ul
                    ref={listRef}
                    aria-label={`Fichas ${sheetType === "user" ? "criadas por você" : "do bestiário D&D 5e"}`}
                    aria-busy={currPage === "loading"}
                    className="banner-scroll absolute inset-0 max-h-[100%] overflow-x-hidden overflow-y-auto"
                  >
                    {screens[currPage]}
                  </ul>
                </div>
              </div>
            </div>
          </ImgDiv>
        </aside>

        {/* Toggle Button (mobile) */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="group z-20 mt-2 -ml-2 inline-flex h-12 cursor-pointer self-start rounded-lg text-sm sm:hidden"
          aria-expanded={isSidebarOpen}
          aria-controls="sheet-sidebar"
          aria-label={isSidebarOpen ? "Fechar fichas" : "Abrir fichas"}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-r-lg bg-green-500 shadow-[2px_3px_0_var(--color-green-700)]">
            <ArrowFatLineRightIcon
              size={22}
              weight="fill"
              className={`fill-brown-100 transition-all ease-in-out group-active:scale-90 ${
                isSidebarOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            />
          </div>
        </button>
      </div>

      {/* Overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 z-100 cursor-pointer bg-black/40 animate-fade-in sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

const SourceTab = ({
  active,
  onClick,
  label,
  title,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title: string;
  icon: ReactNode;
}) => (
  <div
    className={`flex w-16 flex-col items-center gap-0.5 transition-all ${
      active ? "" : "scale-90 opacity-60 hover:opacity-90"
    }`}
  >
    <div className="size-13">
      <HexagonButton
        onClick={onClick}
        title={title}
        role="tab"
        aria-selected={active}
        icon={icon}
      />
    </div>
    <span
      className={`text-xs font-bold text-brown-100 ${
        active ? "underline decoration-2 underline-offset-4" : ""
      }`}
    >
      {label}
    </span>
  </div>
);

const SheetLi = ({
  handleDelete,
  handleSelect,
  sheet,
}: {
  handleDelete?: (id: string) => void;
  handleSelect?: (item: Sheet) => void;
  sheet: Sheet;
}) => {
  const [openInfo, setOpenInfo] = useState(false);
  const icon = resolveIcon(sheet.icon);
  const detailsId = `sheet-details-${sheet.id}`;
  // Imagens do bestiário D&D são pinturas inteiras (não ícones): preenchem a
  // moldura como um retrato, em vez de ficarem minúsculas com bordas vazias.
  const isPainting = /^https?:\/\//.test(icon);
  const [preview, setPreview] = useState<PreviewAnchor | null>(null);

  // Linha: [ícone] [nome + resumo] [ação]. Tudo alinhado pelo topo do nome,
  // com o resumo numa linha própria — nada fica espremido entre o nome e o botão.
  const content = (
    <>
      <span
        className={`relative flex size-9 flex-none overflow-hidden rounded-lg border-[3px] border-brown-200 bg-brown-900 shadow-[2px_2px_0px_#9b8356,inset_2px_2px_0px_#9b8356] ${
          isPainting ? "" : "p-1"
        }`}
        onMouseEnter={(e) => {
          // aparece ao lado da barra lateral (não por cima da lista)
          const icon = e.currentTarget.getBoundingClientRect();
          const bar = e.currentTarget.closest("aside")?.getBoundingClientRect();
          setPreview({ top: icon.top, height: icon.height, right: bar?.right ?? icon.right });
        }}
        onMouseLeave={() => setPreview(null)}
      >
        <img
          src={icon}
          alt=""
          className={`pointer-events-none size-full select-none ${
            isPainting ? "rounded-[3px] object-cover object-top" : "object-contain"
          }`}
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="line-clamp-2 text-sm leading-tight font-bold text-brown-50">
          {sheet.name}
        </span>
        <span className="flex flex-wrap items-center gap-x-1 text-xs font-semibold text-brown-200 [&>span]:whitespace-nowrap">
          <span title={`Nível ${sheet.level}`}>Nv {sheet.level}</span>
          <span className="flex items-center gap-0.5" title={`${sheet.life} pontos de vida`}>
            <HeartIcon weight="fill" className="text-blood-400" aria-hidden />
            {sheet.life}
            <span className="sr-only"> pontos de vida</span>
          </span>
          <span className="flex items-center gap-0.5" title={`Classe de armadura ${sheet.ac}`}>
            <ShieldIcon weight="fill" className="text-brown-300" aria-hidden />
            {sheet.ac}
            <span className="sr-only"> de classe de armadura</span>
          </span>
        </span>
      </span>
    </>
  );

  return (
    <li className="border-b border-brown-50/20 py-1.5 last:border-0">
      <div className="flex items-center gap-1">
        {handleSelect ? (
          <button
            type="button"
            onClick={() => handleSelect(sheet)}
            title={`Invocar ${sheet.name} na mesa`}
            className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-lg py-1 pr-1 transition-colors hover:bg-brown-50/10 active:scale-[0.98]"
          >
            {content}
          </button>
        ) : (
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 py-1">{content}</div>
        )}

        {handleDelete ? (
          <SquareButton
            className="w-7 flex-none"
            onClick={() => handleDelete(sheet.id)}
            aria-label={`Apagar ficha ${sheet.name}`}
            title="Apagar ficha"
            icon={<TrashIcon weight="bold" size={18} className="fill-brown-100" />}
          />
        ) : (
          <button
            type="button"
            onClick={() => setOpenInfo((prev) => !prev)}
            aria-expanded={openInfo}
            aria-controls={detailsId}
            aria-label={`${openInfo ? "Ocultar" : "Ver"} detalhes de ${sheet.name}`}
            title={openInfo ? "Ocultar detalhes" : "Ver detalhes"}
            className="relative flex h-8 w-7 flex-none items-center justify-center rounded-lg text-brown-100 transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-brown-50/10"
          >
            <CaretDownIcon
              size={18}
              weight="bold"
              className={`transition-transform duration-200 ${openInfo ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {preview && <IconPreview src={icon} name={sheet.name} isPainting={isPainting} anchor={preview} />}

      {/* Detalhes: texto completo, com rolagem própria em vez de cortar com "..." */}
      {!handleDelete && (
        <div
          id={detailsId}
          className="grid transition-[grid-template-rows] duration-200 ease-out"
          style={{ gridTemplateRows: openInfo ? "1fr" : "0fr" }}
          inert={!openInfo}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className={`mt-1 mb-0.5 max-h-56 overflow-y-auto rounded-lg bg-brown-950/45 px-2.5 py-2 text-left text-xs leading-relaxed whitespace-pre-line text-brown-100 ${
                sheet.info ? "" : "italic opacity-70"
              }`}
            >
              {sheet.info?.trim() || "Sem anotações."}
            </p>
          </div>
        </div>
      )}
    </li>
  );
};

type PreviewAnchor = { top: number; height: number; right: number };

/**
 * Ampliação ao passar o mouse sobre a imagem da ficha. Renderizada fora da
 * barra lateral (portal), para não ser cortada pela área de rolagem.
 */
const IconPreview = ({
  src,
  name,
  isPainting,
  anchor,
}: {
  src: string;
  name: string;
  isPainting: boolean;
  anchor: PreviewAnchor;
}) => {
  const SIZE = 168;
  const top = Math.min(
    Math.max(8, anchor.top + anchor.height / 2 - SIZE / 2),
    window.innerHeight - SIZE - 40
  );
  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed z-500 flex flex-col items-center gap-1.5 animate-pop-in"
      style={{ left: anchor.right + 12, top }}
    >
      <div
        className={`overflow-hidden rounded-xl border-4 border-brown-200 bg-brown-900 shadow-[4px_4px_0_#9b8356,0_16px_32px_rgb(0_0_0/0.5)] ${
          isPainting ? "" : "p-4"
        }`}
        style={{ width: SIZE, height: SIZE }}
      >
        <img
          src={src}
          alt=""
          className={`size-full ${isPainting ? "object-cover" : "object-contain"}`}
        />
      </div>
      <span className="max-w-[168px] rounded-md bg-brown-950/90 px-2 py-0.5 text-center text-xs font-bold text-brown-100">
        {name}
      </span>
    </div>,
    document.body
  );
};

export default SheetBar;
