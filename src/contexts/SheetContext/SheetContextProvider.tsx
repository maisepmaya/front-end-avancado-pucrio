import { type ReactNode, useState, useEffect } from "react";
import type { Sheets, SheetCreation, Sheet } from "../../types/Sheet";
import SheetContext from "./SheetContext";
import { createSheet, deleteSheet, getAllSheets } from "../../services/api";

interface ISheetProvider {
  children: ReactNode;
}

interface ISheetData {
  sheetList: Sheets | null;
  sheetApiList: any;
}

const SheetProvider = ({ children }: ISheetProvider) => {
  const [{ sheetList, sheetApiList }, setData] = useState<ISheetData>({
    sheetList: null,
    sheetApiList: null,
  });

  const handleCreate = (newSheet: SheetCreation) => {
    createSheet(newSheet)
      .then((createdSheet) => {
        setData((prev) => ({
          ...prev,
          sheetList: {
            ...prev.sheetList,
            [createdSheet.id]: createdSheet,
          },
        }));
      })
      .catch((error) => {
        console.error("Failed to create sheet:", error);
        alert("Erro ao criar a ficha. Tente novamente.");
      });

    return true;
  };

  const handleDelete = (id: string) => {
    deleteSheet(id)
      .then(() => {
        setData((prev) => {
          const newSheetList = { ...prev.sheetList };
          delete newSheetList[id];
          return {
            ...prev,
            sheetList: newSheetList,
          };
        });
      })
      .catch((error) => {
        console.error("Failed to delete sheet:", error);
        alert("Erro ao deletar a ficha. Tente novamente.");
      });

    return true;
  };

  const getSheetApi = async ({
    count,
    start,
    search,
  }: {
    count: number;
    start: number;
    search?: string;
  }) => {
    if (!sheetApiList) return null;

    const matchedSheet = search
      ? sheetApiList.filter((monster: any) => {
          return monster.name.toLowerCase().includes(search.toLowerCase());
        })
      : sheetApiList;

    const sliceIndex = matchedSheet.slice(start, start + count);

    if (matchedSheet) {
      try {
        const apiSheet = await Promise.all(
          sliceIndex.map((index: any) =>
            fetch(`https://www.dnd5eapi.co${index.url}`).then((response) =>
              response.json()
            )
          )
        );

        const sheets = apiSheet.map(
          (character) =>
            ({
              id: character.index,
              icon: `https://www.dnd5eapi.co${character.image}`,
              name: character.name,
              life: String(character.hit_points),
              ac: character.armor_class.map((ac: any) => ac.value).join(", "),
              level: String(character.challenge_rating),
              info: `
            ${character.size} ${character.type}, ${character.alignment}.

Força: ${character.strength}, Destreza: ${character.dexterity}, Constituição: ${
                character.constitution
              }, Inteligência: ${character.intelligence}, Sabedoria: ${
                character.wisdom
              }, Carisma: ${character.charisma}

Idiomas: ${character.languages || "—"}.

Sentidos: visão no escuro ${
                character.senses.darkvision || "0"
              }, percepção passiva ${character.senses.passive_perception}.

Imunidades a Dano: ${
                character.damage_immunities.length > 0
                  ? character.damage_immunities.join(", ")
                  : "—"
              }.
Imunidade a Condição: ${
                character.condition_immunities.length > 0
                  ? character.condition_immunities
                      .map((c: any) => c.name)
                      .join(", ")
                  : "—"
              }.
`.trim(),
            } as Sheet)
        );

        return sheets;
      } catch (error) {
        alert(
          "Ocorreu um erro na comunicação com o servidor. Tente novamente."
        );
        return null;
      }
    }

    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      const newSheets: ISheetData = {
        sheetList: {},
        sheetApiList: null,
      };

      try {
        console.log("teste");
        const sheets = await getAllSheets("independent");

        newSheets.sheetList = sheets ?? {};
      } catch (error) {
        console.error("Failed to fetch sheets:", error);
      }

      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");

      const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      await fetch("https://www.dnd5eapi.co/api/monsters", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if (data.results) newSheets.sheetApiList = data.results;
        })
        .catch((error) => {
          console.error(error);
        });

      setData(newSheets);
    };

    if (!sheetList || !sheetApiList) fetchData();
  }, []);

  return (
    <SheetContext.Provider
      value={{
        sheetList: sheetList ?? {},
        handleCreate,
        handleDelete,
        getSheetApi,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};

export default SheetProvider;
