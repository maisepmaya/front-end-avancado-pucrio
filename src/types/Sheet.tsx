export interface Sheet {
  icon: string;
  name: string;
  life: string;
  ac: string;
  level: string;
  info: string;
  id: string;
}

export type SheetAttr = "icon" | "name" | "life" | "ac" | "level" | "info";

export type SheetCreation = Record<SheetAttr, string>;

export type Sheets = Record<string, Sheet>;
