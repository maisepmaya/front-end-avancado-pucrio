import { useEffect, useState } from "react";
import {
  GlobeIcon,
  UserIcon,
  CaretDownIcon,
  ArrowFatLineRightIcon,
  TrashIcon,
  SpinnerGapIcon,
  MagnifyingGlassIcon,
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

const SheetBar = ({
  handleDeleteSheet,
  handleSelectSheet,
}: {
  handleDeleteSheet?: (id: any) => void;
  handleSelectSheet?: (sheet: Sheet) => void;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sheetType, setType] = useState<"internet" | "user">("user");

  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [currPage, setPage] = useState<"list" | "loading" | "error">("list");

  const [search, setSearch] = useState("");
  const [endOfList, setEndOfList] = useState<boolean | "load">("load");

  const { sheetList, getSheetApi } = useSheet();

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

  const handleSearch = useDebounce(async (inputValue: any) => {
    setPage("loading");

    if (sheetType === "internet") await handleApiList(true, inputValue);
    else {
      setSheets(
        Object.values(sheetList).filter((i) =>
          i.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );

      setPage("list");
    }
  }, 500);

  useEffect(() => {
    setPage("list");

    const findSheetApi = async () => {
      setPage("loading");
      await handleApiList(true);
    };

    if (sheetType === "internet") findSheetApi();
    else {
      setSheets(Object.values(sheetList));
      setPage("list");
    }
  }, [sheetType, sheetList]);

  const screens = {
    loading: (
      <div className="w-full h-full flex items-center justify-center">
        <SpinnerGapIcon
          size={35}
          weight="bold"
          className="animate-spin fill-brown-100"
        />
      </div>
    ),
    list: (
      <>
        {sheets.length > 0 ? (
          <>
            {sheets.map((sheet, index) => (
              <SheetLi
                key={index}
                sheet={sheet}
                handleDelete={handleDeleteSheet}
                handleSelect={handleSelectSheet}
              />
            ))}

            {sheetType === "internet" && endOfList !== true && (
              <div className="w-full flex items-center justify-center">
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
              </div>
            )}
          </>
        ) : (
          <div className="text-brown-100">Nenhuma ficha encontrada.</div>
        )}
      </>
    ),
    error: (
      <div className="text-brown-100">
        Ops.. Parece que há um problema com os dados. Tente novamente mais
        tarde!
      </div>
    ),
  };
  return (
    <>
      <div
        className={
          "z-110 h-full absolute flex flex-row top-0 bottom-0 left-0 p-2 sm:relative transition-transform sm:translate-none " +
          `${isSidebarOpen ? "translate-none" : "-translate-x-[86%]"}`
        }
      >
        <aside
          className="h-full w-64"
          role="complementary"
          aria-label="Barra lateral de fichas"
        >
          <ImgDiv src={Banner} className="h-full" alt="Banner da barra lateral">
            <div className="size-full px-3 py-4 overflow-hidden flex flex-col">
              {/* Header */}
              <ImgDiv
                src={Wood}
                className={"h-15 flex-none"}
                alt="Fundo de madeira do cabeçalho"
              >
                <div className="size-full text-brown-100 font-title pt-2 text-lg font-bold flex items-center justify-center">
                  Fichas
                </div>
              </ImgDiv>

              <div className="px-4 flex-1 flex flex-col">
                {/* Actions */}
                <div className="flex-none">
                  {/* Buttons */}
                  {!handleDeleteSheet && (
                    <div
                      className="flex flex-row gap-4 items-center justify-center"
                      aria-label="Tipo de fichas"
                    >
                      <div
                        className={`${
                          sheetType === "internet" && "opacity-75 scale-90"
                        }`}
                      >
                        <HexagonButton
                          onClick={() => setType("user")}
                          title="Minhas fichas criadas"
                          aria-pressed={sheetType === "user"}
                          role="tab"
                          icon={
                            <UserIcon
                              size={28}
                              weight="bold"
                              className="fill-brown-100"
                            />
                          }
                        />
                      </div>
                      <div
                        className={`${
                          sheetType === "user" && "opacity-75 scale-90"
                        }`}
                      >
                        <HexagonButton
                          onClick={() => setType("internet")}
                          title="Procurar fichas na API"
                          aria-pressed={sheetType === "internet"}
                          role="tab"
                          icon={
                            <GlobeIcon
                              size={28}
                              weight="bold"
                              className="fill-brown-100"
                            />
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="p-2 flex justify-center gap-1 items-center">
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
                      icon={
                        <MagnifyingGlassIcon weight="bold" aria-hidden="true" />
                      }
                      className="bg-brown-100 text-black placeholder-brown-800/50"
                      aria-label="Buscar fichas por nome"
                    />
                  </div>

                  <hr className="py-1 border-brown-100 opacity-50 " />
                </div>

                {/* Sheet List */}
                <div className="relative flex-1 mb-15">
                  <ul
                    role="list"
                    aria-label={`Lista de fichas ${
                      sheetType === "user" ? "criadas" : "da API"
                    }`}
                    className="absolute px-2 inset-0 space-y-4 overflow-y-auto overflow-x-hidden max-h-[100%]"
                  >
                    {screens[currPage]}
                  </ul>
                </div>
              </div>
            </div>
          </ImgDiv>
        </aside>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="group -ml-2 inline-flex z-20 cursor-pointer mt-2 text-sm rounded-lg sm:hidden"
          aria-expanded={isSidebarOpen}
          aria-controls="sheet-sidebar"
          aria-label={
            isSidebarOpen ? "Fechar barra lateral" : "Abrir barra lateral"
          }
        >
          <div className="h-10 w-10 rounded-r bg-green-500 flex items-center justify-center">
            <ArrowFatLineRightIcon
              size={24}
              weight="fill"
              className={`transition-all ease-in-out animate-pulse fill-brown-100 group-active:scale-90 ${
                isSidebarOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            />
          </div>
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black opacity-25 cursor-pointer z-100 sm:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Fechar barra lateral"
          role="button"
          tabIndex={0}
        />
      )}
    </>
  );
};

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

  return (
    <li className="group relative">
      <div
        onClick={() => {
          if (handleSelect) handleSelect(sheet);
        }}
        role={handleSelect ? "button" : undefined}
        tabIndex={handleSelect ? 0 : undefined}
        aria-label={
          handleSelect ? `Adicionar ${sheet.name} ao grid` : undefined
        }
        className="w-2xs pointer active:scale-98 gap-2 cursor-pointer w-full z-20 flex relative items-center justify-between text-brown-200 font-bold transition-transform hover:scale-105"
      >
        {/* Image */}
        <div className="transition-all  aspect-square size-10 flex relative hover:static p-1 bg-brown-900 border-[3px] border-brown-200 rounded-lg shadow-[2px_2px_0px_#9b8356,inset_2px_2px_0px_#9b8356]">
          <img
            src={sheet.icon}
            alt={`Ícone de ${sheet.name}`}
            className="absolute p-1 inset-0 rounded-xl pointer-events-none select-none"
          />
        </div>

        {/* Name */}
        <p className="max-w-[80%] truncate overflow-hidden text-xs text-ellipsis">
          {sheet.name}
        </p>

        {/* Level */}
        <div className=" flex items-center gap-1">
          <span
            aria-label={`Nível ${sheet.level}`}
            className="bg-brown-200 text-brown-900 font-bold text-sm px-2 py-1 rounded h-[20px] flex items-center justify-center"
          >
            {sheet.level}
          </span>
        </div>

        {/* Buttons */}
        {handleDelete ? (
          <div className="transition-all relative group/btn">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(sheet.id);
              }}
              aria-label={`Deletar ficha ${sheet.name}`}
              className="z-15 absolute size-[48px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
            />

            <div className="transition-all group-hover/btn:scale-110 group-has-active/btn:scale-95">
              <SquareButton icon={<TrashIcon weight="bold" size={20} />} />
            </div>
          </div>
        ) : (
          <div className="sm:hidden relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenInfo((prev) => !prev);
              }}
              aria-expanded={openInfo}
              aria-label={`${openInfo ? "Ocultar" : "Mostrar"} informações de ${
                sheet.name
              }`}
              className="peer z-10 absolute size-[48px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
            />

            <CaretDownIcon
              size={24}
              weight="bold"
              className={
                "transition-all peer-active:scale-90 fill-brown-200 " +
                `${openInfo ? "rotate-180" : "rotate-0"}`
              }
            />
          </div>
        )}
      </div>

      {/* Info */}
      {!handleDelete && (
        <div
          className={
            "z-20 bg-brown-500 text-brown-100 rounded transition-all ease-in-out duration-200 overflow-hidden mt-2 top-full " +
            `group-hover:opacity-100 group-hover:pointer-events-auto group-hover:max-h-50 ${
              openInfo
                ? "pointer-events-auto opacity-100 max-h-50"
                : "pointer-events-none opacity-0 max-h-0 "
            }`
          }
        >
          <p className="m-1">Informações</p>
          <p className="m-1 text-xs ">{sheet.name}</p>

          {sheet.info != "" ? (
            <p className="m-1 font-normal text-xs line-clamp-9 text-justify">
              {sheet.info}
            </p>
          ) : (
            <p className="m-1 font-normal text-xs line-clamp-9 text-justify opacity-50">
              Sem informações...
            </p>
          )}
        </div>
      )}
    </li>
  );
};

export default SheetBar;
