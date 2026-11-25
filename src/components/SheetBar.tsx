import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  GlobeIcon,
  UserIcon,
  CaretDownIcon,
  ArrowFatLineRightIcon,
  TrashIcon,
  SpinnerGapIcon,
  MagnifyingGlassIcon,
  PlusIcon,
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

  const handleApiList = async (reset: boolean, input?: string) => {
    setEndOfList("load");

    const newSheet = await getSheetApi({
      start: reset ? 0 : sheets.length,
      count: 11,
      search: input ?? search,
    });

    if (newSheet) {
      setEndOfList(newSheet.length <= 10);
      if (reset) setSheets(newSheet.slice(0, 10));
      else setSheets((prev) => [...prev, ...newSheet.slice(0, 10)]);

      setPage("list");
      return;
    }

    setPage("error");
  };

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
              <li className="flex w-full items-center justify-center">
                {endOfList === "load" ? (
                  <div role="status" aria-live="polite">
                    <SpinnerGapIcon
                      size={35}
                      weight="bold"
                      className="animate-spin fill-brown-100"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Carregando mais fichas...</span>
                  </div>
                ) : (
                  <SquareButton
                    btnType="plus"
                    className="w-10"
                    onClick={() => handleApiList(false)}
                    aria-label="Carregar mais fichas"
                    title="Carregar mais fichas"
                  />
                )}
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
          "absolute top-0 bottom-0 left-0 z-110 flex h-full flex-row p-2 transition-transform sm:relative sm:translate-none " +
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

              <div className="flex flex-1 flex-col px-4">
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
                  <div className="flex items-center justify-center gap-1 p-2">
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
                    aria-label={`Fichas ${sheetType === "user" ? "criadas por você" : "do bestiário D&D 5e"}`}
                    aria-busy={currPage === "loading"}
                    className="absolute inset-0 max-h-[100%] space-y-3 overflow-x-hidden overflow-y-auto px-1 py-1"
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
          className="group z-20 mt-3 -ml-2 inline-flex cursor-pointer rounded-lg text-sm sm:hidden"
          aria-expanded={isSidebarOpen}
          aria-controls="sheet-sidebar"
          aria-label={isSidebarOpen ? "Fechar fichas" : "Abrir fichas"}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-r-lg bg-green-500 shadow-[2px_3px_0_var(--color-green-700)]">
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

  const content = (
    <>
      <span className="relative flex size-10 flex-none rounded-lg border-[3px] border-brown-200 bg-brown-900 p-1 shadow-[2px_2px_0px_#9b8356,inset_2px_2px_0px_#9b8356]">
        <img
          src={icon}
          alt=""
          className="pointer-events-none size-full object-contain select-none"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
      </span>
      <span className="line-clamp-2 flex-1 text-left text-xs leading-tight">
        {sheet.name}
      </span>
      <span
        title={`Nível ${sheet.level}`}
        className={`${handleDelete ? "hidden" : "flex"} h-[20px] flex-none items-center justify-center rounded bg-brown-200 px-1.5 text-xs font-bold text-brown-900`}
      >
        Nv {sheet.level}
      </span>
    </>
  );

  return (
    <li className="group relative">
      <div className="relative z-20 flex w-full items-center gap-2 font-bold text-brown-100">
        {handleSelect ? (
          <button
            type="button"
            onClick={() => handleSelect(sheet)}
            title={`Invocar ${sheet.name} na mesa`}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg p-0.5 transition-transform hover:scale-[1.04] active:scale-[0.97]"
          >
            {content}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2 p-0.5">{content}</div>
        )}

        {handleDelete ? (
          <SquareButton
            className="w-9 flex-none"
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
            aria-label={`${openInfo ? "Ocultar" : "Mostrar"} detalhes de ${sheet.name}`}
            className="flex-none rounded p-1 sm:hidden"
          >
            <CaretDownIcon
              size={20}
              weight="bold"
              className={`fill-brown-200 transition-all ${openInfo ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Detalhes (hover no desktop, toque no mobile) */}
      {!handleDelete && (
        <div
          className={
            "z-20 mt-2 overflow-hidden rounded-md bg-brown-900/60 text-left text-brown-100 transition-all duration-200 ease-in-out " +
            `group-hover:pointer-events-auto group-hover:max-h-60 group-hover:opacity-100 ${
              openInfo
                ? "pointer-events-auto max-h-60 opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            }`
          }
        >
          <dl className="flex gap-3 px-2 pt-2 text-xs">
            <div>
              <dt className="inline text-brown-300">PV </dt>
              <dd className="inline font-bold">{sheet.life}</dd>
            </div>
            <div>
              <dt className="inline text-brown-300">CA </dt>
              <dd className="inline font-bold">{sheet.ac}</dd>
            </div>
          </dl>
          <p
            className={`line-clamp-6 px-2 pt-1 pb-2 text-xs font-normal whitespace-pre-line ${
              sheet.info ? "" : "opacity-60"
            }`}
          >
            {sheet.info || "Sem anotações."}
          </p>
        </div>
      )}
    </li>
  );
};

export default SheetBar;
