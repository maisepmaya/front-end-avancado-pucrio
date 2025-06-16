import { createContext } from "react";
import { Sheet, SheetCreation, Sheets } from "../../types/Sheet";

interface ISheetContextData {
  sheetList: Sheets;
  handleCreate: ({
    name,
    level,
    life,
    ac,
    info,
    icon,
  }: SheetCreation) => boolean;
  handleDelete: (id: string) => boolean;
  getSheetApi: (obj: {
    count: number;
    start: number;
    search?: string;
  }) => Promise<Array<Sheet> | null>;
}

const SheetContext = createContext({} as ISheetContextData);

export default SheetContext;
